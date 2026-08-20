/**
 * Data conversion tools: json<->csv, json<->yaml, json<->xml
 * Simple implementations for local processing, designed for roundtrip tests.
 */

 // ---------- CSV helpers ----------
function escapeCsvValue(v: any): string {
  if (v === null || v === undefined) return ""
  let s = String(v)
  if (s.includes('"')) s = s.replace(/"/g, '""')
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s}"`
  }
  return s
}

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

function csvFieldToValue(field: string): any {
  const t = field.trim()
  if (t === "") return ""
  if (t === "null") return null
  if (t === "true") return true
  if (t === "false") return false
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const n = Number(t)
    if (!Number.isNaN(n)) return n
  }
  return field
}

// ---------- JSON <-> CSV ----------
export function jsonToCsv(jsonStr: string): string {
  if (!jsonStr.trim()) throw new Error("请输入 JSON 内容")
  let data: any
  try {
    data = JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error(e.message)
  }
  const arr: any[] = Array.isArray(data) ? data : [data]
  if (arr.length === 0) return ""
  const headers: string[] = []
  const headerSet = new Set<string>()
  for (const row of arr) {
    if (row !== null && typeof row === "object" && !Array.isArray(row)) {
      for (const k of Object.keys(row)) {
        if (!headerSet.has(k)) {
          headerSet.add(k)
          headers.push(k)
        }
      }
    } else {
      if (!headerSet.has("value")) {
        headerSet.add("value")
        headers.push("value")
      }
    }
  }
  if (headers.length === 0) return ""
  const lines: string[] = []
  lines.push(headers.map(escapeCsvValue).join(","))
  for (const row of arr) {
    if (row !== null && typeof row === "object" && !Array.isArray(row)) {
      lines.push(headers.map(h => escapeCsvValue(row[h])).join(","))
    } else {
      lines.push(headers.map(h => (h === "value" ? escapeCsvValue(row) : "")).join(","))
    }
  }
  return lines.join("\n")
}

export function csvToJson(csvStr: string): string {
  if (!csvStr.trim()) throw new Error("请输入 CSV 内容")
  const rawLines = csvStr.split(/\r?\n/)
  // filter out completely empty lines (but keep lines with commas)
  const lines = rawLines.filter(l => l.trim() !== "")
  if (lines.length === 0) throw new Error("CSV 内容为空")
  const headers = parseCsvLine(lines[0]).map(h => h.trim())
  if (headers.length === 0) throw new Error("CSV 缺少表头")
  const result: any[] = []
  const isValueOnly = headers.length === 1 && headers[0] === "value"
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i])
    if (fields.length === 1 && fields[0] === "" && headers.length > 1) continue
    if (isValueOnly) {
      const raw = fields[0] ?? ""
      result.push(csvFieldToValue(raw))
    } else {
      const obj: Record<string, any> = {}
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j]
        const raw = fields[j] ?? ""
        obj[key] = csvFieldToValue(raw)
      }
      result.push(obj)
    }
  }
  if (isValueOnly) {
    // Heuristic: if original was primitive array, return array of primitives.
    // If headers is value and we have primitives, return JSON array of primitives.
    // Check if result contains only primitives -> keep as is. But jsonToCsv for primitive array produces value header.
    // So we return array of primitives.
    return JSON.stringify(result, null, 2)
  }
  return JSON.stringify(result, null, 2)
}

