function bytesToHex(bytes: Uint8Array): string {
  let out = ""
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0")
  }
  return out
}

async function sha1Bytes(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-1", data as unknown as ArrayBuffer)
  return new Uint8Array(digest)
}

export async function mysqlPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password)
  const inner = await sha1Bytes(encoded)
  const outer = await sha1Bytes(inner)
  return "*" + bytesToHex(outer).toUpperCase()
}
