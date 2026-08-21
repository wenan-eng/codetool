export function encodeUrl(input: string): string {
  return encodeURIComponent(input)
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input)
  } catch {
    return input
  }
}

export function transformUrl(input: string, mode: "encode" | "decode"): string {
  return mode === "encode" ? encodeUrl(input) : decodeUrl(input)
}
