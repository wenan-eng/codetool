export function isValidIp(ip: string): boolean {
  const parts = ip.trim().split(".")
  if (parts.length !== 4) return false
  return parts.every(p => /^\d{1,3}$/.test(p) && Number(p) >= 0 && Number(p) <= 255)
}

export function ipToInt(ip: string): number {
  if (!isValidIp(ip)) throw new Error("无效的 IPv4 地址")
  return ip.trim().split(".").reduce((acc, p) => acc * 256 + Number(p), 0)
}

export function intToIp(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 0xffffffff) throw new Error("整数超出 IPv4 范围 (0-4294967295)")
  return [24, 16, 8, 0].map(shift => (n >>> shift) & 255).join(".")
}

export interface CidrInfo {
  network: string
  broadcast: string
  mask: string
  firstUsable: string
  lastUsable: string
  totalHosts: number
  usableHosts: number
}

export function parseCidr(input: string): CidrInfo {
  const m = input.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/)
  if (!m) throw new Error("格式应为 IP/前缀长度，如 192.168.1.0/24")
  const prefix = Number(m[2])
  if (prefix < 0 || prefix > 32) throw new Error("前缀长度须在 0-32 之间")
  const ipInt = ipToInt(m[1])
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (ipInt & maskInt) >>> 0
  const broadcast = (network | (~maskInt >>> 0)) >>> 0
  const total = 2 ** (32 - prefix)
  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: intToIp(maskInt),
    firstUsable: intToIp(prefix >= 31 ? network : network + 1),
    lastUsable: intToIp(prefix >= 31 ? broadcast : broadcast - 1),
    totalHosts: total,
    usableHosts: prefix >= 31 ? total : total - 2,
  }
}

export function subnetOf(ip: string, prefix: number): CidrInfo & { inputIp: string } {
  return { inputIp: ip, ...parseCidr(`${ip}/${prefix}`) }
}

const PRIVATE_RANGES: [string, string][] = [
  ["10.0.0.0", "10.255.255.255"],
  ["172.16.0.0", "172.31.255.255"],
  ["192.168.0.0", "192.168.255.255"],
]

function isReserved(n: number): boolean {
  if ((n >>> 24) === 127 || (n >>> 24) === 0 || (n >>> 24) === 169 && (n >>> 16) === 169) return true
  return PRIVATE_RANGES.some(([s, e]) => n >= ipToInt(s) && n <= ipToInt(e))
}

export function randomPublicIps(count: number): string[] {
  const out: string[] = []
  for (let i = 0; i < Math.min(Math.max(count, 1), 1000); i++) {
    let n = 0
    do {
      n = (Math.floor(Math.random() * 0xffffffff) >>> 1) | (Math.floor(Math.random() * 128) << 25)
      n = n >>> 0
    } while (isReserved(n))
    out.push(intToIp(n))
  }
  return [...new Set(out)]
}

export interface RobotsOptions {
  userAgent: string
  allow: string[]
  disallow: string[]
  crawlDelay?: number
  sitemap?: string
}

export function generateRobots(o: RobotsOptions): string {
  const lines: string[] = []
  lines.push(`User-agent: ${o.userAgent || "*"}`)
  for (const a of o.disallow.filter(Boolean)) lines.push(`Disallow: ${a}`)
  for (const a of o.allow.filter(Boolean)) lines.push(`Allow: ${a}`)
  if (o.crawlDelay && o.crawlDelay > 0) lines.push(`Crawl-delay: ${o.crawlDelay}`)
  if (o.sitemap?.trim()) lines.push(`Sitemap: ${o.sitemap.trim()}`)
  return lines.join("\n") + "\n"
}

export interface RobotIssue { line: number; message: string }

