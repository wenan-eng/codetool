const PRESERVED = /[A-Za-z0-9@*_+\-./]/

export function escapeEncode(input: string): string {
  let out = ""
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (PRESERVED.test(ch)) {
      out += ch
      continue
    }
    const code = ch.charCodeAt(0)
    if (code <= 0xff) {
      out += "%" + code.toString(16).toUpperCase().padStart(2, "0")
    } else {
      out += "%u" + code.toString(16).toUpperCase().padStart(4, "0")
    }
  }
  return out
}

export function escapeDecode(input: string): string {
  let out = ""
  for (let i = 0; i < input.length; ) {
    const ch = input[i]
    if (ch === "%" && i + 1 < input.length) {
      const next = input[i + 1]
      if (next === "u" || next === "U") {
        const hex = input.slice(i + 2, i + 6)
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          out += String.fromCharCode(parseInt(hex, 16))
          i += 6
          continue
        }
      } else {
        const hex = input.slice(i + 1, i + 3)
        if (/^[0-9a-fA-F]{2}$/.test(hex)) {
          out += String.fromCharCode(parseInt(hex, 16))
          i += 3
          continue
        }
      }
    }
    out += ch
    i++
  }
  return out
}

export function transformEscape(input: string, mode: "encode" | "decode"): string {
  return mode === "encode" ? escapeEncode(input) : escapeDecode(input)
}
