export interface ParsedDataUrl {
  mime: string
  bytes: Uint8Array
  size: number
}

const BASE64_RE = /^[A-Za-z0-9+/\-_]*={0,2}$/

export function base64ToBytes(b64: string): Uint8Array {
  const normalized = b64.replaceAll("-", "+").replaceAll("_", "/").replace(/\s+/g, "").replace(/=+$/, "")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
  const bin = atob(padded)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function parseDataUrl(input: string): ParsedDataUrl {
  const trimmed = input.trim()
  if (!trimmed) throw new Error("输入为空")
  const match = trimmed.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/)
  if (match) {
    const mime = match[1] || "text/plain"
    if (!match[2]) throw new Error("仅支持 base64 格式的 Data URL")
    const payload = match[3].replace(/\s+/g, "")
    if (!payload || !BASE64_RE.test(payload)) throw new Error("base64 数据格式非法")
    const bytes = base64ToBytes(payload)
    if (bytes.length === 0) throw new Error("base64 数据为空")
    return { mime, bytes, size: bytes.length }
  }
  const payload = trimmed.replace(/\s+/g, "")
  if (!BASE64_RE.test(payload)) throw new Error("无法识别的格式：请输入 Data URL 或纯 base64 字符串")
  const bytes = base64ToBytes(payload)
  if (bytes.length === 0) throw new Error("base64 数据为空")
  return { mime: sniffMime(bytes), bytes, size: bytes.length }
}

export function sniffMime(bytes: Uint8Array): string {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png"
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg"
  if (bytes.length >= 6 && String.fromCharCode(...bytes.slice(0, 3)) === "GIF") return "image/gif"
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp"
  if (bytes.length >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d) return "image/bmp"
  if (bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf"
  if (bytes.length >= 4 && String.fromCharCode(...bytes.slice(0, 4)) === "PK\x03\x04") return "application/zip"
  return "application/octet-stream"
}

export function bytesToBase64(bytes: Uint8Array): string {
  let bin = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

export function formatFileSize(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "-"
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(2)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
    "application/zip": ".zip",
    "text/plain": ".txt",
  }
  return map[mime] || ""
}
