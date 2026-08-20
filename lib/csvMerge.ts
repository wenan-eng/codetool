/**
 * csv-merge — 合并多个 CSV，处理表头去重与列对齐
 * 支持引号包裹、逗号转义、不同表头合并为并集
 */

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(cur)
        cur = ""
      } else {
        cur += ch
      }
    }
  }
  fields.push(cur)
  return fields
}

function escapeCsvValue(v: any): string {
  if (v === null || v === undefined) return ""
  let s = String(v)
  if (s.includes('"')) s = s.replace(/"/g, '""')
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s}"`
  }
  return s
}

function parseCsvContent(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const rawLines = content.split(/\r?\n/)
  // 过滤空行但保留含逗号的空字段行? 简单过滤完全空行
  const lines = rawLines.filter(l => l.trim() !== "")
  if (lines.length === 0) return { headers: [], rows: [] }
  const headers = parseCsvLine(lines[0]).map(h => h.trim())
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i])
    // 跳过空行（字段全空且 headers 多于 1）
    if (fields.length === 1 && fields[0] === "" && headers.length > 1) continue
    const obj: Record<string, string> = {}
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j]
      const val = fields[j] ?? ""
      obj[key] = val
    }
    // 若字段多于 headers，忽略多余
    rows.push(obj)
  }
  return { headers, rows }
}

export interface CsvMergeOptions {
  dedupHeaders?: boolean // 默认 true，去重表头
}

export function csvMerge(csvContents: string[], options?: CsvMergeOptions): string {
  if (!csvContents || csvContents.length === 0) return ""
  // dedupHeaders 默认 true，暂时保留参数但行为一致（合并表头并集）
  void options

  const allParsed = csvContents
    .map(c => (c && c.trim() ? parseCsvContent(c) : { headers: [] as string[], rows: [] as Record<string, string>[] }))
    .filter(p => p.headers.length > 0)

  if (allParsed.length === 0) return ""

  // 合并表头：按首次出现顺序的并集
  const mergedHeaders: string[] = []
  const headerSet = new Set<string>()
  for (const p of allParsed) {
    for (const h of p.headers) {
      if (!headerSet.has(h)) {
        headerSet.add(h)
        mergedHeaders.push(h)
      }
    }
  }

  // 合并所有行，按 mergedHeaders 对齐
  const mergedRows: string[][] = []
  for (const p of allParsed) {
    for (const row of p.rows) {
      const aligned = mergedHeaders.map(h => row[h] ?? "")
      mergedRows.push(aligned)
    }
  }

  const lines: string[] = []
  lines.push(mergedHeaders.map(escapeCsvValue).join(","))
  for (const row of mergedRows) {
    lines.push(row.map(escapeCsvValue).join(","))
  }
  return lines.join("\n")
}

// 别名
export const mergeCsv = csvMerge
export const mergeCSVs = csvMerge
export default csvMerge
