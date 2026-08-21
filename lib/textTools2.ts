export function extractMobiles(text: string): string[] {
  const matches = text.match(/(?<!\d)1[3-9]\d{9}(?!\d)/g) || []
  return [...new Set(matches)]
}

export function extractEmails(text: string): string[] {
  const matches = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []
  return [...new Set(matches.map(m => m.toLowerCase()))]
}

const URL_STOP_CHARS = "\\s<>\"'()\\[\\]{}\\uFF08\\uFF09\\u3010\\u3011\\uFF0C\\u3002\\uFF1B\\uFF01\\uFF1F\\u3001"

export function extractUrls(text: string): string[] {
  const re = new RegExp(`https?:\\/\\/[^${URL_STOP_CHARS}]+|www\\.[^${URL_STOP_CHARS}]+`, "gi")
  const matches = text.match(re) || []
  const normalized = matches.map(u => (u.toLowerCase().startsWith("www.") ? `https://${u}` : u))
  return [...new Set(normalized)]
}

export interface BirthdayRow {
  id: string
  birthday: string
}

export function extractBirthdays(text: string): BirthdayRow[] {
  const ids = text.match(/(?<!\d)\d{15}(?!\d)|(?<!\d)\d{17}[\dXx](?!\d)/g) || []
  const rows: BirthdayRow[] = []
  for (const id of ids) {
    let birth = ""
    if (id.length === 18) birth = `${id.slice(6, 10)}-${id.slice(10, 12)}-${id.slice(12, 14)}`
    else if (id.length === 15) birth = `19${id.slice(6, 8)}-${id.slice(8, 10)}-${id.slice(10, 12)}`
    if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) rows.push({ id, birthday: birth })
  }
  return rows
}

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const CHECK_CODES = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]

export function validateIdcard(id: string): boolean {
  if (!/^\d{17}[\dXx]$/.test(id)) return false
  const sum = WEIGHTS.reduce((acc, w, i) => acc + w * Number(id[i]), 0)
  return CHECK_CODES[sum % 11] === id[17].toUpperCase()
}

export interface IdcardInfo {
  id: string
  valid: boolean
  birthday: string
  gender: "男" | "女"
  age: number
}

export function parseIdcard(id: string): IdcardInfo {
  const valid = validateIdcard(id)
  const birth = id.length === 18 ? `${id.slice(6, 10)}-${id.slice(10, 12)}-${id.slice(12, 14)}` : `19${id.slice(6, 8)}-${id.slice(8, 10)}-${id.slice(10, 12)}`
  const genderCode = Number(id[id.length === 18 ? 16 : 14])
  const gender: "男" | "女" = genderCode % 2 === 1 ? "男" : "女"
  const birthDate = new Date(birth)
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  const m = now.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--
  return { id, valid, birthday: birth, gender, age: Math.max(age, 0) }
}

export interface ParsedUrl {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
  params: [string, string][]
}

export function parseUrl(input: string): ParsedUrl {
  const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(input.trim()) ? input.trim() : `https://${input.trim()}`
  const url = new URL(withProtocol)
  const params: [string, string][] = []
  url.searchParams.forEach((v, k) => params.push([k, v]))
  return {
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    port: url.port || (url.protocol === "https:" ? "443" : "80"),
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
    params,
  }
}

export type ExtractKind = "mobile" | "email" | "url" | "number" | "chinese" | "english"

export function extractByKind(text: string, kind: ExtractKind): string[] {
  const patterns: Record<ExtractKind, RegExp> = {
    mobile: /(?<!\d)1[3-9]\d{9}(?!\d)/g,
    email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    url: /https?:\/\/[^\s<>"']+/g,
    number: /\d+(?:\.\d+)?/g,
    chinese: /[\u4e00-\u9fff]+/g,
    english: /[A-Za-z]+/g,
  }
  const matches = text.match(patterns[kind]) || []
  return [...new Set(matches)]
}
