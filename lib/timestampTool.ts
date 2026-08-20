/**
 * 时间戳工具 — 纯函数实现，复刻 lanren-tools timestamp 核心逻辑
 * 使用纯 JS Date，默认按 UTC 处理以保证跨时区测试稳定，
 * 支持可选 timezone 偏移（小时数，如 8 表示 UTC+8）
 */

/** 垫零 */
function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0")
}

/**
 * 将 timezone 参数归一化为小时偏移数值
 * 支持 number / "UTC+8" / "UTC-5:30" / "+08:00" / "8" 等
 */
export function parseTimezoneOffset(tz: number | string | undefined | null): number {
  if (tz === undefined || tz === null || tz === "") return 0
  if (typeof tz === "number") return tz
  const s = String(tz).trim()
  // 纯数字
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s)
  // UTC+8 / UTC+5:30 / GMT+8 / +08:00 / UTC-12 etc
  const m = s.match(/([+-])\s*(\d{1,2})(?::?(\d{1,2}))?/)
  if (m) {
    const sign = m[1] === "+" ? 1 : -1
    const h = parseInt(m[2], 10)
    const min = m[3] ? parseInt(m[3], 10) : 0
    return sign * (h + min / 60)
  }
  return 0
}

/** 将 Date 按给定偏移量调整后用 UTC 字段格式化，避免本地时区干扰 */
function getZonedParts(date: Date, offsetHours: number) {
  const shifted = new Date(date.getTime() + offsetHours * 3600 * 1000)
  // shifted 仍用 UTC 方法读取，即为目标时区的墙钟时间
  return {
    YYYY: String(shifted.getUTCFullYear()),
    YY: String(shifted.getUTCFullYear()).slice(-2),
    MM: pad(shifted.getUTCMonth() + 1),
    DD: pad(shifted.getUTCDate()),
    HH: pad(shifted.getUTCHours()),
    H: String(shifted.getUTCHours()),
    mm: pad(shifted.getUTCMinutes()),
    i: pad(shifted.getUTCMinutes()),
    ss: pad(shifted.getUTCSeconds()),
    s: String(shifted.getUTCSeconds()),
  }
}

/**
 * 格式化日期
 * @param date Date 实例
 * @param fmt 格式字符串，支持：
 *   YYYY/YYYY年 MM 月 DD 日 HH/H 时 mm/i 分 ss/s 秒
 *   常见示例：
 *   - "YYYY-MM-DD HH:mm:ss"
 *   - "YYYY/MM/DD H:i:s"
 *   - "DD/MM/YYYY H:i:s"
 *   - "MM-DD-YYYY H:i:s"
 *   - "YYYY年MM月DD日 H:i:s"
 * @param timezone 可选时区偏移（小时），如 8 表示 UTC+8，默认 0 (UTC)
 */
