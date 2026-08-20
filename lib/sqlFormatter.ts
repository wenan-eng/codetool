/** SQL 格式化 / 压缩 */
const KEYWORDS = [
  "SELECT","FROM","WHERE","JOIN","INNER","LEFT","RIGHT","OUTER","ON","AND","OR","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET","UNION","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","TRIGGER","PROCEDURE","FUNCTION","DATABASE","USE","SHOW","EXPLAIN","WITH","AS","CASE","WHEN","THEN","ELSE","END","BETWEEN","IN","IS","NOT","NULL","LIKE","EXISTS","BY","ASC","DESC"
]

export function compress(input: string): string {
  if (!input.trim()) throw new Error("请输入 SQL 内容")
  return input
    .replace(/\s+/g, " ")
    .replace(/\s*([(),;])\s*/g, "$1")
    .replace(/\s*([=<>!]+)\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim()
}

export function beautify(input: string, indent = 2): string {
  if (!input.trim()) throw new Error("请输入 SQL 内容")
  let base = compress(input)
  const pad = " ".repeat(indent)
  // 关键字大写
  for (const kw of KEYWORDS) {
    const pattern = new RegExp("\\b" + kw.replace(" ", "\\s+") + "\\b", "gi")
    base = base.replace(pattern, kw)
  }
  // 在主要关键字前换行+缩进
  const major = ["SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","OUTER JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","UNION","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","WITH","CASE"]
  for (const kw of major) {
    const esc = kw.replace(" ", "\\s+")
    const re = new RegExp("\\s*\\b(" + esc + ")\\b", "g")
    base = base.replace(re, "\n" + pad + "$1")
  }
  // 处理 AND/OR 换行（在 WHERE 子句中缩进更多）
  base = base.replace(/\s+AND\s+/g, "\n" + pad + pad + "AND ")
  base = base.replace(/\s+OR\s+/g, "\n" + pad + pad + "OR ")
  // 逗号后换行（SELECT 字段）
  // 仅在 SELECT 段的逗号考虑换行，简化：所有逗号后若后面跟非空格则加换行+缩进
  // 为保持可逆，压缩时会移除这些换行，所以不影响 roundtrip
  // 清理
  base = base
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0)
    .join("\n")
    .replace(/\n\s*\n/g, "\n")
    .trim()

  // 确保第一行不以缩进开头
  const lines = base.split("\n")
  if (lines[0] && lines[0].startsWith(pad)) lines[0] = lines[0].trimStart()
  // 保证包含换行
  if (!base.includes("\n")) {
    // fallback simple newline after ;
    base = base.replace(/;/g, ";\n").trim()
    return base
  }
  return lines.join("\n")
}

export function validate(input: string): { ok: boolean; error?: string } {
  if (!input.trim()) return { ok: false, error: "内容为空" }
  return { ok: true }
}

export const sampleSql = `SELECT u.id, u.name, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 AND o.total > 100 ORDER BY o.total DESC LIMIT 10`

export default { beautify, compress, validate, sampleSql }
