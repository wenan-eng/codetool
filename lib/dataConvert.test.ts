import { describe, it, expect } from "vitest"
import { jsonToCsv, csvToJson, jsonToYaml, yamlToJson, jsonToXml, xmlToJson } from "./dataConvert"

describe("dataConvert", () => {
  it("jsonToCsv -> csvToJson roundtrip with simple objects", () => {
    const original = [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]
    const jsonStr = JSON.stringify(original)
    const csv = jsonToCsv(jsonStr)
    expect(csv).toContain("name,age")
    expect(csv).toContain("Alice,30")
    const backJson = csvToJson(csv)
    expect(JSON.parse(backJson)).toEqual(original)
  })

  it("csvToJson -> jsonToCsv roundtrip (with quoted comma)", () => {
    const csv = 'a,b\n"hello, world",123\n"foo ""bar""",456'
    const jsonStr = csvToJson(csv)
    const parsed = JSON.parse(jsonStr)
    expect(parsed).toEqual([{ a: "hello, world", b: 123 }, { a: 'foo "bar"', b: 456 }])
    const backCsv = jsonToCsv(jsonStr)
    // roundtrip again
    const backJson = csvToJson(backCsv)
    expect(JSON.parse(backJson)).toEqual(parsed)
  })

  it("jsonToYaml -> yamlToJson roundtrip with nested object", () => {
    const original = { a: 1, b: "hello", c: true, d: null, nested: { e: 2, f: [1, 2, 3] }, list: [{ x: 1 }, { x: 2 }] }
    const jsonStr = JSON.stringify(original)
    const yaml = jsonToYaml(jsonStr)
    expect(yaml).toContain("a: 1")
    expect(yaml).toContain("b: hello")
    const backJson = yamlToJson(yaml)
    expect(JSON.parse(backJson)).toEqual(original)
  })

  it("yamlToJson -> jsonToYaml roundtrip (yaml parse)", () => {
    const yaml = `name: Alice\nage: 30\nskills:\n  - js\n  - python\nmeta:\n  active: true\n  count: 42\n`
    const jsonStr = yamlToJson(yaml)
    const parsed = JSON.parse(jsonStr)
    expect(parsed).toEqual({ name: "Alice", age: 30, skills: ["js", "python"], meta: { active: true, count: 42 } })
    const backYaml = jsonToYaml(jsonStr)
    const backJson2 = yamlToJson(backYaml)
    expect(JSON.parse(backJson2)).toEqual(parsed)
  })

  it("jsonToXml -> xmlToJson roundtrip with nested and array", () => {
    const original = { a: 1, b: "hello", c: true, nested: { d: 2 }, arr: [1, 2, 3], users: [{ id: 1, name: "a" }, { id: 2, name: "b" }] }
    const jsonStr = JSON.stringify(original)
    const xml = jsonToXml(jsonStr)
    expect(xml).toContain("<a>1</a>")
    expect(xml).toContain("<arr>")
    expect(xml).toContain("<item>1</item>")
    const backJson = xmlToJson(xml)
    expect(JSON.parse(backJson)).toEqual(original)
  })

  it("xmlToJson -> jsonToXml roundtrip (xml parse)", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><root><name>Alice</name><age>30</age><active>true</active><scores><item>90</item><item>85</item></scores></root>`
    const jsonStr = xmlToJson(xml)
    const parsed = JSON.parse(jsonStr)
    expect(parsed).toEqual({ name: "Alice", age: 30, active: true, scores: [90, 85] })
    const backXml = jsonToXml(jsonStr)
    const backJson2 = xmlToJson(backXml)
    expect(JSON.parse(backJson2)).toEqual(parsed)
  })
})
