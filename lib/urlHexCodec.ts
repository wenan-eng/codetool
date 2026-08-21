const UNRESERVED = /^[A-Za-z0-9\-_.~]$/

export function urlHexEncode(text: string): string {
  let out = ""
  for (const ch of text) {
    if (UNRESERVED.test(ch)) {
      out += ch
    } else {
      const charBytes = new TextEncoder().encode(ch)
      for (let i = 0; i < charBytes.length; i++) {
        out += "%" + charBytes[i].toString(16).toUpperCase().padStart(2, "0")
      }
    }
  }
  return out
}

export function urlHexDecode(text: string): string {
  const bytes: number[] = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === "%" && /^[0-9a-fA-F]{2}$/.test(text.slice(i + 1, i + 3))) {
      bytes.push(parseInt(text.slice(i + 1, i + 3), 16))
      i += 2
    } else {
      const charBytes = new TextEncoder().encode(ch)
      for (let j = 0; j < charBytes.length; j++) {
        bytes.push(charBytes[j])
      }
    }
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes))
}
