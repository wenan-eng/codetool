/**
 * phpSerialize — PHP serialize / unserialize for simple types
 * 支持：string, int, bool, null, float, array (indexed & associative)
 * 对应 PHP: serialize() 输出格式
 *  limit: 不支持 object (O:...), resource, reference; 仅简单类型
 */

export type PhpValue = string | number | boolean | null | PhpValue[] | { [k: string]: PhpValue }

function utf8ByteLength(str: string): number {
  // PHP serialize 中 s:<len> 为字节长度（UTF-8）
  if (typeof Buffer !== "undefined") return Buffer.byteLength(str, "utf-8")
  return new TextEncoder().encode(str).length
}

export function serialize(value: any): string {
  if (value === null || value === undefined) return "N;"
  const t = typeof value
  if (t === "boolean") return `b:${value ? 1 : 0};`
  if (t === "number") {
    if (Number.isInteger(value)) return `i:${value};`
    // float: PHP 用 d: ; 非 finite 用 INF
    if (!Number.isFinite(value)) return `d:${value > 0 ? "INF" : "-INF"};`
    return `d:${value};`
  }
  if (t === "string") {
    const len = utf8ByteLength(value)
    return `s:${len}:"${value}";`
  }
  if (Array.isArray(value)) {
    const len = value.length
    let out = `a:${len}:{`
    for (let i = 0; i < len; i++) out += serialize(i) + serialize(value[i])
    out += "}"
    return out
  }
  if (t === "object") {
    const keys = Object.keys(value)
    let out = `a:${keys.length}:{`
    for (const k of keys) {
      // PHP associative array: key may be string or int; we serialize key as string/int accordingly
      // numeric string keys should be serialized as integer if possible (PHP does so)
      const numKey = Number(k)
      const keyVal: any = String(numKey) === k && Number.isInteger(numKey) ? numKey : k
      out += serialize(keyVal) + serialize(value[k])
    }
    out += "}"
    return out
  }
  throw new Error(`Unsupported type for serialize: ${t}`)
}

// ---------- unserialize ----------
export function unserialize(str: string): any {
  if (typeof str !== "string") throw new Error("unserialize expects string")
  let pos = 0

  function expect(ch: string) {
    if (str[pos] !== ch) throw new Error(`Expected '${ch}' at ${pos}, got '${str[pos]}'`)
    pos++
  }

  function readUntil(delim: string): string {
    const idx = str.indexOf(delim, pos)
    if (idx === -1) throw new Error(`Missing delimiter '${delim}' at ${pos}`)
    const s = str.slice(pos, idx)
    pos = idx + delim.length
    return s
  }

  function parseValue(): any {
    if (pos >= str.length) throw new Error("Unexpected end of input")
    const type = str[pos]
    pos++
    if (type === "N") {
      expect(";")
      return null
    }
    expect(":")
    if (type === "b") {
      const v = readUntil(";")
      if (v !== "0" && v !== "1") throw new Error(`Invalid boolean value ${v}`)
      return v === "1"
    }
    if (type === "i") {
      const v = readUntil(";")
      const n = Number(v)
      if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error(`Invalid integer ${v}`)
      return n
    }
    if (type === "d") {
      const v = readUntil(";")
      if (v === "INF") return Infinity
      if (v === "-INF") return -Infinity
      if (v === "NAN") return NaN
      const n = Number(v)
      if (Number.isNaN(n)) throw new Error(`Invalid double ${v}`)
      return n
    }
    if (type === "s") {
      const lenStr = readUntil(":")
      const len = Number(lenStr)
      if (!Number.isInteger(len) || len < 0) throw new Error(`Invalid string length ${lenStr}`)
      expect('"')
      // read len bytes (UTF-8). For simplicity use byte length handling:
      // We need to slice by byte length, not char length. Use Buffer/TextDecoder if needed.
      let value: string
      if (typeof Buffer !== "undefined") {
        const buf = Buffer.from(str.slice(pos), "utf-8")
        // But str is JS string; slicing by bytes is tricky. Instead read until '";' and validate length?
        // Simpler: read until '";' (PHP allows escaped quotes? No, string content raw, then '";' terminator)
        // However content may contain '";' substring? PHP allows binary safe; but for simple JSON mapping we assume no ambiguous suffix.
        // To handle UTF-8 correctly, we measure byte length and then slice corresponding JS chars by byte length.
        const remaining = str.slice(pos)
        const bytes = Buffer.from(remaining, "utf-8")
        // slice len bytes -> decode back to string length
        const sliceBytes = bytes.slice(0, len)
        value = sliceBytes.toString("utf-8")
        // advance pos by JS char length of value
        pos += value.length
        // Note: if value contains multibyte, Buffer length matches; JS char length may be less (e.g., Chinese 3 bytes each -> 1 char)
        // Our pos advancement by value.length is correct for JS string indexing
        // But bytes may be longer than needed due to multi-byte? Already sliced exact len bytes.
      } else {
        // fallback TextEncoder path
        const enc = new TextEncoder()
        const dec = new TextDecoder()
        const remaining = str.slice(pos)
        const bytes = enc.encode(remaining)
        const slice = bytes.slice(0, len)
        value = dec.decode(slice)
        pos += value.length
      }
      expect('"')
      expect(";")
      // optional validation: byte length should match
      // (skip strict check if mismatch due to naive reading, but we already enforce)
      return value
    }
    if (type === "a") {
      const lenStr = readUntil(":")
      const len = Number(lenStr)
      if (!Number.isInteger(len) || len < 0) throw new Error(`Invalid array length ${lenStr}`)
      expect("{")
      const entries: [any, any][] = []
      for (let i = 0; i < len; i++) {
        const k = parseValue()
        const v = parseValue()
        entries.push([k, v])
      }
      expect("}")
      // decide if indexed array (0..n-1 sequential ints) -> return array, else object
      const isIndexed = entries.length > 0 && entries.every(([k], idx) => k === idx)
        || entries.length === 0
      if (isIndexed) return entries.map(([, v]) => v)
      const obj: Record<string, any> = {}
      for (const [k, v] of entries) obj[String(k)] = v
      return obj
    }
    throw new Error(`Unknown type '${type}' at ${pos - 2}`)
  }

  const result = parseValue()
  // allow trailing whitespace
  const rest = str.slice(pos).trim()
  if (rest.length) throw new Error(`Trailing data after value: '${rest.slice(0, 20)}'`)
  return result
}

// JSON <-> PHP serialize helpers (for tool UI)
export function jsonToPhpSerialize(jsonStr: string): string {
  if (!jsonStr || !jsonStr.trim()) throw new Error("请输入 JSON 内容")
  let parsed: any
  try { parsed = JSON.parse(jsonStr) } catch (e: any) { throw new Error("JSON解析失败: " + e.message) }
  return serialize(parsed)
}

export function phpSerializeToJson(phpStr: string): string {
  if (!phpStr || !phpStr.trim()) throw new Error("请输入 PHP serialize 内容")
  const val = unserialize(phpStr.trim())
  return JSON.stringify(val, null, 2)
}

export default { serialize, unserialize, jsonToPhpSerialize, phpSerializeToJson }
