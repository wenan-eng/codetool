import { describe, it, expect } from "vitest"
import { base32Encode, base32Decode } from "./base32Codec"

describe("base32Codec", () => {
  it("rfc 4648 known vectors", () => {
    expect(base32Encode("f")).toBe("MY======")
    expect(base32Encode("fo")).toBe("MZXQ====")
    expect(base32Encode("foo")).toBe("MZXW6===")
    expect(base32Encode("foob")).toBe("MZXW6YQ=")
    expect(base32Encode("fooba")).toBe("MZXW6YTB")
    expect(base32Encode("foobar")).toBe("MZXW6YTBOI======")
  })
  it("known vector for Hello!", () => {
    expect(base32Encode("Hello!")).toBe("JBSWY3DPEE======")
  })
  it("chinese text vector", () => {
    expect(base32Encode("你好")).toBe("4S62BZNFXU======")
    expect(base32Decode("4S62BZNFXU======")).toBe("你好")
  })
  it("roundtrip with emoji and punctuation", () => {
    const s = "你好 hello 🌍 123!"
    expect(base32Decode(base32Encode(s))).toBe(s)
  })
  it("empty string returns empty string", () => {
    expect(base32Encode("")).toBe("")
    expect(base32Decode("")).toBe("")
    expect(base32Decode("   ")).toBe("")
  })
  it("decode tolerates lowercase missing padding and spaces", () => {
    expect(base32Decode("jbswy3dpee")).toBe("Hello!")
    expect(base32Decode("JBSWY3DP EE")).toBe("Hello!")
    expect(base32Decode("  mz xw6ytb  ")).toBe("fooba")
  })
  it("throws on invalid characters", () => {
    expect(() => base32Decode("JBSWY3DP1")).toThrow(/非法的 Base32 字符/)
    expect(() => base32Decode("ABC@EFGH")).toThrow(/非法的 Base32 字符/)
    expect(() => base32Decode("你好")).toThrow()
  })
})
