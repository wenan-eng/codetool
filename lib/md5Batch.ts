import { md5Hex } from "./md5"

export type Md5BatchOptions = {
  length?: 16 | 32
  uppercase?: boolean
}

export function splitLines(input: string): string[] {
  return input.split(/\r?\n/)
}

export function md5HashLine(line: string, options: Md5BatchOptions = {}): string {
  const { length = 32, uppercase = false } = options
  const full = md5Hex(line)
  const value = length === 16 ? full.slice(8, 24) : full
  return uppercase ? value.toUpperCase() : value
}

export function md5BatchHashLines(input: string, options: Md5BatchOptions = {}): string[] {
  return splitLines(input).map((line) => md5HashLine(line, options))
}

export function md5BatchFormatLines(input: string, options: Md5BatchOptions = {}): string[] {
  return splitLines(input).map((line) => `${line} → ${md5HashLine(line, options)}`)
}
