/**
 * dataConvert2 — JSON/SQL/Cookie/Base64/Excel(XML) 互转纯函数
 * 覆盖 8 个工具：json-sql, sql-json, json-cookie, cookie-json, json-base64, xml-base64, json-excel, excel-json
 * 全部本地处理，无外部依赖，兼容浏览器与 Node (Vitest)
 */

// ---------- Base64 helpers (UTF-8 safe) ----------
function base64Encode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64")
  }
  // browser fallback: btoa + encodeURIComponent trick
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch {
    return btoa(str)
  }
}

function base64Decode(b64: string): string {
  const trimmed = b64.trim()
  if (!trimmed) throw new Error("请输入 Base64 内容")
  // basic validation
  if (!/^[A-Za-z0-9+/=\-\s_]+$/.test(trimmed.replace(/\s/g, ""))) {
    // allow url-safe but basic
  }
  let normalized = trimmed.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/")
  while (normalized.length % 4) normalized += "="
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(normalized, "base64").toString("utf-8")
    }
    return decodeURIComponent(escape(atob(normalized)))
  } catch (e: any) {
    throw new Error("Base64解码失败: " + (e.message || "非法Base64"))
  }
}

// ---------- SQL helpers ----------
function escapeSqlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`
}
function formatSqlValue(v: any): string {
  if (v === null || v === undefined) return "NULL"
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return "NULL"
    return String(v)
  }
  if (typeof v === "boolean") return v ? "1" : "0"
  if (typeof v === "object") {
    return escapeSqlString(JSON.stringify(v))
  }
  return escapeSqlString(String(v))
}
function escapeIdentifier(id: string): string {
  return "`" + id.replace(/`/g, "``") + "`"
}

// ---------- JSON ↔ SQL ----------
export function jsonToSql(jsonStr: string, tableName: string = "table_name"): string {
  if (!jsonStr || !jsonStr.trim()) throw new Error("请输入 JSON 内容")
  if (!tableName || !tableName.trim()) tableName = "table_name"
  const cleanTable = tableName.trim().replace(/^[`"\[]|[`"\]]$/g, "").replace(/`/g, "")
  let parsed: any
  try {
    parsed = JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error("JSON解析失败: " + e.message)
  }
  let arr: Record<string, any>[]
  if (Array.isArray(parsed)) {
    arr = parsed
  } else if (parsed !== null && typeof parsed === "object") {
    arr = [parsed]
  } else {
    throw new Error("JSON 需为对象或对象数组")
  }
  if (arr.length === 0) throw new Error("JSON数组为空，无可转换数据")
  // validate each is object
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null || typeof arr[i] !== "object" || Array.isArray(arr[i])) {
      throw new Error(`第 ${i + 1} 项不是对象`)
    }
  }
  // union columns order by first appearance
  const cols: string[] = []
  const seen = new Set<string>()
  for (const obj of arr) {
    for (const k of Object.keys(obj)) {
      if (!seen.has(k)) {
        seen.add(k)
        cols.push(k)
      }
    }
  }
  if (cols.length === 0) throw new Error("未找到任何列")
  const header = `INSERT INTO ${escapeIdentifier(cleanTable)} (${cols.map(escapeIdentifier).join(", ")}) VALUES`
  const rows = arr.map((obj) => {
    const vals = cols.map((c) => formatSqlValue(obj[c]))
    return `(${vals.join(", ")})`
  })
  return header + "\n" + rows.join(",\n") + ";"
}

function splitSqlColumns(colPart: string): string[] {
  return colPart
    .split(",")
    .map((s) => s.trim().replace(/^["`'\[]|["`'\]]$/g, "").trim())
    .filter(Boolean)
    .map((s) => s.replace(/^`|`$/g, "").replace(/^"|"$/g, ""))
}

function parseSqlValue(raw: string): any {
  const t = raw.trim()
  if (/^NULL$/i.test(t)) return null
  if (/^TRUE$/i.test(t)) return true
  if (/^FALSE$/i.test(t)) return false
  // quoted string
  if (t.length >= 2 && t[0] === "'" && t[t.length - 1] === "'") {
    const inner = t.slice(1, -1).replace(/''/g, "'")
    return inner
  }
  if (t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"') {
    return t.slice(1, -1).replace(/""/g, '"')
  }
  // numeric
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const n = Number(t)
    if (!Number.isNaN(n)) return n
  }
  return t
}

