import { describe, it, expect } from "vitest"
import { convertDate, batchConvert, parseDate, formatDate } from "./datetimeConverter"

describe("datetimeConverter", () => {
  it("convertDate: YYYY-MM-DD -> YYYY/MM/DD", () => {
    expect(convertDate("2024-01-15", "YYYY-MM-DD", "YYYY/MM/DD")).toBe("2024/01/15")
  })

  it("convertDate: YYYY-MM-DD HH:mm:ss -> MM-DD-YYYY", () => {
    expect(convertDate("2024-01-15 10:30:00", "YYYY-MM-DD HH:mm:ss", "MM-DD-YYYY")).toBe("01-15-2024")
  })

  it("convertDate: timestamp-s -> YYYY-MM-DD", () => {
    // 1705276800 = 2024-01-15 00:00:00 UTC, 本地时区可能不同，验证 timestamp 往返一致性 + format
    const d = parseDate("1705276800", "timestamp-s")
    const out = formatDate(d, "YYYY-MM-DD")
    // 重新解析应得到同一天（往返）
    const d2 = parseDate(out, "YYYY-MM-DD")
    expect(d2.getDate()).toBe(d.getDate())
    expect(d2.getMonth()).toBe(d.getMonth())
    expect(d2.getFullYear()).toBe(d.getFullYear())
    // 直接 timestamp-s -> timestamp-ms 转换正确
    expect(convertDate("1705276800", "timestamp-s", "timestamp-ms")).toBe(String(1705276800 * 1000))
  })

  it("batchConvert: 批量多行转换含空行保留", () => {
    const input = "2024-01-15\n2024-02-20\n\n2024-03-10"
    const results = batchConvert(input, "YYYY-MM-DD", "YYYY/MM/DD")
    expect(results).toEqual(["2024/01/15", "2024/02/20", "", "2024/03/10"])
  })

  it("convertDate: ISO -> DD/MM/YYYY & auto detection", () => {
    // ISO 自动识别
    const d = parseDate("2024-01-15T10:30:00.000Z", "auto")
    expect(formatDate(d, "DD/MM/YYYY")).toBe(
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    )
    // YYYYMMDD 自动识别
    expect(convertDate("20240115", "auto", "YYYY-MM-DD")).toBe("2024-01-15")
  })

  it("formatDate: 自定义格式 YYYY年MM月DD日 HH:mm:ss", () => {
    const d = parseDate("2024-01-15 08:05:09", "YYYY-MM-DD HH:mm:ss")
    expect(formatDate(d, "YYYY年MM月DD日 HH:mm:ss")).toBe("2024年01月15日 08:05:09")
    expect(formatDate(d, "YY/MM/DD")).toBe("24/01/15")
  })

  it("parseDate throws on invalid", () => {
    expect(() => parseDate("not-a-date", "YYYY-MM-DD")).toThrow()
    expect(() => parseDate("", "auto")).toThrow()
  })
})
