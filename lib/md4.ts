const ORDER_ROUND2 = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15]

const ORDER_ROUND3 = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]

const SHIFT_ROUND1 = [3, 7, 11, 19]

const SHIFT_ROUND2 = [3, 5, 9, 13]

const SHIFT_ROUND3 = [3, 9, 11, 15]

function rotl(x: number, c: number): number {
  return (x << c) | (x >>> (32 - c))
}

function wordToHexLE(n: number): string {
  let out = ""
  for (let i = 0; i < 4; i++) {
    out += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0")
  }
  return out
}

export function md4Bytes(bytes: number[]): string {
  const bitLen = bytes.length * 8
  const padded = [...bytes]
  padded.push(0x80)
  while (padded.length % 64 !== 56) {
    padded.push(0)
  }
  const lowLen = bitLen >>> 0
  const highLen = Math.floor(bitLen / 4294967296)
  for (let i = 0; i < 4; i++) {
    padded.push((lowLen >>> (i * 8)) & 0xff)
  }
  for (let i = 0; i < 4; i++) {
    padded.push((highLen >>> (i * 8)) & 0xff)
  }

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  for (let chunkStart = 0; chunkStart < padded.length; chunkStart += 64) {
    const M = new Array<number>(16)
    for (let j = 0; j < 16; j++) {
      const i = chunkStart + j * 4
      M[j] = (padded[i] | (padded[i + 1] << 8) | (padded[i + 2] << 16) | (padded[i + 3] << 24)) | 0
    }
    let a = a0
    let b = b0
    let c = c0
    let d = d0

    for (let i = 0; i < 16; i++) {
      const next = rotl((a + ((b & c) | (~b & d)) + M[i]) | 0, SHIFT_ROUND1[i % 4])
      a = d
      d = c
      c = b
      b = next
    }
    for (let i = 0; i < 16; i++) {
      const next = rotl(
        (a + ((b & c) | (b & d) | (c & d)) + M[ORDER_ROUND2[i]] + 0x5a827999) | 0,
        SHIFT_ROUND2[i % 4]
      )
      a = d
      d = c
      c = b
      b = next
    }
    for (let i = 0; i < 16; i++) {
      const next = rotl(
        (a + (b ^ c ^ d) + M[ORDER_ROUND3[i]] + 0x6ed9eba1) | 0,
        SHIFT_ROUND3[i % 4]
      )
      a = d
      d = c
      c = b
      b = next
    }

    a0 = (a0 + a) | 0
    b0 = (b0 + b) | 0
    c0 = (c0 + c) | 0
    d0 = (d0 + d) | 0
  }

  return wordToHexLE(a0) + wordToHexLE(b0) + wordToHexLE(c0) + wordToHexLE(d0)
}

export function md4Hex(text: string): string {
  const bytes = Array.from(new TextEncoder().encode(text))
  return md4Bytes(bytes)
}
