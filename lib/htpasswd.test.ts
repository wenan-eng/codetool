import { describe, it, expect } from "vitest"
import { htpasswdGenerate } from "./htpasswd"

function base64ToBytes(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, "base64"))
}

describe("htpasswdGenerate", () => {
  it("SHA algorithm known vector", async () => {
    expect(await htpasswdGenerate("admin", "secret", "SHA")).toBe(
      "admin:{SHA}5en6G6MezRroT3XKqkdPOmY/BfQ="
    )
    expect(await htpasswdGenerate("user", "test", "SHA")).toBe(
      "user:{SHA}qUqP5cyxm6YcTAhz05Hph5gvu9M="
    )
  })
  it("SSHA output format with 24 byte digest", async () => {
    const line = await htpasswdGenerate("admin", "secret", "SSHA")
    expect(line.startsWith("admin:{SSHA}")).toBe(true)
    const b64 = line.slice("admin:{SSHA}".length)
    expect(base64ToBytes(b64).length).toBe(24)
  })
  it("SSHA digest verifies against recomputed sha1 of password plus salt", async () => {
    const { createHash } = await import("node:crypto")
    const line = await htpasswdGenerate("zhang", "密码123", "SSHA")
    const b64 = line.slice("zhang:{SSHA}".length)
    const bytes = base64ToBytes(b64)
    const hash = bytes.slice(0, 20)
    const salt = bytes.slice(20)
    const expected = createHash("sha1").update("密码123", "utf8").update(salt).digest()
    expect(Buffer.from(hash).equals(Buffer.from(expected))).toBe(true)
  })
  it("SSHA uses random salt so two calls differ", async () => {
    const a = await htpasswdGenerate("admin", "secret", "SSHA")
    const b = await htpasswdGenerate("admin", "secret", "SSHA")
    expect(a).not.toBe(b)
  })
  it("rejects empty username and colon in username", async () => {
    await expect(htpasswdGenerate("", "secret", "SHA")).rejects.toThrow("用户名不能为空")
    await expect(htpasswdGenerate("bad:name", "secret", "SHA")).rejects.toThrow("冒号")
  })
  it("utf8 password works for SHA algorithm", async () => {
    const { createHash } = await import("node:crypto")
    const expected = createHash("sha1").update("中文密码", "utf8").digest("base64")
    const line = await htpasswdGenerate("cn", "中文密码", "SHA")
    expect(line).toBe(`cn:{SHA}${expected}`)
  })
})
