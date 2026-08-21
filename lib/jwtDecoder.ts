export interface JwtTimes {
  label: string
  iso: string
}

export interface JwtDecoded {
  headerJson: string
  payloadJson: string
  signature: string
  header: Record<string, unknown>
  payload: Record<string, unknown>
  times: JwtTimes[]
}

export function base64UrlEncode(value: unknown): string {
  const json = JSON.stringify(value)
  const bytes = new TextEncoder().encode(json)
  let binary = ""
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
  let binary: string
  try {
    binary = atob(padded)
  } catch {
    throw new Error("不是合法的 Base64URL 编码")
  }
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder("utf-8").decode(bytes)
}

function parseJsonSegment(raw: string, label: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("not object")
    }
    return parsed as Record<string, unknown>
  } catch {
    throw new Error(`${label}不是合法的 JSON`)
  }
}

function formatTimestamp(seconds: number): string {
  return new Date(seconds * 1000).toISOString()
}

function extractTimes(payload: Record<string, unknown>): JwtTimes[] {
  const times: JwtTimes[] = []
  for (const key of ["exp", "iat", "nbf"] as const) {
    const value = payload[key]
    if (typeof value === "number" && Number.isFinite(value)) {
      const labels: Record<string, string> = { exp: "过期时间 exp", iat: "签发时间 iat", nbf: "生效时间 nbf" }
      times.push({ label: labels[key], iso: formatTimestamp(value) })
    }
  }
  return times
}

export function decodeJwt(token: string): JwtDecoded {
  const trimmed = token.trim()
  if (!trimmed) throw new Error("请输入 JWT 令牌")
  const parts = trimmed.split(".")
  if (parts.length !== 3) {
    throw new Error(`JWT 应由三段组成（header.payload.signature），当前为 ${parts.length} 段`)
  }
  const [headerPart, payloadPart, signaturePart] = parts
  if (!headerPart || !payloadPart) throw new Error("JWT 头部或载荷为空")
  let headerRaw: string
  let payloadRaw: string
  try {
    headerRaw = base64UrlDecode(headerPart)
  } catch (e) {
    throw new Error(`JWT 头部${(e as Error).message}`)
  }
  try {
    payloadRaw = base64UrlDecode(payloadPart)
  } catch (e) {
    throw new Error(`JWT 载荷${(e as Error).message}`)
  }
  const header = parseJsonSegment(headerRaw, "JWT 头部")
  const payload = parseJsonSegment(payloadRaw, "JWT 载荷")
  return {
    header,
    payload,
    headerJson: JSON.stringify(header, null, 2),
    payloadJson: JSON.stringify(payload, null, 2),
    signature: signaturePart,
    times: extractTimes(payload),
  }
}