// parse VALUES tuples: extract (...) groups at top level
function extractValueTuples(valuesPart: string): string[] {
  const tuples: string[] = []
  let i = 0
  const n = valuesPart.length
  while (i < n) {
    // skip whitespace, commas
    while (i < n && /[\s,]/.test(valuesPart[i])) i++
    if (i >= n) break
    if (valuesPart[i] !== "(") {
      // unexpected, skip to next paren
      i++
      continue
    }
    let depth = 0
    let inStr = false
    let start = i
    while (i < n) {
      const ch = valuesPart[i]
      if (inStr) {
        if (ch === "'") {
          if (valuesPart[i + 1] === "'") {
            i += 2
            continue
          } else {
            inStr = false
            i++
            continue
          }
        } else {
          i++
          continue
        }
      } else {
        if (ch === "'") {
          inStr = true
          i++
          continue
        }
        if (ch === "(") depth++
        else if (ch === ")") {
          depth--
          if (depth === 0) {
            i++
            tuples.push(valuesPart.slice(start, i))
            break
          }
        }
        i++
      }
    }
  }
  return tuples
}

function splitTupleValues(tuple: string): string[] {
  // tuple like "(1, 'a', NULL)"
  const inner = tuple.trim().slice(1, -1) // remove outer ()
  const vals: string[] = []
  let cur = ""
  let inStr = false
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (inStr) {
      cur += ch
      if (ch === "'") {
        if (inner[i + 1] === "'") {
          cur += "'"
          i++
        } else {
          inStr = false
        }
      }
    } else {
      if (ch === "'") {
        inStr = true
        cur += ch
      } else if (ch === ",") {
        vals.push(cur.trim())
        cur = ""
      } else {
        cur += ch
      }
    }
  }
  if (cur.trim() !== "" || vals.length > 0) vals.push(cur.trim())
  // handle empty tuple?
  if (vals.length === 1 && vals[0] === "") return []
  return vals
}

