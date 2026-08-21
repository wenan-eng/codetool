import { describe, it, expect } from "vitest"
import { md4Hex } from "./md4"

describe("md4Hex", () => {
  it("rfc1320 empty vector", () => {
    expect(md4Hex("")).toBe("31d6cfe0d16ae931b73c59d7e0c089c0")
  })
  it("rfc1320 basic vectors", () => {
    expect(md4Hex("a")).toBe("bde52cb31de33e46245e05fbdbd6fb24")
    expect(md4Hex("abc")).toBe("a448017aaf21d8525fc10ae87aa6729d")
    expect(md4Hex("message digest")).toBe("d9130a8164549fe818874806e1c7014b")
  })
  it("rfc1320 alphabet vector", () => {
    expect(md4Hex("abcdefghijklmnopqrstuvwxyz")).toBe("d79e1c308aa5bbcdeea8ed63df412da9")
  })
  it("rfc1320 alphanumeric vector", () => {
    expect(
      md4Hex("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")
    ).toBe("043f8582f241db351ce627e153e7f0e4")
  })
  it("rfc1320 eight-times digits vector crosses block boundary", () => {
    expect(
      md4Hex("12345678901234567890123456789012345678901234567890123456789012345678901234567890")
    ).toBe("e33b4ddc9c38f2199c3e7b164fcc0536")
  })
  it("utf8 chinese text produces stable 32 lowercase hex", () => {
    const hex = md4Hex("你好 MD4 测试")
    expect(hex).toMatch(/^[0-9a-f]{32}$/)
    expect(md4Hex("你好 MD4 测试")).toBe(hex)
  })
  it("md4 differs from md5 for the same input", async () => {
    const { md5Hex } = await import("./md5")
    expect(md4Hex("abc")).not.toBe(md5Hex("abc"))
  })
})
