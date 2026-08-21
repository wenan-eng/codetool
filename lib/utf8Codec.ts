export function utf8Encode(input: string): string {
  let out = ""
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i)
    if (code < 0x80) {
      out += input[i]
    } else {
      out += "\\u" + code.toString(16).toLowerCase().padStart(4, "0")
    }
  }
  return out
}

export function utf8Decode(input: string): string {
  return input.replace(/\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})/g, (_match, u: string | undefined, x: string | undefined) => {
    const hex = u !== undefined ? u : x
    return String.fromCharCode(parseInt(hex as string, 16))
  })
}

export function transformUtf8(input: string, mode: "encode" | "decode"): string {
  return mode === "encode" ? utf8Encode(input) : utf8Decode(input)
}
