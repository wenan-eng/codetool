import { describe, it, expect } from "vitest"
import { encodeUrl, decodeUrl, transformUrl } from "./urlCodec"

describe("urlCodec", () => {
  it("encodes Chinese via UTF-8 percent-encoding", () => {
    expect(encodeUrl("你好世界")).toBe("%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C")
  })
  it("round-trips mixed content", () => {
    const s = "你好 world?q=关键词&lang=zh#top 😀 100%"
    expect(decodeUrl(encodeUrl(s))).toBe(s)
  })
  it("handles empty string", () => {
    expect(encodeUrl("")).toBe("")
    expect(decodeUrl("")).toBe("")
  })
  it("encodes special characters &<>\"'", () => {
    expect(encodeUrl("&<>\"'")).toBe("%26%3C%3E%22'")
  })
  it("encodes emoji", () => {
    expect(encodeUrl("😀")).toBe("%F0%9F%98%80")
  })
  it("returns original on invalid input", () => {
    expect(decodeUrl("%zz")).toBe("%zz")
    expect(decodeUrl("100%")).toBe("100%")
  })
  it("transformUrl switches mode", () => {
    expect(transformUrl("a b", "encode")).toBe("a%20b")
    expect(transformUrl("a%20b", "decode")).toBe("a b")
  })
})
