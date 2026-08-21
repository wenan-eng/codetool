import { base64EncodeText, base64DecodeText } from "./base64TextCodec"

export interface BulkLineResult {
  index: number
  source: string
  ok: boolean
  value: string
}

function convertLines(text: string, convert: (line: string) => string): BulkLineResult[] {
  return text.split("\n").map((rawLine, index) => {
    const source = rawLine.replace(/\r$/, "")
    try {
      return { index, source, ok: true, value: convert(source) }
    } catch (error) {
      return {
        index,
        source,
        ok: false,
        value: error instanceof Error ? error.message : String(error),
      }
    }
  })
}

export function base64BulkEncode(text: string): BulkLineResult[] {
  return convertLines(text, base64EncodeText)
}

export function base64BulkDecode(text: string): BulkLineResult[] {
  return convertLines(text, base64DecodeText)
}

export function formatBulkResults(results: BulkLineResult[]): string {
  return results.map((r) => `${r.source} → ${r.value}`).join("\n")
}
