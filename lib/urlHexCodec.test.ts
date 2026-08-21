import { describe, it, expect } from "vitest"
import { urlHexEncode, urlHexDecode } from "./urlHexCodec"

describe("urlHexEncode", () => {
  it("keeps unreserved characters unchanged", () => {
    expect(urlHexEncode("abcXYZ0189")).toBe("abcXYZ0189")
    expect(urlHexEncode("-_.~")).toBe("-_.~")
  })
  it("encodes reserved and special characters as percent hex", () => {
    expect(urlHexEncode(" ")).toBe("%20")
    expect(urlHexEncode("https://example.com/a b?q=1&r=2")).toBe(
      "https%3A%2F%2Fexample.com%2Fa%20b%3Fq%3D1%26r%3D2"
    )
  })
  it("encodes chinese as uppercase utf8 hex bytes", () => {
    expect(urlHexEncode("你好")).toBe("%E4%BD%A0%E5%A5%BD")
    expect(urlHexEncode("中A文1")).toBe("%E4%B8%ADA%E6%96%871")
  })
  it("encodes emoji as multi byte utf8", () => {
    expect(urlHexEncode("🌍")).toBe("%F0%9F%8C%8D")
  })
})

describe("urlHexDecode", () => {
  it("decodes lowercase and uppercase hex equally", () => {
    expect(urlHexDecode("%e4%bd%a0%e5%a5%bd")).toBe("你好")
    expect(urlHexDecode("%E4%BD%A0%E5%A5%BD")).toBe("你好")
  })
  it("tolerates mixed encoded and plain text", () => {
    expect(urlHexDecode("https://example.com/search?q=%E4%BD%A0%E5%A5%BD&page=2")).toBe(
      "https://example.com/search?q=你好&page=2"
    )
  })
  it("keeps stray percent signs literal when not valid hex pair", () => {
    expect(urlHexDecode("100% done")).toBe("100% done")
    expect(urlHexDecode("%zz %2")).toBe("%zz %2")
    expect(urlHexDecode("trailing %")).toBe("trailing %")
  })
  it("round trips chinese emoji and urls", () => {
    const samples = [
      "你好，世界！Hello 🌍",
      "https://example.com/路径?查询=值&x=1#锚点",
      "a+b c~d-e_f.g",
      "",
    ]
    for (const s of samples) {
      expect(urlHexDecode(urlHexEncode(s))).toBe(s)
    }
  })
})
