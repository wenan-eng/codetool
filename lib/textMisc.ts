export function cssConvert(value: number, from: "px" | "rem" | "em" | "pt" | "%", to: "px" | "rem" | "em" | "pt" | "%", rootSize = 16, parentSize = 16): number {
  const toPx = (v: number): number => {
    switch (from) {
      case "px": return v
      case "rem": return v * rootSize
      case "em": return v * parentSize
      case "pt": return v * (96 / 72)
      case "%": return (v / 100) * parentSize
    }
  }
  const px = toPx(value)
  switch (to) {
    case "px": return px
    case "rem": return px / rootSize
    case "em": return px / parentSize
    case "pt": return px * (72 / 96)
    case "%": return (px / parentSize) * 100
  }
}

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz"

export function baseConvert(value: string, fromBase: number, toBase: number): string {
  if (!Number.isInteger(fromBase) || fromBase < 2 || fromBase > 36) throw new Error("进制须在 2-36 之间")
  if (!Number.isInteger(toBase) || toBase < 2 || toBase > 36) throw new Error("进制须在 2-36 之间")
  const cleaned = value.trim().toLowerCase().replace(/^0[xbo]/, "")
  if (!cleaned) throw new Error("输入为空")
  let decimal = BigInt(0)
  for (const ch of cleaned) {
    const d = DIGITS.indexOf(ch)
    if (d < 0 || d >= fromBase) throw new Error(`字符 ${ch} 不是 ${fromBase} 进制有效数字`)
    decimal = decimal * BigInt(fromBase) + BigInt(d)
  }
  if (decimal === BigInt(0)) return "0"
  let out = ""
  const b = BigInt(toBase)
  while (decimal > BigInt(0)) {
    out = DIGITS[Number(decimal % b)] + out
    decimal /= b
  }
  return out
}

const SHOE_SIZES: { cn: string; eu: string; usM: string; usW: string; uk: string; cm: string }[] = [
  { cn: "36", eu: "36", usM: "4", usW: "5.5", uk: "3.5", cm: "22.5" },
  { cn: "37", eu: "37", usM: "4.5", usW: "6", uk: "4", cm: "23" },
  { cn: "38", eu: "38", usM: "5.5", usW: "7", uk: "5", cm: "24" },
  { cn: "39", eu: "39", usM: "6.5", usW: "8", uk: "6", cm: "24.5" },
  { cn: "40", eu: "40", usM: "7", usW: "8.5", uk: "6.5", cm: "25" },
  { cn: "41", eu: "41", usM: "8", usW: "9.5", uk: "7.5", cm: "25.5" },
  { cn: "42", eu: "42", usM: "8.5", usW: "10", uk: "8", cm: "26" },
  { cn: "43", eu: "43", usM: "9.5", usW: "11", uk: "9", cm: "27" },
  { cn: "44", eu: "44", usM: "10", usW: "11.5", uk: "9.5", cm: "27.5" },
  { cn: "45", eu: "45", usM: "11", usW: "12.5", uk: "10.5", cm: "28.5" },
]

export function shoeConvert(input: string, fromKey: keyof typeof SHOE_SIZES[0]): string {
  const row = SHOE_SIZES.find(r => r[fromKey] === input.trim())
  return row ? row.cn : ""
}

export function shoeTable(): typeof SHOE_SIZES {
  return SHOE_SIZES
}

const UPPER_DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
const UPPER_UNITS = ["", "拾", "佰", "仟"]
const BIG_UNITS = ["", "万", "亿", "万亿"]

function fourDigitsUpper(n: number): string {
  let out = ""
  let zeroPending = false
  for (let i = 3; i >= 0; i--) {
    const d = Math.floor(n / 10 ** i) % 10
    if (d === 0) {
      if (out) zeroPending = true
    } else {
      if (zeroPending) { out += "零"; zeroPending = false }
      out += UPPER_DIGITS[d] + UPPER_UNITS[i]
    }
  }
  return out || "零"
}

export function rmbUpper(amount: number): string {
  if (Number.isNaN(amount) || amount < 0) throw new Error("请输入有效的非负金额")
  if (amount >= 1e16) throw new Error("金额超出支持范围")
  const yuan = Math.floor(amount)
  const jiaoFen = Math.round((amount - yuan) * 100)
  const jiao = Math.floor(jiaoFen / 10)
  const fen = jiaoFen % 10
  if (yuan === 0 && jiao === 0 && fen === 0) return "零元整"
  let intPart = ""
  if (yuan > 0) {
    const sections: number[] = []
    let n = yuan
    while (n > 0) {
      sections.push(n % 10000)
      n = Math.floor(n / 10000)
    }
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i] === 0) continue
      if (i < sections.length - 1 && sections[i] < 1000) intPart += "零"
      intPart += fourDigitsUpper(sections[i]) + (BIG_UNITS[i] || "")
    }
    intPart += "元"
  }
  let decPart = ""
  if (jiao === 0 && fen === 0) {
    decPart = "整"
  } else {
    if (jiao > 0) decPart += UPPER_DIGITS[jiao] + "角"
    else if (fen > 0 && yuan > 0) decPart += "零"
    if (fen > 0) decPart += UPPER_DIGITS[fen] + "分"
    else decPart += "整"
  }
  return intPart + decPart
}

const BLOOD_RULES: Record<string, string[]> = {
  "O+O": ["O"],
  "O+A": ["A", "O"],
  "O+B": ["B", "O"],
  "O+AB": ["A", "B"],
  "A+A": ["A", "O"],
  "A+B": ["A", "B", "AB", "O"],
  "A+AB": ["A", "B", "AB"],
  "B+B": ["B", "O"],
  "B+AB": ["A", "B", "AB"],
  "AB+AB": ["A", "B", "AB"],
}

export function bloodPossibilities(father: string, mother: string): string[] {
  const key1 = `${father}+${mother}`
  const key2 = `${mother}+${father}`
  return BLOOD_RULES[key1] ?? BLOOD_RULES[key2] ?? []
}
