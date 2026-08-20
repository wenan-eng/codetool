/** CSS 格式化 / 压缩 */
export function compress(input: string): string {
  if (!input.trim()) throw new Error("请输入 CSS 内容")
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "") // 去注释（压缩时）
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim()
}

export function beautify(input: string, indent = 2): string {
  if (!input.trim()) throw new Error("请输入 CSS 内容")
  const base = compress(input)
  const pad = " ".repeat(indent)
  // 格式化：每个 { 前加空格，{ 后换行缩进，; 后换行，} 前换行
  let out = base
    .replace(/\{/g, " {\n" + pad)
    .replace(/;/g, ";\n" + pad)
    .replace(/\}/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .trim()

  const lines = out.split("\n")
  let level = 0
  const formatted: string[] = []
  for (let raw of lines) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    if (trimmed.startsWith("}")) level = Math.max(0, level - 1)
    formatted.push(pad.repeat(level) + trimmed)
    if (trimmed.endsWith("{")) level++
  }
  return formatted.join("\n")
}

export function validate(input: string): { ok: boolean; error?: string } {
  if (!input.trim()) return { ok: false, error: "内容为空" }
  // 宽松校验：括号是否匹配
  const open = (input.match(/\{/g) || []).length
  const close = (input.match(/\}/g) || []).length
  if (open !== close) return { ok: false, error: "括号不匹配" }
  return { ok: true }
}

export const sampleCss = `.container { display: flex; justify-content: center; align-items: center; } .container h1 { color: #333; font-size: 24px; } @media (max-width: 768px) { .container { flex-direction: column; } }`

export default { beautify, compress, validate, sampleCss }