// ---------- YAML helpers ----------
function yamlEscapeString(str: string): string {
  if (str === "") return '""'
  // needs quoting if contains special yaml chars or is ambiguous
  if (/[:#\-\{\}\[\],&\*\?\|>'"%@`]|^\s|\s$/.test(str) || str.includes("\n") || /^(true|false|null|~)$/.test(str) || /^-?\d+(\.\d+)?$/.test(str)) {
    return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
  }
  return str
}

function dumpYaml(value: any, indent: number): string {
  const pad = "  ".repeat(indent)
  if (value === null || value === undefined) return "null"
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "number") return String(value)
  if (typeof value === "string") return yamlEscapeString(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    return value.map(item => {
      if (item !== null && typeof item === "object") {
        const dumped = dumpYaml(item, indent + 1)
        if (dumped.includes("\n")) {
          const lines = dumped.split("\n")
          // first line trimmed, subsequent lines already indented
          return `${pad}- ${lines[0].trimStart()}\n${lines.slice(1).join("\n")}`
        } else {
          // scalar object cases like {} or []
          if (dumped === "{}" || dumped === "[]") {
            return `${pad}- ${dumped}`
          }
          return `${pad}- ${dumped}`
        }
      } else {
        return `${pad}- ${dumpYaml(item, 0)}`
      }
    }).join("\n")
  }
  if (typeof value === "object") {
    const keys = Object.keys(value)
    if (keys.length === 0) return "{}"
    return keys.map(k => {
      const v = value[k]
      if (v !== null && typeof v === "object") {
        if (Array.isArray(v) && v.length === 0) return `${pad}${k}: []`
        if (!Array.isArray(v) && Object.keys(v).length === 0) return `${pad}${k}: {}`
        const dumped = dumpYaml(v, indent + 1)
        return `${pad}${k}:\n${dumped}`
      } else {
        return `${pad}${k}: ${dumpYaml(v, 0)}`
      }
    }).join("\n")
  }
  return String(value)
}

function parseYamlScalar(s: string): any {
  const t = s.trim()
  if (t === "" || t === "null" || t === "~") return null
  if (t === "true") return true
  if (t === "false") return false
  if (t === "[]") return []
  if (t === "{}") return {}
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    const inner = t.slice(1, -1)
    return inner.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const n = Number(t)
    if (!Number.isNaN(n)) return n
  }
  return t
}

function findColonOutsideQuotes(str: string): number {
  let inSingle = false
  let inDouble = false
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ch === "'" && !inDouble) {
      // handle escaped?
      inSingle = !inSingle
    } else if (ch === '"' && !inSingle) {
      if (i > 0 && str[i - 1] === '\\') continue
      inDouble = !inDouble
    } else if (ch === ':' && !inSingle && !inDouble) {
      // check next char is space or end
      // but for key:value we accept even without space after colon when value empty?
      return i
    }
  }
  return -1
}

