const BASE52 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

export function decimalToBase52(num: number): string {
  if (num === 0) return "A"
  let n = num
  let result = ""
  while (n > 0) {
    result = BASE52[n % 52] + result
    n = Math.floor(n / 52)
  }
  return result
}
export function base52ToDecimal(str: string): number {
  if (!str) throw new Error("空输入")
  return str.split("").reduce((acc, char) => {
    const idx = BASE52.indexOf(char)
    if (idx === -1) throw new Error(`Base52非法字符: ${char}`)
    return acc * 52 + idx
  }, 0)
}

export function decimalToBase58(num: number): string {
  if (num === 0) return BASE58[0]
  let n = num
  let result = ""
  while (n > 0) {
    result = BASE58[n % 58] + result
    n = Math.floor(n / 58)
  }
  return result
}
export function base58ToDecimal(str: string): number {
  if (!str) throw new Error("空输入")
  return str.split("").reduce((acc, char) => {
    const idx = BASE58.indexOf(char)
    if (idx === -1) throw new Error(`Base58非法字符: ${char}`)
    return acc * 58 + idx
  }, 0)
}

export function decimalToBase62(num: number): string {
  if (num === 0) return BASE62[0]
  let n = num
  let result = ""
  while (n > 0) {
    result = BASE62[n % 62] + result
    n = Math.floor(n / 62)
  }
  return result
}
export function base62ToDecimal(str: string): number {
  if (!str) throw new Error("空输入")
  return str.split("").reduce((acc, char) => {
    const idx = BASE62.indexOf(char)
    if (idx === -1) throw new Error(`Base62非法字符: ${char}`)
    return acc * 62 + idx
  }, 0)
}

export function decimalToBase64(num: number): string {
  if (num === 0) return "AA"
  const bytes: number[] = []
  let n = num
  while (n > 0) {
    bytes.push(n & 255)
    n = Math.floor(n / 256)
  }
  bytes.reverse()
  const binary = String.fromCharCode(...bytes)
  // btoa works in browser and Node >=16 via Buffer
  const b64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64")
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
export function base64ToDecimal(str: string): number {
  if (!str) throw new Error("空输入")
  try {
    let s = str.replace(/-/g, "+").replace(/_/g, "/")
    while (s.length % 4) s += "="
    const binary = typeof atob !== "undefined" ? atob(s) : Buffer.from(s, "base64").toString("binary")
    let num = 0
    for (let i = 0; i < binary.length; i++) num = num * 256 + binary.charCodeAt(i)
    return num
  } catch {
    throw new Error("Base64非法")
  }
}

const VALID_BASES = [2, 8, 10, 16, 32, 36, 52, 58, 62, 64] as const
export type Base = typeof VALID_BASES[number]

function parseInput(input: string, fromBase: number): number {
  const trimmed = input.trim()
  if (!trimmed) throw new Error("请输入要转换的数值")
  if (!VALID_BASES.includes(fromBase as Base)) throw new Error("请选择有效的进制类型")
  let decimal: number
  switch (fromBase) {
    case 52: decimal = base52ToDecimal(trimmed); break
    case 58: decimal = base58ToDecimal(trimmed); break
    case 62: decimal = base62ToDecimal(trimmed); break
    case 64: decimal = base64ToDecimal(trimmed); break
    default: decimal = parseInt(trimmed, fromBase); break
  }
  if (isNaN(decimal) || decimal < 0) throw new Error(`输入的 "${trimmed}" 在 ${fromBase} 进制下不合法`)
  // 额外校验：重新编码回原始进制是否一致（防止 parseInt 容忍非法字符）
  // 对标准进制再做严格检查
  if ([2,8,10,16,32,36].includes(fromBase)) {
    const recon = decimal.toString(fromBase).toUpperCase()
    const normalized = trimmed.toUpperCase()
    // 允许前导零
    if (recon !== normalized.replace(/^0+/, "") && !(recon==="0" && /^0+$/.test(normalized))) {
      // 对 16/32/36 大小写不敏感已 Upper，再校验字符集
      const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, fromBase)
      for (const ch of normalized) {
        if (!validChars.includes(ch) && ch!=="-" && ch!=="+") throw new Error(`输入的 "${trimmed}" 在 ${fromBase} 进制下不合法`)
      }
    }
  }
  return decimal
}

export function convertAll(input: string, fromBase: number): Record<number, string> {
  const decimal = parseInput(input, fromBase)
  return {
    2: decimal.toString(2),
    8: decimal.toString(8),
    10: decimal.toString(10),
    16: decimal.toString(16).toUpperCase(),
    32: decimal.toString(32).toUpperCase(),
    36: decimal.toString(36).toUpperCase(),
    52: decimalToBase52(decimal),
    58: decimalToBase58(decimal),
    62: decimalToBase62(decimal),
    64: decimalToBase64(decimal),
  }
}

export const SUPPORTED_BASES = VALID_BASES
