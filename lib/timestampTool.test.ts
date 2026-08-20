import { describe, it, expect } from "vitest"
import { toTimestamp, fromTimestamp, formatDate, parseBatch } from "./timestampTool"

describe("timestampTool", () => {
  it("fromTimestamp: 1700000000 (s) -> 2023-11-14 22:13:20 UTC", () => {
    const result = fromTimestamp(1700000000, "s")
    expect(result).toContain("2023-11-14")
    expect(result).toBe("2023-11-14 22:13:20")
    // ms unit 同值
    expect(fromTimestamp(1700000000000, "ms")).toBe("2023-11-14 22:13:20")
    // string 输入
    expect(fromTimestamp("1700000000", "s")).toBe("2023-11-14 22:13:20")
  })

  it("toTimestamp: 2023-11-14 22:13:20 -> 1700000000 (s) and ms", () => {
    expect(toTimestamp("2023-11-14 22:13:20", "s")).toBe(1700000000)
    expect(toTimestamp("2023-11-14 22:13:20", "ms")).toBe(1700000000000)
    // 斜杠分隔也兼容
    expect(toTimestamp("2023/11/14 22:13:20", "s")).toBe(1700000000)
    // 仅日期
    expect(toTimestamp("2023-11-14", "s")).toBe(Date.UTC(2023, 10, 14, 0, 0, 0) / 1000)
  })

  it("formatDate: supports 7 batch formats and timezone", () => {
    const d = new Date(Date.UTC(2023, 10, 14, 22, 13, 20)) // 2023-11-14 22:13:20 UTC
    expect(formatDate(d, "YYYY-MM-DD H:i:s")).toBe("2023-11-14 22:13:20")
    expect(formatDate(d, "YYYY/MM/DD H:i:s")).toBe("2023/11/14 22:13:20")
    expect(formatDate(d, "DD/MM/YYYY H:i:s")).toBe("14/11/2023 22:13:20")
    expect(formatDate(d, "MM/DD/YYYY H:i:s")).toBe("11/14/2023 22:13:20")
    expect(formatDate(d, "DD-MM-YYYY H:i:s")).toBe("14-11-2023 22:13:20")
    expect(formatDate(d, "MM-DD-YYYY H:i:s")).toBe("11-14-2023 22:13:20")
    expect(formatDate(d, "YYYY年MM月DD日 H:i:s")).toBe("2023年11月14日 22:13:20")
    // HH:mm:ss 兼容
    expect(formatDate(d, "YYYY-MM-DD HH:mm:ss")).toBe("2023-11-14 22:13:20")
    // timezone: UTC+8 -> next day 06:13:20
    expect(formatDate(d, "YYYY-MM-DD H:i:s", 8)).toBe("2023-11-15 06:13:20")
    expect(formatDate(d, "YYYY-MM-DD H:i:s", "UTC+8")).toBe("2023-11-15 06:13:20")
  })

  it("parseBatch: mixed 10位/13位 自动识别并按格式输出", () => {
    const input = "1700000000\n1700000000000\n0"
    const out = parseBatch(input, "YYYY-MM-DD H:i:s")
    const lines = out.split("\n")
    expect(lines[0]).toBe("2023-11-14 22:13:20")
    expect(lines[1]).toBe("2023-11-14 22:13:20")
    expect(lines[2]).toBe("1970-01-01 00:00:00")

    // 不同格式
    const out2 = parseBatch("1700000000", "YYYY/MM/DD H:i:s")
    expect(out2).toBe("2023/11/14 22:13:20")

    const out3 = parseBatch("1700000000", "YYYY年MM月DD日 H:i:s")
    expect(out3).toBe("2023年11月14日 22:13:20")

    // 7种格式各行验证
    const out4 = parseBatch("1700000000", "DD/MM/YYYY H:i:s")
    expect(out4).toBe("14/11/2023 22:13:20")
  })

  it("parseBatch: invalid and empty handling", () => {
    expect(parseBatch("", "YYYY-MM-DD H:i:s")).toBe("")
    expect(parseBatch("   \n  \n", "YYYY-MM-DD H:i:s")).toBe("")
    const out = parseBatch("1700000000\ninvalid\n123abc\n\n1700000000000", "YYYY-MM-DD H:i:s")
    const lines = out.split("\n")
    expect(lines[0]).toBe("2023-11-14 22:13:20")
    expect(lines[1]).toBe("❌ 无效时间戳: invalid")
    expect(lines[2]).toBe("❌ 无效时间戳: 123abc")
    expect(lines[3]).toBe("2023-11-14 22:13:20")
  })

  it("round-trip: toTimestamp -> fromTimestamp", () => {
    const original = "2023-06-01 08:30:45"
    const ts = toTimestamp(original, "s")
    const back = fromTimestamp(ts, "s")
    expect(back).toBe(original)
  })
})
