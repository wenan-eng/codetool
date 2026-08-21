import { describe, it, expect } from "vitest"
import { textToRadix, radixToText } from "./textRadix"

describe("textRadix", () => {
  it("utf8 hex for mixed chinese english", () => {
    expect(textToRadix("你好 hello", 16)).toBe("E4 BD A0 E5 A5 BD 20 68 65 6C 6C 6F")
  })
  it("known single char vectors for all radices", () => {
    expect(textToRadix("A", 16)).toBe("41")
    expect(textToRadix("A", 8)).toBe("101")
    expect(textToRadix("A", 2)).toBe("01000001")
    expect(textToRadix("Hi", 8)).toBe("110 151")
    expect(textToRadix("Hi", 2)).toBe("01001000 01101001")
  })
  it("roundtrip all radices with emoji and punctuation", () => {
    const s = "你好 hello 🌍 123!"
    for (const r of [16, 8, 2] as const) {
      expect(radixToText(textToRadix(s, r), r)).toBe(s)
    }
  })
  it("empty string returns empty string", () => {
    expect(textToRadix("", 16)).toBe("")
    expect(radixToText("", 16)).toBe("")
    expect(radixToText("   ", 2)).toBe("")
  })
  it("tolerates comma separators and extra whitespace and lowercase hex", () => {
    expect(radixToText("E4,BD,A0", 16)).toBe("你")
    expect(radixToText("  e4  bd,a0  ", 16)).toBe("你")
    expect(radixToText("101", 8)).toBe("A")
  })
  it("throws on invalid bytes per radix", () => {
    expect(() => radixToText("GG", 16)).toThrow()
    expect(() => radixToText("8", 8)).toThrow()
    expect(() => radixToText("9 10", 8)).toThrow()
    expect(() => radixToText("2", 2)).toThrow()
    expect(() => radixToText("100000001", 2)).toThrow()
  })
  it("invalid utf8 sequence decodes to replacement char instead of throwing", () => {
    expect(radixToText("FF", 16)).toBe("\uFFFD")
  })
  it("multi byte chinese octal binary vectors", () => {
    expect(textToRadix("你", 16)).toBe("E4 BD A0")
    expect(textToRadix("你", 8)).toBe("344 275 240")
    expect(textToRadix("你", 2)).toBe("11100100 10111101 10100000")
  })
})
