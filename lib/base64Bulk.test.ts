import { describe, it, expect } from "vitest"
import { base64BulkEncode, base64BulkDecode, formatBulkResults } from "./base64Bulk"

describe("base64Bulk", () => {
  it("encodes each line independently", () => {
    const results = base64BulkEncode("你好\nhello\n123456")
    expect(results).toHaveLength(3)
    expect(results[0]).toMatchObject({ index: 0, source: "你好", ok: true, value: "5L2g5aW9" })
    expect(results[1]).toMatchObject({ index: 1, source: "hello", ok: true, value: "aGVsbG8=" })
    expect(results[2].ok).toBe(true)
    expect(results[2].value).toBe(Buffer.from("123456", "utf8").toString("base64"))
  })
  it("format outputs source arrow result per line", () => {
    const formatted = formatBulkResults(base64BulkEncode("hi\nyo"))
    expect(formatted).toBe("hi → aGk=\nyo → eW8=")
  })
  it("failing line does not affect neighbors in decode mode", () => {
    const results = base64BulkDecode("5L2g5aW9\n###\naGVsbG8=")
    expect(results[0].ok).toBe(true)
    expect(results[0].value).toBe("你好")
    expect(results[1].ok).toBe(false)
    expect(results[1].value).toContain("非法的 Base64")
    expect(results[2].ok).toBe(true)
    expect(results[2].value).toBe("hello")
  })
  it("bulk roundtrip preserves every line", () => {
    const lines = ["你好 world", "hello 🌍", "line 3!", ""]
    const encoded = base64BulkEncode(lines.join("\n"))
    const decoded = base64BulkDecode(encoded.map((r) => r.value).join("\n"))
    expect(decoded.map((r) => r.value)).toEqual(lines)
  })
  it("tolerates crlf line endings", () => {
    const results = base64BulkEncode("你好\r\nhello\r\n")
    expect(results[0].source).toBe("你好")
    expect(results[0].value).toBe("5L2g5aW9")
    expect(results[1].source).toBe("hello")
    expect(results[2].source).toBe("")
  })
  it("empty string yields single empty ok line", () => {
    const results = base64BulkEncode("")
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ index: 0, source: "", ok: true, value: "" })
    const decoded = base64BulkDecode("")
    expect(decoded).toHaveLength(1)
    expect(decoded[0].ok).toBe(true)
  })
})
