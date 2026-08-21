const ZH_TO_EN: Record<string, string> = {
  "，": ",", "。": ".", "？": "?", "！": "!", "：": ":", "；": ";", "（": "(", "）": ")",
  "【": "[", "】": "]", "《": "<", "》": ">", "“": '"', "”": '"', "‘": "'", "’": "'",
  "、": ",", "—": "-", "～": "~", "￥": "$",
}
const EN_TO_ZH: Record<string, string> = Object.fromEntries(Object.entries(ZH_TO_EN).map(([k, v]) => [v, k]))
EN_TO_ZH[","] = "，"
EN_TO_ZH["."] = "。"
EN_TO_ZH["?"] = "？"
EN_TO_ZH["!"] = "！"
EN_TO_ZH[":"] = "："
EN_TO_ZH[";"] = "；"

const EMOJI_RE = /[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F1E6}-\u{1F1FF}]|[\u{2190}-\u{21FF}]|[\u{2B00}-\u{2BFF}]|[\u{E000}-\u{F8FF}]|\u{200D}|\u{20E3}/gu

export function toUpperCase(text: string): string {
  return text.toUpperCase()
}

export function toLowerCase(text: string): string {
  return text.toLowerCase()
}

export function convertSymbols(text: string, direction: "zh2en" | "en2zh"): string {
  const map = direction === "zh2en" ? ZH_TO_EN : EN_TO_ZH
  return text.replace(/./gu, ch => map[ch] ?? ch)
}

export function removeEmoji(text: string): string {
  return text.replace(EMOJI_RE, "").replace(/ {2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim()
}

export interface WordCountResult {
  totalChars: number
  charsNoSpaces: number
  chineseChars: number
  englishWords: number
  numbers: number
  punctuation: number
  lines: number
  bytesUtf8: number
}

export function countWords(text: string): WordCountResult {
  const totalChars = text.length
  const charsNoSpaces = text.replace(/\s/g, "").length
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = (text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []).length
  const numbers = (text.match(/[0-9]+(?:\.[0-9]+)?/g) || []).length
  const punctuation = (text.match(/[.,!?;:'"()\[\]{}<>\-—…、。，！？；：“”‘’（）【】《》]/g) || []).length
  const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length
  const bytesUtf8 = new TextEncoder().encode(text).length
  return { totalChars, charsNoSpaces, chineseChars, englishWords, numbers, punctuation, lines, bytesUtf8 }
}

export function literalNewlinesToReal(text: string): string {
  return text.replaceAll("\\r\\n", "\n").replaceAll("\\n", "\n").replaceAll("\\r", "\n")
}

export function realNewlinesToLiteral(text: string): string {
  return text.replace(/\r\n|\r|\n/g, "\\n")
}

export function replaceAll(text: string, search: string, replacement: string, useRegex = false): { result: string; count: number } {
  if (!search) return { result: text, count: 0 }
  let count = 0
  let result: string
  if (useRegex) {
    try {
      const re = new RegExp(search, "g")
      result = text.replace(re, () => { count++; return replacement })
    } catch {
      throw new Error("正则表达式无效")
    }
  } else {
    result = text.split(search).join(replacement)
    count = text.split(search).length - 1
  }
  return { result, count }
}

export function splitText(text: string, delimiter: string, joiner = ","): string {
  const parts = delimiter ? text.split(delimiter) : text.split(/\r\n|\r|\n/)
  return parts.map(p => p.trim()).filter(Boolean).join(joiner)
}
