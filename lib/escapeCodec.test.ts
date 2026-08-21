import { describe, it, expect } from "vitest"
import { escapeEncode, escapeDecode, transformEscape } from "./escapeCodec"

describe("escapeCodec", () => {
  it("encodes Chinese as %uXXXX uppercase", () => {
    expect(escapeEncode("你好世界")).toBe("%u4F60%u597D%u4E16%u754C")
  })
  it("preserves ASCII and reserved characters", () => {
    expect(escapeEncode("abcXYZ0189@*_+-./")).toBe("abcXYZ0189@*_+-./")
    expect(escapeEncode("a b")).toBe("a%20b")
  })
  it("round-trips mixed content", () => {
    const s = "你好 world <a>&\"'100% 😀"
    expect(escapeDecode(escapeEncode(s))).toBe(s)
  })
  it("handles empty string", () => {
    expect(escapeEncode("")).toBe("")
    expect(escapeDecode("")).toBe("")
  })
  it("encodes Latin-1 as %XX", () => {
    expect(escapeEncode("é")).toBe("%E9")
    expect(escapeEncode("©")).toBe("%A9")
  })
  it("splits emoji into two %uXXXX units", () => {
    expect(escapeEncode("😀")).toBe("%uD83D%uDE00")
  })
  it("keeps invalid sequences untouched", () => {
    expect(escapeDecode("%zz")).toBe("%zz")
    expect(escapeDecode("%u12")).toBe("%u12")
  })
  it("transformEscape switches mode", () => {
    expect(transformEscape("你", "encode")).toBe("%u4F60")
    expect(transformEscape("%u4F60", "decode")).toBe("你")
  })
})