export function sqlToJson(sqlStr: string): string {
  if (!sqlStr || !sqlStr.trim()) throw new Error("请输入 SQL 内容")
  const statements = sqlStr
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
  if (statements.length === 0) throw new Error("未找到 SQL 语句")

  const allRows: Record<string, any>[] = []

  for (const stmt of statements) {
    const upper = stmt.toUpperCase()
    if (!upper.includes("INSERT INTO")) {
      throw new Error(`不支持的语句，仅支持 INSERT: ${stmt.slice(0, 60)}`)
    }
    // Regex to extract table, columns, values part
    const m = stmt.match(/INSERT\s+INTO\s+(?:`([^`]+)`|"([^"]+)"|\[([^\]]+)\]|(\S+))\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+)/i)
    if (!m) throw new Error("SQL解析失败，无法提取表名/列/值: " + stmt.slice(0, 80))
    const colsPart = m[5]
    const valuesPart = m[6]
    const cols = splitSqlColumns(colsPart)
    if (cols.length === 0) throw new Error("未找到列名")
    const tuples = extractValueTuples(valuesPart)
    if (tuples.length === 0) throw new Error("未找到 VALUES 数据")
    for (const tup of tuples) {
      const rawVals = splitTupleValues(tup)
      if (rawVals.length !== cols.length) {
        throw new Error(`列数(${cols.length})与值数(${rawVals.length})不一致: ${tup}`)
      }
      const obj: Record<string, any> = {}
      for (let i = 0; i < cols.length; i++) {
        obj[cols[i]] = parseSqlValue(rawVals[i])
      }
      allRows.push(obj)
    }
  }

  return JSON.stringify(allRows, null, 2)
}

// ---------- JSON ↔ Cookie ----------
export function jsonToCookie(jsonStr: string): string {
  if (!jsonStr || !jsonStr.trim()) throw new Error("请输入 JSON 内容")
  let parsed: any
  try {
    parsed = JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error("JSON解析失败: " + e.message)
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Cookie JSON 需为扁平对象，如 {\"a\":\"1\",\"b\":\"2\"}")
  }
  const parts: string[] = []
  for (const [k, v] of Object.entries(parsed)) {
    let valStr: string
    if (v === null || v === undefined) valStr = ""
    else if (typeof v === "object") valStr = JSON.stringify(v)
    else valStr = String(v)
    const ek = encodeURIComponent(k)
    const ev = encodeURIComponent(valStr)
    parts.push(`${ek}=${ev}`)
  }
  if (parts.length === 0) throw new Error("对象为空，无可转 Cookie")
  return parts.join("; ")
}

export function cookieToJson(cookieStr: string): string {
  if (!cookieStr || !cookieStr.trim()) throw new Error("请输入 Cookie 字符串")
  const obj: Record<string, string> = {}
  const pairs = cookieStr.split(";")
  let count = 0
  for (let part of pairs) {
    part = part.trim()
    if (!part) continue
    const eqIdx = part.indexOf("=")
    if (eqIdx === -1) {
      // key without value -> treat as key with empty
      const k = part.trim()
      if (!k) continue
      try {
        obj[decodeURIComponent(k)] = ""
      } catch {
        obj[k] = ""
      }
      count++
      continue
    }
    const rawK = part.slice(0, eqIdx).trim()
    const rawV = part.slice(eqIdx + 1).trim()
    let k: string
    let v: string
    try {
      k = decodeURIComponent(rawK)
    } catch {
      k = rawK
    }
    try {
      v = decodeURIComponent(rawV)
    } catch {
      v = rawV
    }
    if (!k) continue
    obj[k] = v
    count++
  }
  if (count === 0) throw new Error("未解析到任何 Cookie 键值对")
  return JSON.stringify(obj, null, 2)
}

// ---------- JSON / XML ↔ Base64 ----------
export function jsonToBase64(jsonStr: string): string {
  if (!jsonStr || !jsonStr.trim()) throw new Error("请输入 JSON 内容")
  try {
    JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error("JSON解析失败: " + e.message)
  }
  return base64Encode(jsonStr)
}

export function base64ToJson(b64Str: string): string {
  if (!b64Str || !b64Str.trim()) throw new Error("请输入 Base64 内容")
  const decoded = base64Decode(b64Str)
  try {
    const parsed = JSON.parse(decoded)
    return JSON.stringify(parsed, null, 2)
  } catch {
    // if decoded is not JSON, throw with decoded preview
    throw new Error("Base64解码后不是合法 JSON")
  }
}

// generic string base64
export function stringToBase64(str: string): string {
  if (!str) return ""
  return base64Encode(str)
}
export function base64ToString(b64: string): string {
  return base64Decode(b64)
}

export function xmlToBase64(xmlStr: string): string {
  if (!xmlStr || !xmlStr.trim()) throw new Error("请输入 XML 内容")
  // very light XML validation: must contain < and >
  if (!xmlStr.includes("<") || !xmlStr.includes(">")) throw new Error("内容不像 XML，需包含 < > 标签")
  return base64Encode(xmlStr)
}

export function base64ToXml(b64Str: string): string {
  if (!b64Str || !b64Str.trim()) throw new Error("请输入 Base64 内容")
  const decoded = base64Decode(b64Str)
  if (!decoded.includes("<") || !decoded.includes(">")) {
    // still return but warn? we return as is
  }
  return decoded
}

// ---------- JSON ↔ Excel (CSV) ----------
function csvEscape(field: string): string {
  if (field.includes('"') || field.includes(",") || field.includes("\n") || field.includes("\r")) {
    return '"' + field.replace(/"/g, '""') + '"'
  }
  return field
}

export function jsonToExcel(jsonStr: string): string {
  if (!jsonStr || !jsonStr.trim()) throw new Error("请输入 JSON 内容")
  let parsed: any
  try {
    parsed = JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error("JSON解析失败: " + e.message)
  }
  let arr: Record<string, any>[]
  if (Array.isArray(parsed)) {
    arr = parsed
  } else if (parsed !== null && typeof parsed === "object") {
    arr = [parsed]
  } else {
    throw new Error("JSON 需为对象或对象数组")
  }
  if (arr.length === 0) throw new Error("JSON数组为空")
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null || typeof arr[i] !== "object" || Array.isArray(arr[i])) {
      throw new Error(`第 ${i + 1} 项不是对象`)
    }
  }
  const cols: string[] = []
  const seen = new Set<string>()
  for (const obj of arr) {
    for (const k of Object.keys(obj)) {
      if (!seen.has(k)) {
        seen.add(k)
        cols.push(k)
      }
    }
  }
  const rows: string[] = []
  rows.push(cols.map(csvEscape).join(","))
  for (const obj of arr) {
    const fields = cols.map((c) => {
      const v = obj[c]
      let s: string
      if (v === null || v === undefined) s = ""
      else if (typeof v === "object") s = JSON.stringify(v)
      else s = String(v)
      return csvEscape(s)
    })
    rows.push(fields.join(","))
  }
  return rows.join("\n")
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let curRow: string[] = []
  let curField = ""
  let inQuotes = false
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i]
    if (inQuotes) {
      if (ch === '"') {
        if (csv[i + 1] === '"') {
          curField += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        curField += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ",") {
        curRow.push(curField)
        curField = ""
      } else if (ch === "\r") {
        if (csv[i + 1] === "\n") i++
        curRow.push(curField)
        rows.push(curRow)
        curRow = []
        curField = ""
      } else if (ch === "\n") {
        curRow.push(curField)
        rows.push(curRow)
        curRow = []
        curField = ""
      } else {
        curField += ch
      }
    }
  }
  // push last field/row
  curRow.push(curField)
  // avoid pushing empty trailing row if csv ends with newline and last row all empty?
  // check if curRow is single empty field and rows already have content and csv ends with newline?
  // Simpler: if curRow length 1 and curRow[0]==="" and rows.length>0 and csv.endsWith("\n")) don't push?
  // But we still want to keep legitimate empty row. We'll push unless it's single empty and original ends with newline? 
  // For our usage, final push is correct if not all empty trailing.
  const hasContent = curRow.some((f) => f !== "" )
  if (hasContent || curRow.length > 1) {
    rows.push(curRow)
  } else if (curRow.length === 1 && curRow[0] === "" ) {
    // if csv is empty or ends with newline, ignore last empty
    if (rows.length === 0) rows.push(curRow)
  } else {
    rows.push(curRow)
  }
  // Filter out completely empty rows at end that are artifacts
  while (rows.length > 1 && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    // check if previous row also? Actually trailing newline creates empty field, remove it
    rows.pop()
    break
  }
  return rows
}

function coerceCsvValue(s: string): any {
  if (s === "") return ""
  // try numeric
  if (/^-?\d+$/.test(s)) {
    const n = Number(s)
    if (Number.isSafeInteger(n)) return n
    return n
  }
  if (/^-?\d+\.\d+$/.test(s)) {
    const n = Number(s)
    if (!Number.isNaN(n)) return n
  }
  if (s === "true") return true
  if (s === "false") return false
  if (s === "null" || s === "NULL") return null
  // try JSON object/array
  if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
    try {
      return JSON.parse(s)
    } catch {
      return s
    }
  }
  return s
}

export function excelToJson(csvStr: string): string {
  if (!csvStr || !csvStr.trim()) throw new Error("请输入 Excel/CSV 内容")
  const rows = parseCsv(csvStr.trim())
  if (rows.length === 0) throw new Error("CSV解析失败，无数据")
  const header = rows[0].map((h) => h.trim())
  if (header.length === 0 || header.every((h) => !h)) throw new Error("CSV表头为空")
  if (new Set(header).size !== header.length) {
    // duplicate headers allowed? just continue
  }
  const result: Record<string, any>[] = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    // skip empty rows
    if (row.length === 1 && row[0].trim() === "" && row.length < header.length) continue
    if (row.every((c) => c.trim() === "")) continue
    const obj: Record<string, any> = {}
    for (let c = 0; c < header.length; c++) {
      const key = header[c]
      if (!key) continue
      const raw = row[c] !== undefined ? row[c] : ""
      obj[key] = coerceCsvValue(raw)
    }
    result.push(obj)
  }
  return JSON.stringify(result, null, 2)
}

export default {
  jsonToSql,
  sqlToJson,
  jsonToCookie,
  cookieToJson,
  jsonToBase64,
  base64ToJson,
  xmlToBase64,
  base64ToXml,
  jsonToExcel,
  excelToJson,
  stringToBase64,
  base64ToString,
}
