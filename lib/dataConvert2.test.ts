import { describe, it, expect } from "vitest"
import {
  jsonToSql,
  sqlToJson,
  jsonToCookie,
  cookieToJson,
  jsonToBase64,
  base64ToJson,
  xmlToBase64,
  base64ToXml,
  jsonToExcel,
  excelToJson,
} from "./dataConvert2"

describe("dataConvert2", () => {
  it("jsonToSql single & multiple rows and escaping", () => {
    const json = JSON.stringify([{ a: 1, b: "hello" }, { a: 3, b: "O'Reilly", c: null }])
    const sql = jsonToSql(json, "users")
    expect(sql).toContain("INSERT INTO `users`")
    expect(sql).toContain("`a`")
    expect(sql).toContain("`b`")
    expect(sql).toContain("`c`")
    expect(sql).toContain("'hello'")
    // O'Reilly should be escaped as O''Reilly
    expect(sql).toContain("'O''Reilly'")
    expect(sql).toContain("NULL")
  })

  it("sqlToJson parses INSERT and roundtrip via jsonToSql", () => {
    const orig = [{ id: 1, name: "Alice", age: 30 }, { id: 2, name: "Bob", age: 25 }]
    const sql = jsonToSql(JSON.stringify(orig), "t")
    const jsonStr = sqlToJson(sql)
    expect(JSON.parse(jsonStr)).toEqual(orig)

    // direct parse single with quoted commas
    const single = "INSERT INTO `my_table` (`a`, `b`) VALUES (1, 'hello, world'), (2, 'test');"
    expect(JSON.parse(sqlToJson(single))).toEqual([{ a: 1, b: "hello, world" }, { a: 2, b: "test" }])
  })

  it("jsonToCookie & cookieToJson roundtrip and encode", () => {
    const json = JSON.stringify({ a: "1", b: "hello world", c: "a=1&b=2" })
    const cookie = jsonToCookie(json)
    expect(cookie).toBe("a=1; b=hello%20world; c=a%3D1%26b%3D2")
    expect(JSON.parse(cookieToJson(cookie))).toEqual({ a: "1", b: "hello world", c: "a=1&b=2" })

    // cookie with spaces and extra attributes
    const c2 = "foo=bar; hello=world%20test; empty="
    const obj = JSON.parse(cookieToJson(c2))
    expect(obj).toEqual({ foo: "bar", hello: "world test", empty: "" })
  })

  it("cookieToJson throws on empty and jsonToCookie validates flat object", () => {
    expect(() => cookieToJson("   ")).toThrow()
    expect(() => jsonToCookie(JSON.stringify([1, 2, 3]))).toThrow()
    expect(() => jsonToCookie("not json")).toThrow()
  })

  it("jsonToBase64 & base64ToJson roundtrip with unicode", () => {
    const json = JSON.stringify({ name: "张三", city: "北京", num: 123, arr: [1, 2, 3] })
    const b64 = jsonToBase64(json)
    // verify it's base64
    expect(b64).toMatch(/^[A-Za-z0-9+/=]+$/)
    const decoded = base64ToJson(b64)
    expect(JSON.parse(decoded)).toEqual(JSON.parse(json))

    // invalid json input throws
    expect(() => jsonToBase64("not json")).toThrow()
    expect(() => base64ToJson("!!!invalid")).toThrow()
  })

  it("xmlToBase64 & base64ToXml roundtrip", () => {
    const xml = `<root><name>张三</name><value>hello & world</value></root>`
    const b64 = xmlToBase64(xml)
    expect(b64).toMatch(/^[A-Za-z0-9+/=]+$/)
    expect(base64ToXml(b64)).toBe(xml)

    // also test unicode xml
    const xml2 = `<?xml version="1.0"?><note><to>User</to><body>你好</body></note>`
    expect(base64ToXml(xmlToBase64(xml2))).toBe(xml2)
    expect(() => xmlToBase64("not xml")).toThrow()
  })

  it("jsonToExcel & excelToJson roundtrip with quoting", () => {
    const data = [
      { name: "Alice", age: 30, city: "New York" },
      { name: "Bob, Jr.", age: 25, city: 'He said "hi"' },
      { name: "Carol", age: 28, city: "北京" },
    ]
    const csv = jsonToExcel(JSON.stringify(data))
    expect(csv.split("\n")[0]).toBe("name,age,city")
    expect(csv).toContain('"Bob, Jr."')
    expect(csv).toContain('"He said ""hi"""')
    const decoded = JSON.parse(excelToJson(csv))
    expect(decoded).toEqual(data)

    // single object wrapping
    const single = JSON.stringify({ a: 1, b: 2 })
    const csv2 = jsonToExcel(single)
    expect(JSON.parse(excelToJson(csv2))).toEqual([{ a: 1, b: 2 }])
  })

  it("excelToJson handles numeric coercion and empty handling", () => {
    const csv = "id,name,score,active\n1,Alice,99.5,true\n2,Bob,80,false\n3,Carol,,null"
    const arr = JSON.parse(excelToJson(csv))
    expect(arr[0]).toEqual({ id: 1, name: "Alice", score: 99.5, active: true })
    expect(arr[1].score).toBe(80)
    expect(arr[2].score).toBe("")
    expect(arr[2].active).toBe(null)

    // complex csv with quoted newline/comma
    const csv2 = `a,b\n"hello, world","line\nbreak"\nfoo,bar`
    const parsed2 = JSON.parse(excelToJson(csv2))
    expect(parsed2[0].a).toBe("hello, world")
    expect(parsed2[0].b).toBe("line\nbreak")
  })
})
