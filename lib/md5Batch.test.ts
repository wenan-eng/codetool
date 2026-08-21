import { describe, it, expect } from "vitest"
import { md5BatchHashLines, md5HashLine, md5BatchFormatLines, splitLines } from "./md5Batch"

describe("md5BatchHashLines", () => {
  it("hashes each line independently with default options", () => {
    const result = md5BatchHashLines("abc\nmessage digest")
    expect(result).toEqual([
      "900150983cd24fb0d6963f7d28e17f72",
      "f96b697d7cb7938d525a2f31aaf161d0",
    ])
  })
  it("empty line hashes the empty string independently", () => {
    const result = md5BatchHashLines("\n\n")
    expect(result).toEqual([
      "d41d8cd98f00b204e9800998ecf8427e",
      "d41d8cd98f00b204e9800998ecf8427e",
      "d41d8cd98f00b204e9800998ecf8427e",
    ])
  })
  it("uppercase option uppercases output", () => {
    expect(md5HashLine("abc", { uppercase: true })).toBe("900150983CD24FB0D6963F7D28E17F72")
  })
  it("16-bit option trims first and last 8 hex chars", () => {
    expect(md5HashLine("abc", { length: 16 })).toBe("3cd24fb0d6963f7d")
    expect(md5HashLine("abc", { length: 16, uppercase: true })).toBe("3CD24FB0D6963F7D")
  })
  it("handles crlf line endings", () => {
    expect(md5BatchHashLines("abc\r\ndef")).toEqual([
      "900150983cd24fb0d6963f7d28e17f72",
      "4ed9407630eb1000c0f6b63842defa7d",
    ])
  })
  it("single line without newline works", () => {
    expect(splitLines("only one")).toEqual(["only one"])
    expect(md5BatchHashLines("only one")).toHaveLength(1)
  })
  it("lines do not affect each other and match single hash", () => {
    const input = "password123\nhello world\n你好"
    const batch = md5BatchHashLines(input)
    const singles = input.split(/\r?\n/).map((line) => md5HashLine(line))
    expect(batch).toEqual(singles)
    expect(batch[2]).toMatch(/^[0-9a-f]{32}$/)
  })
  it("format lines map source to result", () => {
    const formatted = md5BatchFormatLines("abc", { length: 16 })
    expect(formatted).toEqual(["abc → 3cd24fb0d6963f7d"])
  })
})
