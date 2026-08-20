/**
 * datetime-converter — 日期时间格式转换工具
 * 复刻 https://www.lanren-tools.com/datetime-converter/ 核心逻辑
 *
 * 能力:
 * - parseDate(input, fromFmt?) 自动识别或按指定格式解析日期
 * - formatDate(date, fmt) 按 YYYY / MM / DD / HH / mm / ss 等占位符格式化
 * - convertDate(input, fromFmt, toFmt) 单条转换
 * - batchConvert(lines, fromFmt, toFmt) 批量转换（按行）
 * - timestamp 相关辅助
 *
 * 支持的输入格式:
 * - YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD, YYYY-MM-DD HH:mm:ss 等
 * - MM-DD-YYYY, DD/MM/YYYY
 * - ISO 8601 (2024-01-15T10:30:00.000Z)
 * - timestamp 秒/毫秒 (10位或13位纯数字)
 * - YYYYMMDD 纯数字
 * - 中文常见分隔符
 */

export const SUPPORTED_FORMATS = [
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY.MM.DD",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
  "MM-DD-YYYY",
  "MM/DD/YYYY",
  "DD/MM/YYYY",
  "DD-MM-YYYY",
  "ISO",
  "timestamp-s",
  "timestamp-ms",
  "YYYYMMDD",
] as const

export type DateFormat = string

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0")
}

/** 将 Date 按 fmt 格式化, 支持占位符: YYYY, YY, MM, DD, HH, mm, ss, SSS, timestamp, timestamp-ms, timestamp-s, ISO */
export function formatDate(date: Date, fmt: string): string {
  if (isNaN(date.getTime())) throw new Error("无效日期")
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const H = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  const ms = date.getMilliseconds()

  // 特殊完整格式
  if (fmt === "ISO") return date.toISOString()
  if (fmt === "timestamp-ms" || fmt === "timestamp") return String(date.getTime())
  if (fmt === "timestamp-s") return String(Math.floor(date.getTime() / 1000))

  // 替换逻辑：先保护较长的 token，避免 YYYY 被 YY 覆盖等
  // 顺序: YYYY, YY, MM, DD, HH, mm, ss, SSS
  let out = fmt
  out = out.replace(/YYYY/g, String(Y))
  out = out.replace(/YY/g, pad(Y % 100, 2))
  out = out.replace(/MM/g, pad(M))
  out = out.replace(/DD/g, pad(D))
  out = out.replace(/HH/g, pad(H))
  out = out.replace(/SSS/g, pad(ms, 3))
  // mm/ss 需注意: 先替换 SSS 后再处理 mm/ss
  out = out.replace(/mm/g, pad(m))
  out = out.replace(/ss/g, pad(s))
  return out
}

/** 尝试按 fromFmt 解析 input，fromFmt 为空或 "auto" 时自动识别 */
export function parseDate(input: string, fromFmt?: string): Date {
  const raw = input.trim()
  if (!raw) throw new Error("请输入日期")

  // timestamp 纯数字
  if (/^\d{10}$/.test(raw) && (!fromFmt || fromFmt === "auto" || fromFmt === "timestamp-s")) {
    return new Date(Number(raw) * 1000)
  }
  if (/^\d{13}$/.test(raw) && (!fromFmt || fromFmt === "auto" || fromFmt === "timestamp-ms" || fromFmt === "timestamp")) {
    return new Date(Number(raw))
  }

  // 显式 fromFmt 处理
  if (fromFmt && fromFmt !== "auto") {
    if (fromFmt === "timestamp-s" && /^\d+$/.test(raw)) return new Date(Number(raw) * 1000)
    if ((fromFmt === "timestamp-ms" || fromFmt === "timestamp") && /^\d+$/.test(raw)) return new Date(Number(raw))
    if (fromFmt === "ISO") {
      const d = new Date(raw)
      if (!isNaN(d.getTime())) return d
      throw new Error(`无法解析 "${raw}" 为 ${fromFmt}`)
    }
    if (fromFmt === "YYYYMMDD" && /^\d{8}$/.test(raw)) {
      const y = Number(raw.slice(0, 4))
      const mo = Number(raw.slice(4, 6))
      const da = Number(raw.slice(6, 8))
      const d = new Date(y, mo - 1, da)
      if (!isNaN(d.getTime())) return d
    }
    // 对自定义 fmt，通过构建正则来解析
    const parsed = parseWithFormat(raw, fromFmt)
    if (parsed) return parsed
    // 回退到 Date
    const d = new Date(raw)
    if (!isNaN(d.getTime())) return d
    throw new Error(`无法解析 "${raw}" 为 ${fromFmt}`)
  }

  // auto 模式：依次尝试
  // 1. YYYYMMDD
  if (/^\d{8}$/.test(raw)) {
    const y = Number(raw.slice(0, 4))
    const mo = Number(raw.slice(4, 6))
    const da = Number(raw.slice(6, 8))
    const d = new Date(y, mo - 1, da)
    if (!isNaN(d.getTime()) && d.getFullYear() === y) return d
  }

  // 2. 尝试 parseWithFormat 常见格式
  const commonFormats = [
    "YYYY-MM-DD HH:mm:ss",
    "YYYY/MM/DD HH:mm:ss",
    "YYYY.MM.DD HH:mm:ss",
    "YYYY-MM-DD HH:mm",
    "YYYY/MM/DD HH:mm",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "YYYY.MM.DD",
    "MM-DD-YYYY",
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "DD-MM-YYYY",
  ]
  for (const fmt of commonFormats) {
    const d = parseWithFormat(raw, fmt)
    if (d) return d
  }

  // 3. ISO / new Date 回退
  const d = new Date(raw)
  if (!isNaN(d.getTime())) return d

  // 4. 中文日期如 2024年01月15日
  const cnMatch = raw.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s*(\d{1,2}):(\d{1,2}):?(\d{1,2})?)?/)
  if (cnMatch) {
    const [, y, mo, da, h, mi, se] = cnMatch
    const dd = new Date(Number(y), Number(mo) - 1, Number(da), Number(h || 0), Number(mi || 0), Number(se || 0))
    if (!isNaN(dd.getTime())) return dd
  }

  throw new Error(`无法解析日期 "${raw}"`)
}

