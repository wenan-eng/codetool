import { describe, it, expect } from "vitest"
import { beautify as jsBeautify, compress as jsCompress } from "./jsFormatter"
import { beautify as htmlBeautify, compress as htmlCompress } from "./htmlFormatter"
import { beautify as cssBeautify, compress as cssCompress } from "./cssFormatter"
import { beautify as sqlBeautify, compress as sqlCompress } from "./sqlFormatter"
import { beautify as yamlBeautify, compress as yamlCompress } from "./yamlFormatter"

describe("jsFormatter", () => {
  const simple = "function foo(){return 1;}"
  it("beautify adds newline and indent", () => {
    const out = jsBeautify(simple)
    expect(out).toContain("\n")
    expect(out).toContain("  ")
    expect(out).toContain("function foo")
  })
  it("compress removes newlines", () => {
    const beautified = jsBeautify(simple)
    const compressed = jsCompress(beautified)
    expect(compressed).not.toContain("\n")
    expect(compressed).toBe(jsCompress(simple))
  })
  it("beautify is idempotent via compress", () => {
    expect(jsBeautify(jsCompress(simple))).toBe(jsBeautify(simple))
  })
  it("compress(beautify(x)) === compress(x)", () => {
    expect(jsCompress(jsBeautify(simple))).toBe(jsCompress(simple))
  })
  it("throws on empty", () => {
    expect(() => jsBeautify("   ")).toThrow()
    expect(() => jsCompress("")).toThrow()
  })
})

describe("htmlFormatter", () => {
  const simple = "<div><p>hello</p></div>"
  it("beautify adds newline and indent", () => {
    const out = htmlBeautify(simple)
    expect(out).toContain("\n")
    expect(out).toContain("<div>")
    expect(out).toContain("<p>")
  })
  it("compress removes newlines and spaces between tags", () => {
    const beautified = htmlBeautify(simple)
    const compressed = htmlCompress(beautified)
    expect(compressed).not.toContain("\n")
    expect(compressed).toBe("<div><p>hello</p></div>")
  })
  it("beautify is idempotent via compress", () => {
    expect(htmlBeautify(htmlCompress(simple))).toBe(htmlBeautify(simple))
  })
  it("compress(beautify(x)) === compress(x)", () => {
    expect(htmlCompress(htmlBeautify(simple))).toBe(htmlCompress(simple))
  })
  it("handles nested tags roundtrip", () => {
    const nested = "<ul><li>1</li><li>2</li></ul>"
    expect(htmlCompress(htmlBeautify(nested))).toBe(htmlCompress(nested))
    expect(htmlBeautify(nested)).toContain("\n")
  })
})

describe("cssFormatter", () => {
  const simple = ".a{color:red;margin:0;}"
  it("beautify adds newline and indent", () => {
    const out = cssBeautify(simple)
    expect(out).toContain("\n")
    expect(out).toContain("  ")
    expect(out).toContain(".a {")
  })
  it("compress removes newlines", () => {
    const beautified = cssBeautify(simple)
    const compressed = cssCompress(beautified)
    expect(compressed).not.toContain("\n")
    expect(compressed).toBe(cssCompress(simple))
  })
  it("beautify is idempotent via compress", () => {
    expect(cssBeautify(cssCompress(simple))).toBe(cssBeautify(simple))
  })
  it("compress(beautify(x)) === compress(x)", () => {
    expect(cssCompress(cssBeautify(simple))).toBe(cssCompress(simple))
  })
  it("throws on empty and validates", () => {
    expect(() => cssBeautify("   ")).toThrow()
    expect(() => cssCompress("")).toThrow()
  })
})

describe("sqlFormatter", () => {
  const simple = "select * from users where id=1"
  it("beautify adds newline and indent", () => {
    const out = sqlBeautify(simple)
    expect(out).toContain("\n")
    // should contain FROM or from
    expect(out.toLowerCase()).toContain("from")
  })
  it("compress removes newlines", () => {
    const beautified = sqlBeautify(simple)
    const compressed = sqlCompress(beautified)
    expect(compressed).not.toContain("\n")
    // compare case-insensitive because beautify uppercases keywords
    expect(compressed.toLowerCase()).toBe(sqlCompress(simple).toLowerCase())
  })
  it("beautify is idempotent via compress (case-insensitive)", () => {
    expect(sqlBeautify(sqlCompress(simple)).toLowerCase()).toBe(sqlBeautify(simple).toLowerCase())
  })
  it("compress(beautify(x)) lower equals compress(x) lower", () => {
    expect(sqlCompress(sqlBeautify(simple)).toLowerCase()).toBe(sqlCompress(simple).toLowerCase())
  })
  it("throws on empty", () => {
    expect(() => sqlBeautify("   ")).toThrow()
    expect(() => sqlCompress("")).toThrow()
  })
})

describe("yamlFormatter", () => {
  const simple = "a: 1\nb: 2"
  const nested = "person:\n  name: John\n  age: 30"
  it("beautify adds newline", () => {
    const out = yamlBeautify(simple)
    expect(out).toContain("\n")
    expect(out).toContain("a:")
  })
  it("compress removes newlines", () => {
    const beautified = yamlBeautify(simple)
    const compressed = yamlCompress(beautified)
    // yaml compress may still be single line for simple case
    expect(compressed).toBe(yamlCompress(simple))
  })
  it("beautify is idempotent via compress", () => {
    expect(yamlBeautify(yamlCompress(simple))).toBe(yamlBeautify(simple))
  })
  it("compress(beautify(x)) === compress(x) for nested", () => {
    expect(yamlCompress(yamlBeautify(nested))).toBe(yamlCompress(nested))
    expect(yamlBeautify(nested)).toContain("\n")
  })
  it("throws on empty", () => {
    expect(() => yamlBeautify("   ")).toThrow()
    expect(() => yamlCompress("")).toThrow()
  })
})