export function formatDate(date: Date, fmt: string, timezone?: number | string): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) throw new Error("无效日期")
  if (!fmt) return date.toISOString()
  const offset = parseTimezoneOffset(timezone)
  const p = getZonedParts(date, offset)
  // 需按长度优先替换，避免 YYYY 被 YY 截断等
  // 使用占位方式，避免重复替换
  let out = fmt
  // 先替换最长的 token
  out = out.replace(/YYYY/g, p.YYYY)
  out = out.replace(/YY/g, p.YY)
  out = out.replace(/MM/g, p.MM)
  out = out.replace(/DD/g, p.DD)
  // HH before H
  out = out.replace(/HH/g, p.HH)
  // 单 H 但避免已替换的 HH 再次影响：先把 HH 占位后处理
  // 这里 H 可能在 fmt 中单独出现，如 "H:i:s"
  // 简单处理：若 fmt 包含 HH 已替换完，剩余的 H 即为单小时
  // 为避免将已替换的 HH 中的 H 再次替换，逐字符处理不可行，故用正则负向
  // 由于 HH 已替换为两位数字，不含字母 H，故可安全替换剩余 H
  out = out.replace(/\bH\b/g, p.H) // 边界情况
  out = out.replace(/(?<!\d)H(?!\d)/g, (m) => {
    // 若已被 HH 替换，不会命中；此处为兜底处理单独 H
    // 但 JS lookbehind 兼容性良好，避免过度复杂，直接全局 H 替换后若 fmt 原本包含 HH 会误伤
    // 所以仅在 fmt 不含 HH 情况下全局替换 H
    return p.H
  })
  // 更稳妥：若 fmt 原本含 HH 已处理完，不再全局替换 H；否则替换独立 H
  // 上述逻辑有歧义，重写简化逻辑：
  // 实际上直接按 token 长度替换更简单，用顺序替换且不使用占位会导致二次替换
  // 因此改用一次性的 tokenizer 方法
  // 为保持兼容，重做一次精确替换：
  // 若此次 out 中仍含独立 H（说明 fmt 含 H 且非 HH），则处理
  // 由于我们已用 HH 替换为数字，剩余字母 H 必为原 fmt 中的单独 H
  if (fmt.includes("H") && !fmt.includes("HH")) {
    // fmt 是单 H 模式，已用正则替换部分，这里确保全部替换
    // out 可能已部分替换，需再次全局替换剩余 H
    // 将 out 中的数字暂时保护，避免将数字中的 H 误判
    // 更简单：直接重新基于原始 fmt 用 tokenizer 生成
  }

  // 为确保正确性，采用 tokenizer 重建：遍历 fmt 字符，识别 token
  // 若上一步替换导致歧义，则抛弃上一步结果，重新 tokenise
  // Token 列表按长度降序
  const tokens = ["YYYY", "YY", "MM", "DD", "HH", "mm", "ss"] as const
  // 对于单字母 token，需要精确匹配
  let rebuilt = ""
  let i = 0
  const originalFmt = fmt
  // 重新计算 p 已得，用 token 方法重建
  while (i < originalFmt.length) {
    let matched = false
    for (const tok of tokens) {
      if (originalFmt.slice(i, i + tok.length) === tok) {
        if (tok === "YYYY") rebuilt += p.YYYY
        else if (tok === "YY") rebuilt += p.YY
        else if (tok === "MM") rebuilt += p.MM
        else if (tok === "DD") rebuilt += p.DD
        else if (tok === "HH") rebuilt += p.HH
        else if (tok === "mm") rebuilt += p.mm
        else if (tok === "ss") rebuilt += p.ss
        i += tok.length
        matched = true
        break
      }
    }
    if (matched) continue
    const ch = originalFmt[i]
    if (ch === "H") {
      // 单 H 在 PHP/lanren 语境中也是垫零的 00-23，与 HH 等价，保持两位数以通过测试与原站一致
      rebuilt += p.HH
      i++
    } else if (ch === "i") {
      rebuilt += p.i
      i++
    } else if (ch === "s") {
      // 单个 s（非 ss）已在 tokens 中处理 ss，剩余 s 为单个秒不垫零
      // 但常见 fmt 用 s 表示垫零秒（等同 ss），为兼容 i:s 模式，将 s 也垫零
      // 判断：若下个字符也是 s，已被 ss 匹配，不会到这里；所以此处 s 应垫零以对齐原站 "H:i:s" 输出两位秒
      // 但任务要求精确，我们将单个 s 也输出垫零，保持 "22:13:20" 形式
      rebuilt += p.ss
      i++
    } else {
      rebuilt += ch
      i++
    }
  }
  return rebuilt
}

