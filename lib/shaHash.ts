export type ShaAlgorithm = "SHA-1" | "SHA-224" | "SHA-256" | "SHA-384" | "SHA-512"

const SHA_ALGORITHMS: ShaAlgorithm[] = ["SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"]

export function isShaAlgorithm(value: string): value is ShaAlgorithm {
  return (SHA_ALGORITHMS as string[]).includes(value)
}

function toHex(bytes: Uint8Array): string {
  let out = ""
  for (const b of bytes) {
    out += b.toString(16).padStart(2, "0")
  }
  return out
}

async function subtleHash(text: string, algo: ShaAlgorithm): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest(algo, data)
  return toHex(new Uint8Array(digest))
}

const K256 = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]

const IV_SHA256 = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]

const IV_SHA224 = [
  0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
  0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4,
]

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n))
}

function wordToHexBE(n: number): string {
  let out = ""
  for (let i = 3; i >= 0; i--) {
    out += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0")
  }
  return out
}

function sha256FamilyBytes(bytes: number[], iv: number[], outputWords: number): string {
  const bitLen = bytes.length * 8
  const padded = [...bytes]
  padded.push(0x80)
  while (padded.length % 64 !== 56) {
    padded.push(0)
  }
  const highLen = Math.floor(bitLen / 4294967296)
  const lowLen = bitLen >>> 0
  padded.push((highLen >>> 24) & 0xff, (highLen >>> 16) & 0xff, (highLen >>> 8) & 0xff, highLen & 0xff)
  padded.push((lowLen >>> 24) & 0xff, (lowLen >>> 16) & 0xff, (lowLen >>> 8) & 0xff, lowLen & 0xff)

  const H = [...iv]
  const w = new Array<number>(64)

  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let t = 0; t < 16; t++) {
      const i = offset + t * 4
      w[t] = ((padded[i] << 24) | (padded[i + 1] << 16) | (padded[i + 2] << 8) | padded[i + 3]) | 0
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3)
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10)
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0
    }
    let a = H[0]
    let b = H[1]
    let c = H[2]
    let d = H[3]
    let e = H[4]
    let f = H[5]
    let g = H[6]
    let h = H[7]
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const temp1 = (h + S1 + ch + K256[t] + w[t]) | 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) | 0
      h = g
      g = f
      f = e
      e = (d + temp1) | 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) | 0
    }
    H[0] = (H[0] + a) | 0
    H[1] = (H[1] + b) | 0
    H[2] = (H[2] + c) | 0
    H[3] = (H[3] + d) | 0
    H[4] = (H[4] + e) | 0
    H[5] = (H[5] + f) | 0
    H[6] = (H[6] + g) | 0
    H[7] = (H[7] + h) | 0
  }

  let out = ""
  for (let i = 0; i < outputWords; i++) {
    out += wordToHexBE(H[i])
  }
  return out
}

function sha224Hash(text: string): string {
  const bytes = Array.from(new TextEncoder().encode(text))
  return sha256FamilyBytes(bytes, IV_SHA224, 7)
}

export async function shaHash(
  text: string,
  algo: ShaAlgorithm = "SHA-256",
  uppercase = false
): Promise<string> {
  if (!isShaAlgorithm(algo)) {
    throw new Error("不支持的 SHA 算法：" + algo)
  }
  let hex: string
  if (algo === "SHA-224") {
    hex = sha224Hash(text)
  } else {
    hex = await subtleHash(text, algo)
  }
  return uppercase ? hex.toUpperCase() : hex
}
