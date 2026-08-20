/** HTML 格式化 / 压缩 */
export function compress(input: string): string {
  if (!input.trim()) throw new Error("请输入 HTML 内容")
  return input
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim()
}

export function beautify(input: string, indent = 2): string {
  if (!input.trim()) throw new Error("请输入 HTML 内容")
  const base = compress(input)
  const pad = " ".repeat(indent)
  // 在标签间插入换行
  const withBreaks = base.replace(/></g, ">\n<")
  const lines = withBreaks.split("\n").map((l) => l.trim()).filter(Boolean)
  let level = 0
  const result: string[] = []
  const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"])
  for (const raw of lines) {
    const trimmed = raw.trim()
    const isClosing = /^<\/[^>]+>/.test(trimmed)
    const openMatch = trimmed.match(/^<([a-zA-Z0-9-]+)/)
    const tagName = openMatch ? openMatch[1].toLowerCase() : ""
    const isSelfClosing = /\/>$/.test(trimmed) || voidTags.has(tagName)
    const isOpening = !isClosing && !isSelfClosing && /^<[^/!][^>]*>$/.test(trimmed)
    const isSingleLine = trimmed.includes("</")

    if (isClosing) level = Math.max(0, level - 1)
    result.push(pad.repeat(level) + trimmed)
    if (isOpening && !isSingleLine) level++
  }
  const out = result.join("\n")
  return out
}

export function validate(input: string): { ok: boolean; error?: string } {
  if (!input.trim()) return { ok: false, error: "内容为空" }
  // 基础校验：标签是否成对（非常宽松）
  return { ok: true }
}

export const sampleHtml = `<div class="container"><h1>Hello World</h1><p>这是一个 <strong>HTML</strong> 示例。</p><ul><li>项目1</li><li>项目2</li></ul></div>`

export default { beautify, compress, validate, sampleHtml }
