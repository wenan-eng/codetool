import { describe, it, expect } from "vitest"
import { createCipheriv, createDecipheriv } from "node:crypto"
import { aesEncrypt, aesDecrypt, generateRandomIv } from "./aesCipher"

const KEY16 = "1234567890abcdef"
const KEY32 = "1234567890abcdef1234567890abcdef"
const IV16_B64 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).toString("base64")
const IV12_B64 = Buffer.from([9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 22]).toString("base64")
const PLAIN = "你好 hello AES 123! 加密测试"

describe("aesEncrypt / aesDecrypt", () => {
  it("CBC round trip with fixed iv", async () => {
    const { cipher, iv } = await aesEncrypt(PLAIN, KEY16, "CBC", IV16_B64)
    expect(iv).toBe(IV16_B64)
    const plain = await aesDecrypt(cipher, KEY16, "CBC", IV16_B64)
    expect(plain).toBe(PLAIN)
  })
  it("CTR round trip with fixed iv", async () => {
    const { cipher } = await aesEncrypt(PLAIN, KEY32, "CTR", IV16_B64)
    const plain = await aesDecrypt(cipher, KEY32, "CTR", IV16_B64)
    expect(plain).toBe(PLAIN)
  })
  it("GCM round trip with fixed nonce", async () => {
    const { cipher } = await aesEncrypt(PLAIN, KEY16, "GCM", IV12_B64)
    const plain = await aesDecrypt(cipher, KEY16, "GCM", IV12_B64)
    expect(plain).toBe(PLAIN)
  })
  it("CBC matches node crypto aes-128-cbc and decrypts node output", async () => {
    const iv = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    const nodeCipher = createCipheriv("aes-128-cbc", KEY16, iv)
    const expected = Buffer.concat([nodeCipher.update(PLAIN, "utf8"), nodeCipher.final()])
    const { cipher } = await aesEncrypt(PLAIN, KEY16, "CBC", IV16_B64)
    expect(cipher).toBe(expected.toString("base64"))
    expect(await aesDecrypt(expected.toString("base64"), KEY16, "CBC", IV16_B64)).toBe(PLAIN)
  })
  it("auto generated iv has correct byte length per mode", async () => {
    for (const [mode, len] of [["CBC", 16], ["CTR", 16], ["GCM", 12]] as const) {
      const iv = await generateRandomIv(mode)
      expect(Buffer.from(iv, "base64").length).toBe(len)
      const { cipher, iv: usedIv } = await aesEncrypt("data", KEY16, mode)
      expect(usedIv).not.toBe("")
      expect(await aesDecrypt(cipher, KEY16, mode, usedIv)).toBe("data")
      expect(iv.length).toBeGreaterThan(0)
    }
  })
  it("wrong key fails with clear error", async () => {
    const { cipher } = await aesEncrypt(PLAIN, KEY16, "CBC", IV16_B64)
    await expect(aesDecrypt(cipher, "fedcba0987654321", "CBC", IV16_B64)).rejects.toThrow(
      "解密失败"
    )
  })
  it("corrupted ciphertext fails with clear error", async () => {
    const { cipher } = await aesEncrypt(PLAIN, KEY16, "CBC", IV16_B64)
    const bytes = Buffer.from(cipher, "base64")
    bytes[bytes.length - 1] ^= 0xff
    await expect(
      aesDecrypt(bytes.toString("base64"), KEY16, "CBC", IV16_B64)
    ).rejects.toThrow("解密失败")
    const bytes2 = Buffer.from(cipher, "base64")
    bytes2[0] ^= 0xff
    await expect(
      aesDecrypt(bytes2.toString("base64"), KEY16, "CBC", IV16_B64)
    ).rejects.toThrow("解密失败")
  })
  it("invalid inputs produce clear errors", async () => {
    await expect(aesEncrypt("x", "short", "CBC")).rejects.toThrow("密钥长度必须为16、24或32个字符")
    await expect(aesDecrypt("!!!!", KEY16, "CBC", IV16_B64)).rejects.toThrow("Base64")
    await expect(aesDecrypt("AAAA", KEY16, "CBC", "")).rejects.toThrow("需要提供加密时使用的IV")
    await expect(aesDecrypt("AAAA", KEY16, "GCM", IV16_B64)).rejects.toThrow("IV长度不正确")
  })
})
