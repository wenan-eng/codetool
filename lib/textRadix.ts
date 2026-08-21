export type TextRadix = 16 | 8 | 2

const PAD_WIDTH: Record<TextRadix, number> = { 16: 2, 8: 3, 2: 8 }

function byteToRadix(byte: number, radix: TextRadix): string {
  return byte.toString(radix).padStart(PAD_WIDTH[radix], "0").toUpperCase()
}

export function textToRadix(text: string, radix: TextRadix): string {
  if (!text) return ""
  const bytes = new TextEncoder().encode(text)
  return Array.from(bytes)
    .map((b) => byteToRadix(b, radix))
    .join(" ")
}

export function radixToText(encoded: string, radix: TextRadix): string {
  const trimmed = encoded.trim()
  if (!trimmed) return ""
  const parts = trimmed.split(/[\s,]+/).filter(Boolean)
  const bytes: number[] = []
  for (const part of parts) {
    if (!/^[0-9a-fA-F]+$/.test(part)) throw new Error(`非法的 ${radix} 进制字节: ${part}`)
    const value = parseInt(part, radix)
    if (isNaN(value) || value < 0 || value > 255) throw new Error(`非法的 ${radix} 进制字节: ${part}`)
    bytes.push(value)
  }
  return new TextDecoder("utf-8").decode(new Uint8Array(bytes))
}
