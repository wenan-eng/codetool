function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function sha1Bytes(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-1", data as unknown as ArrayBuffer)
  return new Uint8Array(digest)
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length)
  out.set(a, 0)
  out.set(b, a.length)
  return out
}

export type HtpasswdAlgorithm = "SHA" | "SSHA"

export async function htpasswdGenerate(
  username: string,
  password: string,
  algorithm: HtpasswdAlgorithm
): Promise<string> {
  if (!username) {
    throw new Error("用户名不能为空")
  }
  if (username.includes(":")) {
    throw new Error("用户名不能包含冒号（:）")
  }
  const passwordBytes = new TextEncoder().encode(password)
  if (algorithm === "SHA") {
    const hash = await sha1Bytes(passwordBytes)
    return `${username}:{SHA}${bytesToBase64(hash)}`
  }
  const salt = new Uint8Array(4)
  crypto.getRandomValues(salt)
  const hashed = await sha1Bytes(concatBytes(passwordBytes, salt))
  const digest = concatBytes(hashed, salt)
  return `${username}:{SSHA}${bytesToBase64(digest)}`
}
