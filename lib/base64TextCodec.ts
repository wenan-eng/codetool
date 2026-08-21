export function base64EncodeText(text: string): string {
  if (!text) return ""
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export function base64DecodeText(encoded: string): string {
  const trimmed = encoded.trim()
  if (!trimmed) return ""
  const compact = trimmed.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/")
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) {
    throw new Error("非法的 Base64 输入，包含无效字符")
  }
  if (compact.length % 4 === 1) {
    throw new Error("非法的 Base64 输入，长度不正确")
  }
  const padded = compact + "=".repeat((4 - (compact.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder("utf-8").decode(bytes)
}
