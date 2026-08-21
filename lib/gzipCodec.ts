export async function gzipEncode(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"))
  const buffer = await new Response(stream).arrayBuffer()
  return arrayBufferToBase64(buffer)
}

export async function gzipDecode(base64: string): Promise<string> {
  const trimmed = base64.trim()
  if (!trimmed) return ""
  const bytes = base64ToBytes(trimmed)
  if (bytes.length < 2 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
    throw new Error("不是有效的 Gzip 数据（缺少魔数）")
  }
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))
    const buffer = await new Response(stream).arrayBuffer()
    return new TextDecoder("utf-8").decode(buffer)
  } catch {
    throw new Error("Gzip 数据损坏或格式不正确，无法解码")
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const normalized = base64.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "")
  let binary: string
  try {
    binary = atob(normalized)
  } catch {
    throw new Error("无效的 Base64 编码")
  }
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
