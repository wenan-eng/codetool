const PC1 = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4,
]

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

const PC2 = [
  14, 17, 11, 24, 1, 5,
  3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8,
  16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32,
]

const IP = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
]

const FP = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25,
]

const E = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1,
]

const P = [
  16, 7, 20, 21,
  29, 12, 28, 17,
  1, 15, 23, 26,
  5, 18, 31, 10,
  2, 8, 24, 14,
  32, 27, 3, 9,
  19, 13, 30, 6,
  22, 11, 4, 25,
]

const SBOX = [
  [
    14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
    0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
    4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
    15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13,
  ],
  [
    15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
    3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
    0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
    13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9,
  ],
  [
    10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
    13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
    13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
    1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12,
  ],
  [
    7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
    13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
    10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
    3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14,
  ],
  [
    2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
    14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
    4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
    11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3,
  ],
  [
    12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
    10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
    9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
    4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13,
  ],
  [
    4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
    13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
    1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
    6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12,
  ],
  [
    13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
    1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
    7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
    2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11,
  ],
]

function bytesToBits(bytes: Uint8Array): number[] {
  const bits: number[] = new Array(bytes.length * 8)
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < 8; j++) {
      bits[i * 8 + j] = (bytes[i] >> (7 - j)) & 1
    }
  }
  return bits
}

function bitsToBytes(bits: number[]): Uint8Array {
  const bytes = new Uint8Array(bits.length / 8)
  for (let i = 0; i < bytes.length; i++) {
    let b = 0
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j]
    }
    bytes[i] = b
  }
  return bytes
}

function permute(bits: number[], table: number[]): number[] {
  const out: number[] = new Array(table.length)
  for (let i = 0; i < table.length; i++) {
    out[i] = bits[table[i] - 1]
  }
  return out
}

function rotateLeft(bits: number[], n: number): number[] {
  return bits.slice(n).concat(bits.slice(0, n))
}

function buildSubKeys(keyBytes: Uint8Array): number[][] {
  const keyBits = bytesToBits(keyBytes)
  const pc1 = permute(keyBits, PC1)
  let c = pc1.slice(0, 28)
  let d = pc1.slice(28)
  const subKeys: number[][] = []
  for (let round = 0; round < 16; round++) {
    c = rotateLeft(c, SHIFTS[round])
    d = rotateLeft(d, SHIFTS[round])
    subKeys.push(permute(c.concat(d), PC2))
  }
  return subKeys
}

function feistel(right: number[], subKey: number[]): number[] {
  const expanded = permute(right, E)
  const xored: number[] = new Array(48)
  for (let i = 0; i < 48; i++) {
    xored[i] = expanded[i] ^ subKey[i]
  }
  const sOut: number[] = new Array(32)
  for (let box = 0; box < 8; box++) {
    const b = xored.slice(box * 6, box * 6 + 6)
    const row = (b[0] << 1) | b[5]
    const col = (b[1] << 3) | (b[2] << 2) | (b[3] << 1) | b[4]
    const val = SBOX[box][row * 16 + col]
    sOut[box * 4] = (val >> 3) & 1
    sOut[box * 4 + 1] = (val >> 2) & 1
    sOut[box * 4 + 2] = (val >> 1) & 1
    sOut[box * 4 + 3] = val & 1
  }
  return permute(sOut, P)
}

function xorBlocks(a: number[], b: number[]): number[] {
  const out: number[] = new Array(a.length)
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] ^ b[i]
  }
  return out
}

function processBlock(blockBits: number[], subKeys: number[][]): number[] {
  const permuted = permute(blockBits, IP)
  let left = permuted.slice(0, 32)
  let right = permuted.slice(32)
  for (let round = 0; round < 16; round++) {
    const nextRight = xorBlocks(left, feistel(right, subKeys[round]))
    left = right
    right = nextRight
  }
  return permute(right.concat(left), FP)
}

export type DesMode = "CBC" | "ECB"

