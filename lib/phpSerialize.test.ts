import { describe, it, expect } from "vitest"
import { serialize, unserialize, jsonToPhpSerialize, phpSerializeToJson } from "./phpSerialize"

describe("phpSerialize", () => {
  it("serializes simple array a:2:{i:0;s:3:\"foo\";i:1;s:3:\"bar\";}", () => {
    const arr = ["foo", "bar"]
    expect(serialize(arr)).toBe('a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}')
    expect(unserialize('a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}')).toEqual(arr)
  })

  it("string, int, bool, null roundtrip", () => {
    expect(serialize("hello")).toBe('s:5:"hello";')
    expect(unserialize('s:5:"hello";')).toBe("hello")
    expect(serialize(42)).toBe('i:42;')
    expect(unserialize('i:42;')).toBe(42)
    expect(serialize(true)).toBe('b:1;')
    expect(unserialize('b:1;')).toBe(true)
    expect(serialize(false)).toBe('b:0;')
    expect(unserialize('b:0;')).toBe(false)
    expect(serialize(null)).toBe('N;')
    expect(unserialize('N;')).toBeNull()
  })

  it("associative array <-> object", () => {
    const obj = { name: "Alice", age: 30 }
    const ser = serialize(obj)
    // expect pattern a:2:{s:4:"name";s:5:"Alice";s:3:"age";i:30;}
    expect(ser).toContain('s:4:"name"')
    expect(ser).toContain('i:30;')
    expect(unserialize(ser)).toEqual(obj)
  })

  it("json <-> php serialize helpers", () => {
    const json = JSON.stringify({ a: 1, b: [2, 3], c: "hi" })
    const php = jsonToPhpSerialize(json)
    expect(php).toContain("a:3:{")
    const back = phpSerializeToJson(php)
    expect(JSON.parse(back)).toEqual(JSON.parse(json))

    // array json
    const jsonArr = JSON.stringify(["x", "y"])
    expect(unserialize(jsonToPhpSerialize(jsonArr))).toEqual(["x", "y"])
  })

  it("nested and float, unicode", () => {
    const nested = { arr: [1, { nested: true }], num: 3.14 }
    const ser = serialize(nested)
    expect(unserialize(ser)).toEqual(nested)
    expect(serialize(3.14)).toBe('d:3.14;')
    expect(unserialize('d:3.14;')).toBe(3.14)
    // unicode string byte length
    expect(serialize("你好")).toBe('s:6:"你好";')
    expect(unserialize('s:6:"你好";')).toBe("你好")
    // error cases
    expect(() => unserialize('s:5:"hi";')).toThrow()
    expect(() => jsonToPhpSerialize("not json")).toThrow()
  })
})