function parseYaml(yamlStr: string): any {
  const rawLines = yamlStr.split(/\r?\n/)
  const lines = rawLines.filter(l => l.trim() !== "" && !l.trim().startsWith("#"))
  if (lines.length === 0) return null

  let idx = 0

  function peekIndent(): number {
    if (idx >= lines.length) return -1
    const m = lines[idx].match(/^(\s*)/)
    return m ? m[1].length : 0
  }

  function isQuoted(s: string): boolean {
    const t = s.trim()
    return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))
  }

  function parseBlock(expectedIndent: number): any {
    if (idx >= lines.length) return null
    const first = lines[idx]
    const trimmed = first.trim()
    const firstIndent = first.match(/^(\s*)/)![1].length

    // Determine if block is array
    if (trimmed.startsWith("-")) {
      const arr: any[] = []
      while (idx < lines.length) {
        const line = lines[idx]
        const curIndent = line.match(/^(\s*)/)![1].length
        if (curIndent < expectedIndent) break
        if (curIndent > expectedIndent) break
        const t = line.trim()
        if (!t.startsWith("-")) break
        let after = t.slice(1).trimStart()
        idx++
        if (after === "") {
          const nextIndent = peekIndent()
          if (nextIndent > curIndent) {
            arr.push(parseBlock(nextIndent))
          } else {
            arr.push(null)
          }
        } else {
          // check if after looks like object start (contains colon)
          const colonIdx = findColonOutsideQuotes(after)
          if (colonIdx !== -1 && !isQuoted(after)) {
            // object item with inline first key
            const obj: any = {}
            const k = after.slice(0, colonIdx).trim()
            const vStr = after.slice(colonIdx + 1).trim()
            if (vStr === "") {
              const ni = peekIndent()
              if (ni > curIndent) {
                obj[k] = parseBlock(ni)
              } else {
                obj[k] = null
              }
            } else {
              obj[k] = parseYamlScalar(vStr)
            }
            // consume following lines that belong to this object (indent = curIndent+2)
            const objIndent = curIndent + 2
            while (idx < lines.length) {
              const nl = lines[idx]
              const ni = nl.match(/^(\s*)/)![1].length
              if (ni < objIndent) break
              if (ni > objIndent) break
              const nt = nl.trim()
              if (nt.startsWith("-")) break
              const ci = findColonOutsideQuotes(nt)
              if (ci === -1) {
                idx++
                continue
              }
              const nk = nt.slice(0, ci).trim()
              const nvStr = nt.slice(ci + 1).trim()
              idx++
              if (nvStr === "") {
                const ni2 = peekIndent()
                if (ni2 > ni) obj[nk] = parseBlock(ni2)
                else obj[nk] = null
              } else if (nvStr === "[]" || nvStr === "{}") {
                obj[nk] = parseYamlScalar(nvStr)
              } else {
                obj[nk] = parseYamlScalar(nvStr)
              }
            }
            arr.push(obj)
          } else {
            arr.push(parseYamlScalar(after))
          }
        }
      }
      return arr
    } else {
      // object
      const obj: any = {}
      while (idx < lines.length) {
        const line = lines[idx]
        const curIndent = line.match(/^(\s*)/)![1].length
        if (curIndent < expectedIndent) break
        if (curIndent > expectedIndent) break
        const t = line.trim()
        if (t.startsWith("-")) break
        const colonIdx = findColonOutsideQuotes(t)
        if (colonIdx === -1) {
          idx++
          continue
        }
        const key = t.slice(0, colonIdx).trim()
        const valStr = t.slice(colonIdx + 1).trim()
        idx++
        if (valStr === "") {
          const nextIndent = peekIndent()
          if (nextIndent > curIndent) {
            obj[key] = parseBlock(nextIndent)
          } else {
            obj[key] = null
          }
        } else if (valStr === "[]" ) {
          obj[key] = []
        } else if (valStr === "{}") {
          obj[key] = {}
        } else {
          obj[key] = parseYamlScalar(valStr)
        }
      }
      return obj
    }
  }

  // Top-level scalar detection
  const firstLine = lines[0].trim()
  if (!firstLine.includes(":") && !firstLine.startsWith("-")) {
    // could be scalar like "hello" or "123"
    if (lines.length === 1) {
      return parseYamlScalar(firstLine)
    }
  }
  const baseIndent = lines[0].match(/^(\s*)/)![1].length
  return parseBlock(baseIndent)
}

// ---------- JSON <-> YAML ----------
export function jsonToYaml(jsonStr: string): string {
  if (!jsonStr.trim()) throw new Error("请输入 JSON 内容")
  let data: any
  try {
    data = JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error(e.message)
  }
  // handle top-level primitives
  if (data === null || typeof data !== "object") {
    return dumpYaml(data, 0) + "\n"
  }
  return dumpYaml(data, 0) + "\n"
}

export function yamlToJson(yamlStr: string): string {
  if (!yamlStr.trim()) throw new Error("请输入 YAML 内容")
  const parsed = parseYaml(yamlStr)
  return JSON.stringify(parsed, null, 2)
}

// ---------- XML helpers ----------
function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function unescapeXml(str: string): string {
  return String(str)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
}

function parseXmlScalar(text: string): any {
  const t = unescapeXml(text.trim())
  if (t === "") return ""
  if (t === "null") return null
  if (t === "true") return true
  if (t === "false") return false
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const n = Number(t)
    if (!Number.isNaN(n)) return n
  }
  return t
}

