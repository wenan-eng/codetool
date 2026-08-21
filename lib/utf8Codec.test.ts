import { describe, it, expect } from "vitest"
import { utf8Encode, utf8Decode, transformUtf8 } from "./utf8Codec"

describe("utf8Codec", () => {
  it("encodes Chinese as \\uXXXX escapes", () => {
    expect(utf8Encode("你好世界")).toBe("\\u4f60\\u597d\\u4e16\\u754c")
  })
  it("keeps ASCII characters as-is", () => {
    expect(utf8Encode("abc XYZ 0189 !?&<>\"'")).toBe("abc XYZ 0189 !?&<>\"'")
  })
  it("round-trips mixed content", () => {
    const s = "你好 World <b>&\"'</b> 😀 100%"
    expect(utf8Decode(utf8Encode(s))).toBe(s)
  })
  it("handles empty string", () => {
    expect(utf8Encode("")).toBe("")
    expect(utf8Decode("")).toBe("")
  })
  it("splits emoji surrogate pairs into two escapes", () => {
    expect(utf8Encode("😀")).toBe("\\ud83d\\ude00")
    expect(utf8Decode("\\ud83d\\ude00")).toBe("😀")
  })
  it("decodes \\uXXXX and \\xXX while tolerating plain text", () => {
    expect(utf8Decode("a\\u4f60b\\x41c")).toBe("a你bAc")
    expect(utf8Decode("no escapes here")).toBe("no escapes here")
  })
  it("keeps invalid sequences untouched", () => {
    expect(utf8Decode("\\u12zz")).toBe("\\u12zz")
    expect(utf8Decode("\\q4f60")).toBe("\\q4f60")
  })
  it("transformUtf8 switches mode", () => {
    expect(transformUtf8("你", "encode")).toBe("\\u4f60")
    expect(transformUtf8("\\u4f60", "decode")).toBe("你")
  })
})
