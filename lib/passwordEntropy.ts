export interface EntropyResult {
  length: number
  poolSize: number
  entropyBits: number
  combinations: string
  strength: string
}

const LOWER_RE = /[a-z]/
const UPPER_RE = /[A-Z]/
const DIGIT_RE = /[0-9]/
const ASCII_PRINTABLE_RE = /[\x20-\x7e]/

export function strengthLabel(bits: number): string {
  if (bits < 28) return "弱"
  if (bits < 36) return "一般"
  if (bits < 60) return "强"
  if (bits < 128) return "很强"
  return "极强"
}

export function calculateEntropy(password: string): EntropyResult {
  const text = password ?? ""
  const length = Array.from(text).length
  if (length === 0) {
    return { length: 0, poolSize: 0, entropyBits: 0, combinations: "0", strength: "弱" }
  }
  let poolSize = 0
  if (LOWER_RE.test(text)) poolSize += 26
  if (UPPER_RE.test(text)) poolSize += 26
  if (DIGIT_RE.test(text)) poolSize += 10
  if (Array.from(text).some((c) => ASCII_PRINTABLE_RE.test(c) && !LOWER_RE.test(c) && !UPPER_RE.test(c) && !DIGIT_RE.test(c))) {
    poolSize += 33
  }
  const others = new Set<string>()
  for (const c of Array.from(text)) {
    if (!ASCII_PRINTABLE_RE.test(c)) others.add(c)
  }
  poolSize += others.size
  const entropyBits = length * Math.log2(poolSize)
  const combinationsValue = Math.pow(2, entropyBits)
  return {
    length,
    poolSize,
    entropyBits,
    combinations: combinationsValue.toExponential(2),
    strength: strengthLabel(entropyBits),
  }
}