export function desEncryptRaw(
  data: Uint8Array,
  key: Uint8Array,
  mode: DesMode,
  iv?: Uint8Array
): Uint8Array {
  if (key.length !== 8) {
    throw new Error("DES密钥必须为8字节（64位，含奇偶校验位）")
  }
  if (mode === "CBC" && (!iv || iv.length !== 8)) {
    throw new Error("CBC模式需要8字节的IV")
  }
  const padLen = 8 - (data.length % 8)
  const padded = new Uint8Array(data.length + padLen)
  padded.set(data, 0)
  padded.fill(padLen, data.length)
  const subKeys = buildSubKeys(key)
  const ivBits = mode === "CBC" ? bytesToBits(iv as Uint8Array) : null
  const output = new Uint8Array(padded.length)
  let prevBits = ivBits
  for (let offset = 0; offset < padded.length; offset += 8) {
    let blockBits = bytesToBits(padded.subarray(offset, offset + 8))
    if (mode === "CBC") {
      blockBits = xorBlocks(blockBits, prevBits as number[])
    }
    const cipherBits = processBlock(blockBits, subKeys)
    const cipherBytes = bitsToBytes(cipherBits)
    output.set(cipherBytes, offset)
    prevBits = cipherBits
  }
  return output
}

export function desDecryptRaw(
  data: Uint8Array,
  key: Uint8Array,
  mode: DesMode,
  iv?: Uint8Array
): Uint8Array {
  if (key.length !== 8) {
    throw new Error("DES密钥必须为8字节（64位，含奇偶校验位）")
  }
  if (mode === "CBC" && (!iv || iv.length !== 8)) {
    throw new Error("CBC模式需要8字节的IV")
  }
  if (data.length === 0 || data.length % 8 !== 0) {
    throw new Error("密文长度无效：DES密文必须是8字节的整数倍，请检查密文是否完整")
  }
  const subKeys = buildSubKeys(key).reverse()
  const ivBits = mode === "CBC" ? bytesToBits(iv as Uint8Array) : null
  const output = new Uint8Array(data.length)
  let prevCipherBits = ivBits
  for (let offset = 0; offset < data.length; offset += 8) {
    const blockBits = bytesToBits(data.subarray(offset, offset + 8))
    let plainBits = processBlock(blockBits, subKeys)
    if (mode === "CBC") {
      plainBits = xorBlocks(plainBits, prevCipherBits as number[])
      prevCipherBits = blockBits
    }
    output.set(bitsToBytes(plainBits), offset)
  }
  const padLen = output[output.length - 1]
  if (padLen < 1 || padLen > 8) {
    throw new Error("解密失败：填充无效，密钥不正确或密文已损坏")
  }
  for (let i = output.length - padLen; i < output.length; i++) {
    if (output[i] !== padLen) {
      throw new Error("解密失败：填充无效，密钥不正确或密文已损坏")
    }
  }
  return output.slice(0, output.length - padLen)
}

function base64ToBytes(b64: string): Uint8Array {
  const trimmed = b64.trim()
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) || trimmed.length % 4 !== 0) {
    throw new Error("密文不是有效的Base64字符串")
  }
  const binary = atob(trimmed)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function parseKey(keyText: string): Uint8Array {
  if (!keyText) {
    throw new Error("密钥不能为空")
  }
  const bytes = new TextEncoder().encode(keyText)
  if (bytes.length !== 8) {
    throw new Error(`密钥必须为8个字符（当前为${bytes.length}个字符）`)
  }
  return bytes
}

function parseIvHex(ivHex: string | undefined): Uint8Array {
  if (!ivHex || !ivHex.trim()) {
    throw new Error("CBC模式需要IV：请输入16位十六进制IV或点击生成随机IV")
  }
  const hex = ivHex.trim()
  if (!/^[0-9a-fA-F]{16}$/.test(hex)) {
    throw new Error("IV格式错误：必须是16位十六进制字符（8字节）")
  }
  const bytes = new Uint8Array(8)
  for (let i = 0; i < 8; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export function randomDesIvHex(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  let hex = ""
  for (let i = 0; i < 8; i++) {
    hex += bytes[i].toString(16).padStart(2, "0")
  }
  return hex
}

export function desEncryptText(
  text: string,
  keyText: string,
  mode: DesMode,
  ivHex?: string
): string {
  const data = new TextEncoder().encode(text)
  const key = parseKey(keyText)
  const iv = mode === "CBC" ? parseIvHex(ivHex) : undefined
  return bytesToBase64(desEncryptRaw(data, key, mode, iv))
}

export function desDecryptText(
  cipherBase64: string,
  keyText: string,
  mode: DesMode,
  ivHex?: string
): string {
  const data = base64ToBytes(cipherBase64)
  const key = parseKey(keyText)
  const iv = mode === "CBC" ? parseIvHex(ivHex) : undefined
  const plain = desDecryptRaw(data, key, mode, iv)
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(plain)
  } catch {
    throw new Error("解密结果不是有效的UTF-8文本，密钥或数据可能不正确")
  }
}