/** 使用格式字符串构建正则并解析，返回 Date 或 null */
function parseWithFormat(input: string, fmt: string): Date | null {
  // 转义正则特殊字符（除占位符）
  const tokenMap: Record<string, string> = {
    YYYY: "(\\d{4})",
    YY: "(\\d{2})",
    MM: "(\\d{1,2})",
    DD: "(\\d{1,2})",
    HH: "(\\d{1,2})",
    mm: "(\\d{1,2})",
    ss: "(\\d{1,2})",
    SSS: "(\\d{1,3})",
  }
  // 构建正则：先占位替换为临时标记，再转义，最后替换标记为捕获组
  const placeholders = Object.keys(tokenMap)
  const tmpPrefix = "__PH_"
  let tmp = fmt
  placeholders.forEach((ph, i) => {
    tmp = tmp.split(ph).join(`${tmpPrefix}${i}__`)
  })
  // 转义剩余字符
  tmp = tmp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  placeholders.forEach((ph, i) => {
    tmp = tmp.split(`${tmpPrefix}${i}__`).join(tokenMap[ph])
  })
  // 空格兼容 \s+
  tmp = tmp.replace(/\s+/g, "\\s+")
  const re = new RegExp(`^${tmp}$`)
  const m = input.match(re)
  if (!m) return null

  // 按 fmt 顺序提取对应值
  let Y = 1970, Mo = 1, Dd = 1, Hh = 0, Mm = 0, Ss = 0, Mss = 0
  let idx = 1
  // 需按在 fmt 中出现的顺序遍历
  const order: string[] = []
  let scan = fmt
  while (scan.length) {
    let found: string | null = null
    let pos = Infinity
    for (const ph of placeholders) {
      const p = scan.indexOf(ph)
      if (p !== -1 && p < pos) { pos = p; found = ph }
    }
    if (!found) break
    order.push(found)
    scan = scan.slice(pos + found.length)
  }
  for (const ph of order) {
    const val = m[idx++]
    if (val === undefined) continue
    const n = Number(val)
    switch (ph) {
      case "YYYY": Y = n; break
      case "YY": Y = n < 70 ? 2000 + n : 1900 + n; break
      case "MM": Mo = n; break
      case "DD": Dd = n; break
      case "HH": Hh = n; break
      case "mm": Mm = n; break
      case "ss": Ss = n; break
      case "SSS": Mss = n; break
    }
  }
  // 校验月份
  if (Mo < 1 || Mo > 12 || Dd < 1 || Dd > 31) return null
  const d = new Date(Y, Mo - 1, Dd, Hh, Mm, Ss, Mss)
  if (isNaN(d.getTime())) return null
  // 严格校验（防止 2024-02-30 被自动进位）
  if (d.getFullYear() !== Y || d.getMonth() !== Mo - 1 || d.getDate() !== Dd) return null
  return d
}

/** 单条转换 */
export function convertDate(input: string, fromFmt: string, toFmt: string): string {
  const d = parseDate(input, fromFmt)
  return formatDate(d, toFmt)
}

/** 批量转换，按行分隔，空行保留 */
export function batchConvert(input: string, fromFmt: string, toFmt: string): string[] {
  const lines = input.split(/\r?\n/)
  return lines.map((line) => {
    if (line.trim() === "") return ""
    try {
      return convertDate(line, fromFmt, toFmt)
    } catch (e: any) {
      return `ERROR: ${e.message}`
    }
  })
}

/** 获取当前时间按指定格式 */
export function nowFormatted(fmt: string): string {
  return formatDate(new Date(), fmt)
}

export default { parseDate, formatDate, convertDate, batchConvert, nowFormatted, SUPPORTED_FORMATS }
