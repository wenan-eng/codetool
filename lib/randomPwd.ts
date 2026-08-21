export interface PwdOptions {
  count?: number
  minLength?: number
  maxLength?: number
  uppercase?: boolean
  lowercase?: boolean
  digits?: boolean
  symbols?: boolean
  customChars?: string
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const DIGITS = "0123456789"
const SYMBOLS = "!@#$%^&*"

export function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0
  const rangeSize = Math.floor(0x100000000 / maxExclusive) * maxExclusive
  const buf = new Uint32Array(1)
  let value: number
  do {
    crypto.getRandomValues(buf)
    value = buf[0]
  } while (value >= rangeSize)
  return value % maxExclusive
}

function shuffle(chars: string[]): string[] {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars
}

export function generatePasswords(options: PwdOptions = {}): string[] {
  const groups: string[] = []
  if (options.uppercase !== false) groups.push(UPPER)
  if (options.lowercase !== false) groups.push(LOWER)
  if (options.digits !== false) groups.push(DIGITS)
  if (options.symbols !== false) groups.push(SYMBOLS)
  const custom = options.customChars || ""
  const allChars = groups.join("") + custom
  if (!allChars) throw new Error("请至少选择一种字符类型或填写自定义字符集")
  const count = Math.min(Math.max(Math.floor(options.count ?? 5), 1), 100)
  let min = Math.floor(options.minLength ?? 8)
  let max = Math.floor(options.maxLength ?? 16)
  if (min > max) [min, max] = [max, min]
  min = Math.max(min, 1)
  max = Math.min(max, 1024)
  const passwords: string[] = []
  for (let n = 0; n < count; n++) {
    const length = min + randomInt(max - min + 1)
    const chars: string[] = []
    const required = length >= groups.length ? groups : []
    for (const group of required) {
      chars.push(group[randomInt(group.length)])
    }
    while (chars.length < length) {
      chars.push(allChars[randomInt(allChars.length)])
    }
    passwords.push(shuffle(chars).join(""))
  }
  return passwords
}
