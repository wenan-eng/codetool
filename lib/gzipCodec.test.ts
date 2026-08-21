import { describe, it, expect } from "vitest"
import { gzipSync, gunzipSync } from "node:zlib"
import { gzipEncode, gzipDecode } from "./gzipCodec"

function toBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("base64")
}

describe("gzipCodec", () => {
  it("roundtrips chinese english and emoji", async () => {
    const text = "你好 hello 🌍 123!"
    const encoded = await gzipEncode(text)
    expect(await gzipDecode(encoded)).toBe(text)
  })
  it("produces real gzip bytes decodable by node zlib", async () => {
    const encoded = await gzipEncode("hello world")
    const raw = gunzipSync(Buffer.from(encoded, "base64")).toString("utf-8")
    expect(raw).toBe("hello world")
  })
  it("decodes real gzip bytes produced by node zlib", async () => {
    const compressed = gzipSync(Buffer.from("来自 node 的数据", "utf-8"))
    expect(await gzipDecode(toBase64(compressed))).toBe("来自 node 的数据")
  })
  it("handles empty string roundtrip", async () => {
    const encoded = await gzipEncode("")
    expect(await gzipDecode(encoded)).toBe("")
  })
  it("handles large repetitive text with compression", async () => {
    const text = "重复内容压缩测试。".repeat(5000)
    const encoded = await gzipEncode(text)
    expect(Buffer.from(encoded, "base64").length).toBeLessThan(text.length * 3)
    expect(await gzipDecode(encoded)).toBe(text)
  })
  it("throws clear error on invalid base64", async () => {
    await expect(gzipDecode("!!!not-base64!!!")).rejects.toThrow(/Base64/)
  })
  it("throws clear error on non-gzip data", async () => {
    const plain = Buffer.from("plain text not gzip").toString("base64")
    await expect(gzipDecode(plain)).rejects.toThrow(/Gzip/)
  })
  it("throws on corrupted gzip payload after magic bytes", async () => {
    const valid = new Uint8Array(gzipSync(Buffer.from("abc")))
    const corrupted = Uint8Array.from(valid)
    corrupted[valid.length - 5] = corrupted[valid.length - 5] ^ 0xff
    await expect(gzipDecode(toBase64(corrupted))).rejects.toThrow(/损坏|无法解码/)
  })
})