export function checkRobots(text: string): RobotIssue[] {
  const issues: RobotIssue[] = []
  const seenAgents = new Set<string>()
  let hasDisallow = false
  text.split(/\r?\n/).forEach((raw, i) => {
    const lineNo = i + 1
    const line = raw.trim()
    if (!line || line.startsWith("#")) return
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/)
    if (!m) { issues.push({ line: lineNo, message: `无法识别的行格式（缺少冒号）` }); return }
    const [, key, value] = m
    if (key.toLowerCase() === "user-agent") {
      if (!value) issues.push({ line: lineNo, message: "User-agent 值为空" })
      seenAgents.add(value)
    } else if (["allow", "disallow"].includes(key.toLowerCase())) {
      if (!value) issues.push({ line: lineNo, message: `${key} 值为空` })
      if (!value.startsWith("/") && value !== "") issues.push({ line: lineNo, message: `${key} 路径建议以 / 开头` })
      if (key.toLowerCase() === "disallow" && value) hasDisallow = true
    } else if (!["crawl-delay", "sitemap", "clean-param"].includes(key.toLowerCase())) {
      issues.push({ line: lineNo, message: `未知指令: ${key}` })
    }
  })
  if (text.trim() && !hasDisallow) issues.push({ line: 0, message: "未发现任何 Disallow 规则，该文件等于允许全部抓取" })
  return issues
}

export interface MetaOptions {
  title: string
  description: string
  keywords: string
  author: string
  viewport: boolean
  charset: boolean
  robotsIndex: boolean
  ogTitle: boolean
}

export function generateMeta(o: MetaOptions): string {
  const lines: string[] = []
  if (o.charset) lines.push(`<meta charset="UTF-8">`)
  if (o.title.trim()) lines.push(`<title>${o.title.trim()}</title>`)
  if (o.viewport) lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
  if (o.description.trim()) lines.push(`<meta name="description" content="${o.description.trim()}">`)
  if (o.keywords.trim()) lines.push(`<meta name="keywords" content="${o.keywords.trim()}">`)
  if (o.author.trim()) lines.push(`<meta name="author" content="${o.author.trim()}">`)
  if (!o.robotsIndex) lines.push(`<meta name="robots" content="noindex, nofollow">`)
  if (o.ogTitle && o.title.trim()) {
    lines.push(`<meta property="og:title" content="${o.title.trim()}">`)
    if (o.description.trim()) lines.push(`<meta property="og:description" content="${o.description.trim()}">`)
  }
  return lines.join("\n")
}

export function solveProportion(a: number, b: number, c: number): number {
  if (a === 0) throw new Error("比例第一项不能为 0")
  return (b * c) / a
}

export interface LogStats {
  pv: number
  uv: number
  statusCounts: { code: string; count: number }[]
  topIps: { ip: string; count: number }[]
}

const LOG_LINE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) [^"]*" (\d{3})/

export function analyzeLog(text: string): LogStats {
  const ips = new Map<string, number>()
  const statuses = new Map<string, number>()
  let pv = 0
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(LOG_LINE)
    if (!m) continue
    pv++
    const ip = m[1]
    const code = m[4]
    ips.set(ip, (ips.get(ip) || 0) + 1)
    statuses.set(code, (statuses.get(code) || 0) + 1)
  }
  return {
    pv,
    uv: ips.size,
    statusCounts: [...statuses.entries()].map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count),
    topIps: [...ips.entries()].map(([ip, count]) => ({ ip, count })).sort((a, b) => b.count - a.count).slice(0, 10),
  }
}

export function keywordDensity(text: string): { word: string; count: number; pct: number }[] {
  const words = (text.toLowerCase().match(/[\u4e00-\u9fff]{2}|[a-z0-9]{2,}/g)) || []
  const stop = new Set(["的", "了", "是", "在", "我", "有", "和", "就", "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去", "你", "会", "着", "没有", "看", "好", "自己", "这", "the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our"])
  const freq = new Map<string, number>()
  for (const w of words) {
    if (stop.has(w)) continue
    freq.set(w, (freq.get(w) || 0) + 1)
  }
  const total = words.length || 1
  return [...freq.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count, pct: Math.round((count / total) * 10000) / 100 }))
}