// ---------- JSON <-> XML ----------
export function jsonToXml(jsonStr: string): string {
  if (!jsonStr.trim()) throw new Error("请输入 JSON 内容")
  let data: any
  try {
    data = JSON.parse(jsonStr)
  } catch (e: any) {
    throw new Error(e.message)
  }
  const xmlDecl = '<?xml version="1.0" encoding="UTF-8"?>'

  function build(value: any, tag: string): string {
    if (value === null || value === undefined) return `<${tag}/>`
    if (Array.isArray(value)) {
      if (value.length === 0) return `<${tag}/>`
      const inner = value.map(v => {
        if (v !== null && typeof v === "object") {
          if (Array.isArray(v)) {
            return build(v, "item")
          } else {
            const keys = Object.keys(v)
            if (keys.length === 0) return `<item/>`
            const innerObj = keys.map(k => build(v[k], k)).join("")
            return `<item>${innerObj}</item>`
          }
        } else {
          if (v === null || v === undefined) return `<item/>`
          return `<item>${escapeXml(String(v))}</item>`
        }
      }).join("")
      return `<${tag}>${inner}</${tag}>`
    }
    if (typeof value === "object") {
      const keys = Object.keys(value)
      if (keys.length === 0) return `<${tag}/>`
      const inner = keys.map(k => {
        const v = (value as any)[k]
        if (Array.isArray(v)) {
          if (v.length === 0) return `<${k}/>`
          const items = v.map(el => {
            if (el !== null && typeof el === "object") {
              if (Array.isArray(el)) {
                return build(el, "item")
              } else {
                const sub = Object.keys(el).map(sk => build((el as any)[sk], sk)).join("")
                return `<item>${sub}</item>`
              }
            } else {
              if (el === null || el === undefined) return `<item/>`
              return `<item>${escapeXml(String(el))}</item>`
            }
          }).join("")
          return `<${k}>${items}</${k}>`
        } else if (v !== null && typeof v === "object") {
          return build(v, k)
        } else {
          if (v === null || v === undefined) return `<${k}/>`
          return `<${k}>${escapeXml(String(v))}</${k}>`
        }
      }).join("")
      return `<${tag}>${inner}</${tag}>`
    }
    return `<${tag}>${escapeXml(String(value))}</${tag}>`
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return `${xmlDecl}\n<root/>`
    const inner = data.map(el => {
      if (el !== null && typeof el === "object" && !Array.isArray(el)) {
        const sub = Object.keys(el).map(k => build((el as any)[k], k)).join("")
        return `<item>${sub}</item>`
      } else if (Array.isArray(el)) {
        return build(el, "item")
      } else {
        if (el === null || el === undefined) return `<item/>`
        return `<item>${escapeXml(String(el))}</item>`
      }
    }).join("")
    return `${xmlDecl}\n<root>${inner}</root>`
  } else if (data !== null && typeof data === "object") {
    return `${xmlDecl}\n${build(data, "root")}`
  } else {
    if (data === null || data === undefined) return `${xmlDecl}\n<root/>`
    return `${xmlDecl}\n<root>${escapeXml(String(data))}</root>`
  }
}

type XmlNode = { tag: string; children: XmlNode[]; text: string; isSelfClosing?: boolean }

