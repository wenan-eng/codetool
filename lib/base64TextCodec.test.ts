import { describe, it, expect } from "vitest"
import { base64EncodeText, base64DecodeText } from "./base64TextCodec"

describe("base64TextCodec", () => {
  it("known vectors", () => {
    expect(base64EncodeText("Hello!")).toBe("SGVsbG8h")
    expect(base64EncodeText("Hello World 123")).toBe("SGVsbG8gV29ybGQgMTIz")
    expect(base64DecodeText("SGVsbG8h")).toBe("Hello!")
  })
  it("chinese text utf8 safe", () => {
    expect(base64EncodeText("你好")).toBe("5L2g5aW9")
    expect(base64DecodeText("5L2g5aW9")).toBe("你好")
  })
  it("roundtrip with emoji and punctuation", () => {
    const s = "你好 hello 🌍 123!"
    expect(base64DecodeText(base64EncodeText(s))).toBe(s)
  })
  it("empty string returns empty string", () => {
    expect(base64EncodeText("")).toBe("")
    expect(base64DecodeText("")).toBe("")
    expect(base64DecodeText("   ")).toBe("")
  })
  it("decode tolerates url-safe variant and missing padding", () => {
    expect(base64DecodeText("Pz8/")).toBe("???")
    expect(base64DecodeText("Pz8_")).toBe("???")
    expect(base64DecodeText("Pz8-")).toBe("??>")
    expect(base64DecodeText("TQ")).toBe("M")
    expect(base64DecodeText(" SGVs bG8h ")).toBe("Hello!")
  })
  it("throws on invalid input", () => {
    expect(() => base64DecodeText("SGVs$bG8")).toThrow(/非法的 Base64/)
    expect(() => base64DecodeText("ABCDE")).toThrow(/非法的 Base64/)
    expect(() => base64DecodeText("你")).toThrow()
  })
})
