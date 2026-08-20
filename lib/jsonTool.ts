export function beautify(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('请输入 JSON 内容')
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed, null, indent)
}
export function compress(input: string): string {
  if (!input.trim()) throw new Error('请输入 JSON 内容')
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed)
}
export function validate(input: string): { ok: boolean; error?: string; line?: number } {
  if (!input.trim()) return { ok: false, error: '内容为空' }
  try { JSON.parse(input); return { ok: true } } catch (e: any) {
    const msg = e.message as string
    const lineMatch = msg.match(/line (\d+)/) || msg.match(/position (\d+)/)
    return { ok: false, error: msg, line: lineMatch ? Number(lineMatch[1]) : undefined }
  }
}
export const sampleJson = JSON.stringify({ name: "张三", age: 28, skills: ["JavaScript","Python"], address: { city: "北京", zip: "100000" }, active: true }, null, 2)
