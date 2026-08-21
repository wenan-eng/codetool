import { describe, it, expect } from "vitest"
import { shaHash, isShaAlgorithm } from "./shaHash"

describe("shaHash", () => {
  it("nist sha256 abc vector via subtle", async () => {
    await expect(shaHash("abc", "SHA-256")).resolves.toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    )
  })
  it("nist sha224 abc vector via pure js", async () => {
    await expect(shaHash("abc", "SHA-224")).resolves.toBe(
      "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7"
    )
  })
  it("empty string vectors for all algorithms", async () => {
    await expect(shaHash("", "SHA-1")).resolves.toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709")
    await expect(shaHash("", "SHA-224")).resolves.toBe(
      "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f"
    )
    await expect(shaHash("", "SHA-256")).resolves.toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    )
  })
  it("multi-block message vectors", async () => {
    const msg = "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"
    await expect(shaHash(msg, "SHA-224")).resolves.toBe(
      "75388b16512776cc5dba5da1fd890150b0c6455cb4f58b1952522525"
    )
    await expect(shaHash(msg, "SHA-256")).resolves.toBe(
      "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1"
    )
    await expect(shaHash(msg, "SHA-1")).resolves.toBe(
      "84983e441c3bd26ebaae4aa1f95129e5e54670f1"
    )
  })
  it("sha384 and sha512 abc vectors", async () => {
    await expect(shaHash("abc", "SHA-384")).resolves.toBe(
      "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7"
    )
    await expect(shaHash("abc", "SHA-512")).resolves.toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
    )
  })
  it("utf8 chinese text matches known digests", async () => {
    await expect(shaHash("你好", "SHA-224")).resolves.toBe(
      "e91f006ed4e0882de2f6a3c96ec228a6a5c715f356d00091bce842b5"
    )
    await expect(shaHash("你好", "SHA-256")).resolves.toBe(
      "670d9743542cae3ea7ebe36af56bd53648b0a1126162e78d81a32934a711302e"
    )
  })
  it("uppercase option and default algorithm", async () => {
    const lower = await shaHash("Hello World")
    expect(lower).toBe(
      "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
    )
    const upper = await shaHash("Hello World", "SHA-256", true)
    expect(upper).toBe(
      "A591A6D40BF420404A011733CFB7B190D62C65BF0BCDA32B57B277D9AD9F146E"
    )
  })
  it("rejects unknown algorithm", async () => {
    await expect(shaHash("abc", "MD5" as never)).rejects.toThrow(/不支持的 SHA 算法/)
    expect(isShaAlgorithm("SHA-256")).toBe(true)
    expect(isShaAlgorithm("MD5")).toBe(false)
  })
})
