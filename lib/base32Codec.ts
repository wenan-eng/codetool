const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

const LOOKUP: Record<string, number> = {}
for (let i = 0; i < ALPHABET.length; i++) {
  LOOKUP[ALPHABET[i]] = i
}

export function base32Encode(text: string): string {
  if (!text) return ""
  const bytes = new TextEncoder().encode(text)
  let out = ""
  let buffer = 0
  let bits = 0
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += ALPHABET[(buffer >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) {
    out += ALPHABET[(buffer << (5 - bits)) & 31]
  }
  while (out.length % 8 !== 0) {
    out += "="
  }
  return out
}

export function base32Decode(encoded: string): string {
  const cleaned = encoded.replace(/[\s=]+/g, "").toUpperCase()
  if (!cleaned) return ""
  const bytes: number[] = []
  let buffer = 0
  let bits = 0
  for (const ch of cleaned) {
    const value = LOOKUP[ch]
    if (value === undefined) {
      throw new Error(`非法的 Base32 字符: ${ch}`)
    }
    buffer = (buffer << 5) | value
    bits += 5
    if (bits >= 8) {
      bits -= 8
      bytes.push((buffer >>> bits) & 255)
    }
  }
  return new TextDecoder("utf-8").decode(new Uint8Array(bytes))
}