/** 解析日期字符串为 UTC 时间戳毫秒 */
function parseDateStringToMs(dateStr: string): number {
  const s = dateStr.trim()
  if (!s) throw new Error("请输入日期时间")

  // 若为 ISO8601 带 T 或 Z 或时区，直接用 Date.parse
  if (/T/.test(s) && /Z$|[+-]\d{2}:?\d{2}$/.test(s)) {
    const ms = Date.parse(s)
    if (isNaN(ms)) throw new Error(`无效日期格式: ${dateStr}`)
    return ms
  }
  // 纯数字字符串？可能是时间戳本身，不应进入此函数
  // 尝试 ISO 纯日期 "2023-11-14" 带时区 Z 形式
  // 手动解析 "YYYY-MM-DD HH:mm:ss" / "YYYY/MM/DD HH:mm:ss" / "YYYY-MM-DD" 等
  // 支持 "YYYY-MM-DD HH:mm:ss" "YYYY/MM/DD HH:mm:ss" "DD/MM/YYYY ..." 不支持，需转 UTC 再处理
  // 但 toTimestamp 主要处理标准 "YYYY-MM-DD HH:mm:ss" 输入，我们优先支持该格式

  // 正则提取：年-月-日 时:分:秒
  // 兼容分隔符 - / 年 月 日 中文
  // 尝试匹配 "YYYY-MM-DD HH:mm:ss" 或 "YYYY/MM/DD HH:mm:ss"
  let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
  if (m) {
    const y = parseInt(m[1], 10)
    const mo = parseInt(m[2], 10) - 1
    const d = parseInt(m[3], 10)
    const hh = m[4] ? parseInt(m[4], 10) : 0
    const mm = m[5] ? parseInt(m[5], 10) : 0
    const ss = m[6] ? parseInt(m[6], 10) : 0
    return Date.UTC(y, mo, d, hh, mm, ss)
  }
  // 中文格式 "YYYY年MM月DD日 HH:mm:ss" 或 "YYYY年MM月DD日 H:i:s"
  m = s.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
  if (m) {
    const y = parseInt(m[1], 10)
    const mo = parseInt(m[2], 10) - 1
    const d = parseInt(m[3], 10)
    const hh = m[4] ? parseInt(m[4], 10) : 0
    const mm = m[5] ? parseInt(m[5], 10) : 0
    const ss = m[6] ? parseInt(m[6], 10) : 0
    return Date.UTC(y, mo, d, hh, mm, ss)
  }
  // DD/MM/YYYY 或 MM/DD/YYYY 的歧义格式，暂不支持 toTimestamp，主用于 formatDate
  // 尝试直接 Date.parse 作为 fallback，但需强制按 UTC 理解：若 parse 结果与手动 UTC 不符，使用 UTC 假设
  const parsed = Date.parse(s.replace(/\//g, "-").replace(" ", "T"))
  if (!isNaN(parsed)) {
    // Date.parse 会按本地或 UTC 解析（带 T 的按 UTC），为保证跨环境一致，若原字符串不含 T，则按 UTC 处理
    // 已在上方手动处理不含 T 的标准格式，此处若仍能 parse，返回该值
    return parsed
  }
  throw new Error(`无效日期格式: ${dateStr}`)
}

/**
 * 日期字符串转时间戳
 * @param dateStr 日期字符串，如 "2023-11-14 22:13:20"、"2023-11-14"、"2023/11/14 22:13:20"
 * @param unit 's' 秒 | 'ms' 毫秒
 * @param timezone 可选，输入日期字符串所在时区，默认 0 (UTC)。若为 8，表示输入为北京时间，需减去 8h 再转 UTC 时间戳
 */
export function toTimestamp(dateStr: string, unit: "s" | "ms", timezone?: number | string): number {
  const msUtc = parseDateStringToMs(dateStr)
  const offset = parseTimezoneOffset(timezone)
  // 若输入是某时区的墙钟时间，实际 UTC = wall - offset
  const utcMs = msUtc - offset * 3600 * 1000
  if (unit === "s") return Math.floor(utcMs / 1000)
  return utcMs
}

/**
 * 时间戳转日期字符串
 * @param ts 时间戳数值或字符串（10位秒或13位毫秒均可，依据 unit 判断）
 * @param unit 's' 秒 | 'ms' 毫秒，指示 ts 的单位
 * @param timezone 可选目标时区偏移，默认 0 (UTC)
 * @returns 格式化日期 "YYYY-MM-DD HH:mm:ss"
 */
export function fromTimestamp(ts: number | string, unit: "s" | "ms", timezone?: number | string): string {
  if (ts === "" || ts === null || ts === undefined) throw new Error("请输入时间戳")
  const num = typeof ts === "string" ? Number(ts.toString().trim()) : ts
  if (isNaN(num)) throw new Error(`无效时间戳: ${ts}`)
  // 允许传入的 ts 位数与 unit 不一致时自动识别？严格按 unit 处理
  const ms = unit === "s" ? num * 1000 : num
  // 额外鲁棒性：若 unit 为 s 但传入的是 13位毫秒值（> 1e12），自动识别
  // 但为满足测试明确性，仅在 num 长度不匹配时做提示性兼容
  // 此处保持严格，除非 ms 明显异常（< 0 或 > 8e13）则不纠正
  const date = new Date(ms)
  if (isNaN(date.getTime())) throw new Error(`无效时间戳: ${ts}`)
  return formatDate(date, "YYYY-MM-DD HH:mm:ss", timezone)
}

/**
 * 批量转换：每行一个时间戳（10位秒或13位毫秒自动识别），按给定格式输出
 * @param input 多行时间戳字符串
 * @param format 目标日期格式，如 "YYYY-MM-DD H:i:s"、"YYYY/MM/DD H:i:s" 等，默认 "YYYY-MM-DD HH:mm:ss"
 * @param timezone 可选时区，默认 0 (UTC)；传入 8 则按北京时间输出
 * @returns 多行结果字符串，失败行标注 "❌ 无效时间戳: xxx"
 */
export function parseBatch(input: string, format: string, timezone?: number | string): string {
  if (!input || !input.trim()) return ""
  const fmt = format || "YYYY-MM-DD HH:mm:ss"
  const offset = parseTimezoneOffset(timezone)
  const lines = input.split(/\r?\n/)
  const out: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    // 提取行中连续数字（允许前后有空格），若整行非纯数字则视为无效
    // 支持 "1700000000" 或 "1700000000000"
    if (!/^-?\d+$/.test(line)) {
      out.push(`❌ 无效时间戳: ${raw}`)
      continue
    }
    const len = line.replace(/^-/, "").length
    let ms: number
    if (len === 13) {
      ms = Number(line)
    } else if (len === 10) {
      ms = Number(line) * 1000
    } else if (len > 10 && len < 13) {
      // 介于 11-12 位的毫秒？按 ms 处理
      ms = Number(line)
    } else if (len > 13) {
      out.push(`❌ 无效时间戳: ${raw}`)
      continue
    } else {
      // 小于10位，视为秒（如 0）
      ms = Number(line) * 1000
    }
    const date = new Date(ms)
    if (isNaN(date.getTime())) {
      out.push(`❌ 无效时间戳: ${raw}`)
      continue
    }
    try {
      out.push(formatDate(date, fmt, offset))
    } catch {
      out.push(`❌ 无效时间戳: ${raw}`)
    }
  }
  return out.join("\n")
}

/** 预设时区选项，供 Editor 下拉使用 */
export const TIMEZONES: { label: string; value: number; abbr: string }[] = [
  { label: "威克岛时间 (UTC-12)", value: -12, abbr: "UTC-12" },
  { label: "萨摩亚时间 (UTC-11)", value: -11, abbr: "UTC-11" },
  { label: "夏威夷时间 (UTC-10)", value: -10, abbr: "UTC-10" },
  { label: "阿拉斯加时间 (UTC-9)", value: -9, abbr: "UTC-9" },
  { label: "洛杉矶时间 (UTC-8)", value: -8, abbr: "UTC-8" },
  { label: "丹佛时间 (UTC-7)", value: -7, abbr: "UTC-7" },
  { label: "芝加哥时间 (UTC-6)", value: -6, abbr: "UTC-6" },
  { label: "纽约时间 (UTC-5)", value: -5, abbr: "UTC-5" },
  { label: "多伦多时间 (UTC-4)", value: -4, abbr: "UTC-4" },
  { label: "布宜诺斯艾利斯时间 (UTC-3)", value: -3, abbr: "UTC-3" },
  { label: "南乔治亚岛时间 (UTC-2)", value: -2, abbr: "UTC-2" },
  { label: "亚速尔群岛时间 (UTC-1)", value: -1, abbr: "UTC-1" },
  { label: "伦敦时间 (UTC+0)", value: 0, abbr: "UTC+0" },
  { label: "巴黎时间 (UTC+1)", value: 1, abbr: "UTC+1" },
  { label: "开罗时间 (UTC+2)", value: 2, abbr: "UTC+2" },
  { label: "莫斯科时间 (UTC+3)", value: 3, abbr: "UTC+3" },
  { label: "迪拜时间 (UTC+4)", value: 4, abbr: "UTC+4" },
  { label: "卡拉奇时间 (UTC+5)", value: 5, abbr: "UTC+5" },
  { label: "新德里时间 (UTC+5:30)", value: 5.5, abbr: "UTC+5:30" },
  { label: "达卡时间 (UTC+6)", value: 6, abbr: "UTC+6" },
  { label: "曼谷时间 (UTC+7)", value: 7, abbr: "UTC+7" },
  { label: "北京时间 (UTC+8)", value: 8, abbr: "UTC+8" },
  { label: "东京时间 (UTC+9)", value: 9, abbr: "UTC+9" },
  { label: "悉尼时间 (UTC+10)", value: 10, abbr: "UTC+10" },
  { label: "马加丹时间 (UTC+11)", value: 11, abbr: "UTC+11" },
  { label: "奥克兰时间 (UTC+12)", value: 12, abbr: "UTC+12" },
]

/** 批量工具的 7 种预设格式 */
export const BATCH_FORMATS: { label: string; value: string }[] = [
  { label: "YYYY/MM/DD H:i:s", value: "YYYY/MM/DD H:i:s" },
  { label: "YYYY-MM-DD H:i:s", value: "YYYY-MM-DD H:i:s" },
  { label: "DD/MM/YYYY H:i:s", value: "DD/MM/YYYY H:i:s" },
  { label: "MM/DD/YYYY H:i:s", value: "MM/DD/YYYY H:i:s" },
  { label: "DD-MM-YYYY H:i:s", value: "DD-MM-YYYY H:i:s" },
  { label: "MM-DD-YYYY H:i:s", value: "MM-DD-YYYY H:i:s" },
  { label: "YYYY年MM月DD日 H:i:s", value: "YYYY年MM月DD日 H:i:s" },
]

export default { toTimestamp, fromTimestamp, formatDate, parseBatch, parseTimezoneOffset, TIMEZONES, BATCH_FORMATS }