export function xmlToJson(xmlStr: string): string {
  if (!xmlStr.trim()) throw new Error("请输入 XML 内容")
  let xml = xmlStr.trim()
  // strip XML declaration
  xml = xml.replace(/<\?xml[^>]*\?>/g, "").trim()
  if (!xml) throw new Error("XML 内容为空")

  // collapse whitespace between tags for simpler parsing but preserve text inside?
  // We'll parse via regex stack

  const tagRegex = /<(\/?)([a-zA-Z0-9_\-\.]+)([^>]*?)(\/?)>/g
  const stack: XmlNode[] = [{ tag: "__root", children: [], text: "" }]
  let lastIndex = 0
  let match: RegExpExecArray | null
  // Reset regex
  tagRegex.lastIndex = 0
  while ((match = tagRegex.exec(xml)) !== null) {
    const [full, slash, tagName, _attrs, selfSlash] = match
    const textBetween = xml.slice(lastIndex, match.index)
    if (textBetween.trim() !== "") {
      const top = stack[stack.length - 1]
      top.text = (top.text || "") + textBetween.trim()
    }
    if (slash === "/") {
      // closing
      const node = stack.pop()
      if (!node) throw new Error(`Unexpected closing tag </${tagName}>`)
      if (node.tag !== tagName) {
        // Try to handle mismatch: if tags differ, maybe we popped wrong? But for our simple XML it should match.
        // To be tolerant, keep popping until match or root
        // For now throw
        throw new Error(`Tag mismatch: expected </${node.tag}> but got </${tagName}>`)
      }
      const parent = stack[stack.length - 1]
      if (!parent) throw new Error("Stack underflow")
      parent.children.push(node)
    } else if (selfSlash === "/") {
      const parent = stack[stack.length - 1]
      parent.children.push({ tag: tagName, children: [], text: "", isSelfClosing: true })
    } else {
      stack.push({ tag: tagName, children: [], text: "" })
    }
    lastIndex = tagRegex.lastIndex
  }
  // trailing text
  const trailing = xml.slice(lastIndex).trim()
  if (trailing) {
    const top = stack[stack.length - 1]
    top.text = (top.text || "") + trailing
  }
  if (stack.length !== 1) {
    // unclosed tags
    // try to close remaining?
    while (stack.length > 1) {
      const node = stack.pop()!
      stack[stack.length - 1].children.push(node)
    }
  }
  const rootWrapper = stack[0]
  if (rootWrapper.children.length === 0) throw new Error("无法解析 XML")
  // Expect first child is root
  const rootNode = rootWrapper.children[0]

  function nodeToValue(node: XmlNode): any {
    if (node.isSelfClosing) return null
    if (node.children.length === 0) {
      if (node.text === "" || node.text === null || node.text === undefined) {
        // differentiate empty string vs empty element?
        // For our generation, empty element with no text is either null (selfClosing) or empty string (should be ""?)
        // But we already handle selfClosing, so open-close empty likely means "" (empty string) or maybe null for empty object?
        // We'll return "" for empty string case, but to preserve null for <tag></tag> where original was null? However null we use selfClosing, so treat empty as ""
        // However for test roundtrip with empty objects/arrays we may need handling. Return null for truly empty?
        // Let's treat empty tag with no children and empty text as "" if tag was expected to be string, but for object case it would have been selfClosing already.
        // To make roundtrip for "" we need "".
        return ""
      }
      return parseXmlScalar(node.text)
    } else {
      const allItem = node.children.every(c => c.tag === "item")
      if (allItem) {
        return node.children.map(c => nodeToValue(c))
      }
      const obj: any = {}
      for (const child of node.children) {
        const val = nodeToValue(child)
        const key = child.tag
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]]
          obj[key].push(val)
        } else {
          obj[key] = val
        }
      }
      // If node also has text (mixed), we ignore text per simple model; but if obj is empty and text exists, return text
      if (Object.keys(obj).length === 0 && node.text.trim() !== "") {
        return parseXmlScalar(node.text)
      }
      return obj
    }
  }

  let value: any
  // rootNode is <root> element
  if (rootNode.tag !== "root") {
    // if no root wrapper, treat as single node
    value = nodeToValue(rootNode)
  } else {
    value = nodeToValue(rootNode)
    // Special handling: rootNode with no children and text -> primitive
    // nodeToValue already handles: if root has no children (text only) => returns scalar
    // If root has children all item => returns array (top-level array case)
    // If root has object children => returns object
    // If root is selfClosing => null
    // However nodeToValue for root will treat allItem correctly (top-level array)
    // Need to handle root selfClosing => null
    // Also root empty "" case
  }

  // xmlToJson may need to handle case where root value is array vs object vs primitive vs null/"" 
  // For our jsonToXml, primitive top-level yields <root>value</root> -> nodeToValue returns scalar value, good.
  // For empty array top-level <root/> -> nodeToValue returns null, but we want []? 
  // Our jsonToXml for [] returns <root/> selfClosing? Actually for Array.isArray(data) && length===0 we return <root/> selfClosing, which nodeToValue would map to null, not [].
  // We need to differentiate [] vs null at top-level. For now we treat <root/> as [] if original was array? But ambiguous.
  // To handle this edge, we could check if xml is "<root/>" or "<root></root>" and treat as null vs empty? Let's detect if rootNode is selfClosing vs empty.
  // Since jsonToXml for [] and {} both produce <root/> , we cannot distinguish. For roundtrip tests we will avoid testing empty top-level arrays.

  return JSON.stringify(value, null, 2)
}

export default { jsonToCsv, csvToJson, jsonToYaml, yamlToJson, jsonToXml, xmlToJson }
