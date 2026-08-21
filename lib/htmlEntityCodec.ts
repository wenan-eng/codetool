const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  times: "×",
  divide: "÷",
  plusmn: "±",
  deg: "°",
  sup2: "²",
  sup3: "³",
  frac12: "½",
  frac14: "¼",
  micro: "µ",
  para: "¶",
  sect: "§",
  middot: "·",
  cent: "¢",
  pound: "£",
  yen: "¥",
  euro: "€",
  bull: "•",
  dagger: "†",
  permil: "‰",
  larr: "←",
  rarr: "→",
  uarr: "↑",
  darr: "↓",
  harr: "↔",
}

function isValidCodePoint(code: number): boolean {
  return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
}

export function htmlEntityEncode(input: string): string {
  let out = ""
  for (const ch of input) {
    switch (ch) {
      case "&":
        out += "&amp;"
        break
      case "<":
        out += "&lt;"
        break
      case ">":
        out += "&gt;"
        break
      case '"':
        out += "&quot;"
        break
      case "'":
        out += "&#39;"
        break
      default: {
        const code = ch.codePointAt(0) as number
        out += code > 0x7f ? `&#${code};` : ch
      }
    }
  }
  return out
}

export function htmlEntityDecode(input: string): string {
  return input.replace(
    /&(?:#[xX]([0-9a-fA-F]+)|#([0-9]+)|([a-zA-Z][a-zA-Z0-9]*));/g,
    (match, hex: string | undefined, dec: string | undefined, name: string | undefined) => {
      if (hex !== undefined) {
        const code = parseInt(hex, 16)
        return isValidCodePoint(code) ? String.fromCodePoint(code) : match
      }
      if (dec !== undefined) {
        const code = parseInt(dec, 10)
        return isValidCodePoint(code) ? String.fromCodePoint(code) : match
      }
      const mapped = NAMED_ENTITIES[(name as string).toLowerCase()]
      return mapped !== undefined ? mapped : match
    },
  )
}

export function transformHtmlEntity(input: string, mode: "encode" | "decode"): string {
  return mode === "encode" ? htmlEntityEncode(input) : htmlEntityDecode(input)
}
