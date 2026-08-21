import { describe, it, expect } from "vitest"
import { mysqlPassword } from "./mysqlPassword"

describe("mysqlPassword", () => {
  it("known vector MySQL@123456", async () => {
    expect(await mysqlPassword("MySQL@123456")).toBe(
      "*D3E347BE2B21A58409BBFA8D9401120AFFF3DF3E"
    )
  })
  it("known vector test", async () => {
    expect(await mysqlPassword("test")).toBe("*94BDCEBE19083CE2A1F959FD02F964C7AF4CFC29")
  })
  it("output format is star plus 40 uppercase hex chars", async () => {
    const result = await mysqlPassword("任意密码 Passw0rd!")
    expect(result).toMatch(/^\*[0-9A-F]{40}$/)
  })
  it("different passwords produce different hashes", async () => {
    expect(await mysqlPassword("abc123")).not.toBe(await mysqlPassword("abc124"))
  })
  it("same password produces stable hash", async () => {
    expect(await mysqlPassword("Stable@Pass")).toBe(await mysqlPassword("Stable@Pass"))
  })
  it("utf8 multibyte password matches node crypto double sha1", async () => {
    const { createHash } = await import("node:crypto")
    const pwd = "中文密码123"
    const d1 = createHash("sha1").update(pwd, "utf8").digest()
    const d2 = createHash("sha1").update(d1).digest("hex").toUpperCase()
    expect(await mysqlPassword(pwd)).toBe("*" + d2)
  })
})
