import { describe, it, expect } from "vitest"
import { md5Hex, md5Hex16 } from "./md5"

describe("md5Hex", () => {
  it("rfc1321 empty vector", () => {
    expect(md5Hex("")).toBe("d41d8cd98f00b204e9800998ecf8427e")
  })
  it("rfc1321 basic vectors", () => {
    expect(md5Hex("a")).toBe("0cc175b9c0f1b6a831c399e269772661")
    expect(md5Hex("abc")).toBe("900150983cd24fb0d6963f7d28e17f72")
    expect(md5Hex("message digest")).toBe("f96b697d7cb7938d525a2f31aaf161d0")
  })
  it("rfc1321 longer vectors", () => {
    expect(md5Hex("abcdefghijklmnopqrstuvwxyz")).toBe("c3fcd3d76192e4007dfb496cca67e13b")
    expect(
      md5Hex("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")
    ).toBe("d174ab98d277d9f5a5611c2c9f419d9f")
    expect(
      md5Hex("12345678901234567890123456789012345678901234567890123456789012345678901234567890")
    ).toBe("57edf4a22be3c955ac49da2e2107b67a")
  })
  it("multi-block message crosses padding boundary", () => {
    expect(md5Hex("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")).toBe(
      "8215ef0796a20bcaaae116d3876c664a"
    )
  })
  it("utf8 chinese text", () => {
    expect(md5Hex("你好")).toBe("7eca689f0d3389d9dea66ae112e5cfd7")
    expect(md5Hex("你好 hello 🌍 123!")).toBe("7fdc85ff95e7513c1d3e47475e4de799")
  })
  it("output is 32 lowercase hex chars", () => {
    const hex = md5Hex("任意内容 AnyContent 42")
    expect(hex).toMatch(/^[0-9a-f]{32}$/)
  })
  it("sync and reusable across calls", () => {
    expect(md5Hex("Hello World")).toBe("b10a8db164e0754105b7a99be72e3fe5")
    expect(md5Hex("Hello World")).toBe(md5Hex("Hello World"))
    expect(md5Hex("Hello World!")).not.toBe(md5Hex("Hello World"))
  })
  it("md5Hex16 trims first and last 8 chars of 32-bit digest", () => {
    expect(md5Hex16("")).toBe(md5Hex("").slice(8, 24))
    expect(md5Hex16("abc")).toBe("3cd24fb0d6963f7d")
    expect(md5Hex16("abc")).toMatch(/^[0-9a-f]{16}$/)
  })
})
