import { describe, it, expect } from "vitest"
import { createCipheriv, createDecipheriv } from "node:crypto"
import {
  desEncryptRaw,
  desDecryptRaw,
  desEncryptText,
  desDecryptText,
  randomDesIvHex,
} from "./desCipher"

function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, "hex"))
}

describe("desCipher raw blocks", () => {
  it("classic ECB vector 133457799BBCDFF1 / 0123456789ABCDEF", () => {
    const key = hexToBytes("133457799bbcdff1")
    const plain = hexToBytes("0123456789abcdef")
    const cipher = desEncryptRaw(plain, key, "ECB")
    expect(Buffer.from(cipher.slice(0, 8)).toString("hex").toUpperCase()).toBe("85E813540F0AB405")
    const back = desDecryptRaw(cipher, key, "ECB")
    expect(Buffer.from(back).toString("hex")).toBe("0123456789abcdef")
  })
})

describe("desCipher text api", () => {
  const KEY = "Passw0rd"
  const IV_HEX = "0123456789abcdef"
  const KEY3 = Buffer.concat([Buffer.from(KEY), Buffer.from(KEY), Buffer.from(KEY)])

  it("CBC matches openssl single DES via des-ede3-cbc and decrypts its output", () => {
    const iv = Buffer.from(IV_HEX, "hex")
    const nodeCipher = createCipheriv("des-ede3-cbc", KEY3, iv)
    const expected = Buffer.concat([nodeCipher.update("你好 hello DES", "utf8"), nodeCipher.final()])
    const ours = desEncryptText("你好 hello DES", KEY, "CBC", IV_HEX)
    expect(ours).toBe(expected.toString("base64"))
    expect(desDecryptText(expected.toString("base64"), KEY, "CBC", IV_HEX)).toBe(
      "你好 hello DES"
    )
  })
  it("ECB matches openssl single DES via des-ede3 and decrypts its output", () => {
    const nodeCipher = createCipheriv("des-ede3", KEY3, null)
    const expected = Buffer.concat([nodeCipher.update("secret data", "utf8"), nodeCipher.final()])
    const ours = desEncryptText("secret data", KEY, "ECB")
    expect(ours).toBe(expected.toString("base64"))
    expect(desDecryptText(expected.toString("base64"), KEY, "ECB")).toBe("secret data")
  })
  it("CBC round trip with chinese and emoji", () => {
    const text = "中文加密测试 🌍 DES 算法验证 123"
    const cipher = desEncryptText(text, KEY, "CBC", IV_HEX)
    expect(desDecryptText(cipher, KEY, "CBC", IV_HEX)).toBe(text)
  })
  it("all padding boundary lengths round trip in ECB", () => {
    for (let len = 1; len <= 16; len++) {
      const text = "a".repeat(len)
      const cipher = desEncryptText(text, KEY, "ECB")
      expect(Buffer.from(cipher, "base64").length % 8).toBe(0)
      expect(desDecryptText(cipher, KEY, "ECB")).toBe(text)
    }
  })
  it("random iv works and ecb ignores iv argument", () => {
    const iv1 = randomDesIvHex()
    expect(iv1).toMatch(/^[0-9a-f]{16}$/)
    const text = "iv test 数据"
    const c1 = desEncryptText(text, KEY, "CBC", iv1)
    expect(desDecryptText(c1, KEY, "CBC", iv1)).toBe(text)
    expect(desEncryptText(text, KEY, "ECB", iv1)).toBe(desEncryptText(text, KEY, "ECB"))
  })
  it("invalid inputs produce clear errors", () => {
    expect(() => desEncryptText("x", "short", "ECB")).toThrow("密钥必须为8个字符")
    expect(() => desEncryptText("x", KEY, "CBC", "")).toThrow("需要IV")
    expect(() => desEncryptText("x", KEY, "CBC", "xyz")).toThrow("IV格式错误")
    expect(() => desDecryptText("!!!!", KEY, "ECB")).toThrow("Base64")
    expect(() => desDecryptText("AAAA", KEY, "ECB")).toThrow("密文长度无效")
    const good = desEncryptText("hello", KEY, "CBC", IV_HEX)
    const bytes = Buffer.from(good, "base64")
    bytes[3] ^= 0xff
    expect(() => desDecryptText(bytes.toString("base64"), KEY, "CBC", IV_HEX)).toThrow(
      "密钥不正确或密文已损坏"
    )
    expect(() => desDecryptText(good, "WrongKey", "CBC", IV_HEX)).toThrow("填充无效")
  })
})
