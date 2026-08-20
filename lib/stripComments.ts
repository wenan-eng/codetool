/**
 * strip-comments — 按语言移除注释
 * 使用正则处理 //, / star star /, #, <!-- -->, -- 等
 * 支持通过 lang 参数区分语言，默认 js 风格
 */

export type StripLang = string

const JS_LIKE = new Set(["js","javascript","ts","typescript","jsx","tsx","java","c","cpp","cs","csharp","go","php","swift","kotlin","rust","dart"])
const CSS_LIKE = new Set(["css","scss","less","sass"])
const HTML_LIKE = new Set(["html","xml","vue","svelte"])
const PY_LIKE = new Set(["python","py","shell","sh","bash","zsh","ruby","rb","perl","yaml","yml","toml","dockerfile","makefile"])
const SQL_LIKE = new Set(["sql","mysql","postgres","pgsql"])

function normalizeLang(lang?: string): string {
  if (!lang) return "js"
  return lang.trim().toLowerCase()
}

// 保护字符串：用占位符替换字符串内容，避免注释正则误删字符串内的注释符号
function protectStrings(code: string): { protectedCode: string; placeholders: string[] } {
  const placeholders: string[] = []
  // 匹配单引号、双引号、反引号字符串，包含转义
  // 同时处理 python 三引号
  const stringRegex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/g
  const protectedCode = code.replace(stringRegex, (match) => {
    const idx = placeholders.length
    placeholders.push(match)
    return `__STR_${idx}__`
  })
  return { protectedCode, placeholders }
}

function restoreStrings(code: string, placeholders: string[]): string {
  let result = code
  placeholders.forEach((orig, idx) => {
    result = result.split(`__STR_${idx}__`).join(orig)
  })
  return result
}

export function stripComments(code: string, lang?: string): string {
  if (!code) return code
  const l = normalizeLang(lang)

  // HTML: 移除 <!-- -->
  if (HTML_LIKE.has(l)) {
    const { protectedCode, placeholders } = protectStrings(code)
    const stripped = protectedCode.replace(/<!--[\s\S]*?-->/g, "")
    return restoreStrings(stripped, placeholders)
  }

  // CSS: 仅 /* */
  if (CSS_LIKE.has(l)) {
    const { protectedCode, placeholders } = protectStrings(code)
    const stripped = protectedCode.replace(/\/\*[\s\S]*?\*\//g, "")
    return restoreStrings(stripped, placeholders)
  }

  // Python/Shell/YAML: # 注释
  if (PY_LIKE.has(l)) {
    const { protectedCode, placeholders } = protectStrings(code)
    // # 到行尾，保留换行以维持行号
    // 使用 ^ 或 \n 前的 # 作为注释开始，避免处理如 url 中的 #? 简化：每一行 # 后均为注释
    // 但需考虑行内代码后的 # 注释：如 "a = 1 # comment" -> 移除 # comment
    const stripped = protectedCode.replace(/#[^\n]*/g, "")
    return restoreStrings(stripped, placeholders)
  }

  // SQL: -- 到行尾 和 /* */
  if (SQL_LIKE.has(l)) {
    const { protectedCode, placeholders } = protectStrings(code)
    let stripped = protectedCode.replace(/--.*$/gm, "")
    stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, "")
    return restoreStrings(stripped, placeholders)
  }

  // JS 风格及默认： // 和 /* */
  // JS_LIKE 或 unknown fallback: 支持 //, /* */, #? 但默认仅 // 和 /* */ + 也兼容 #? 为通用 fallback 支持 #, //, /* */
  const isJsLike = JS_LIKE.has(l)
  const { protectedCode, placeholders } = protectStrings(code)
  let stripped = protectedCode
  // 移除 // 单行注释
  stripped = stripped.replace(/\/\/.*$/gm, "")
  // 移除 /* 多行注释 */
  stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, "")
  // 对于通用 fallback（非 jsLike），也移除 # 行注释以兼容
  if (!isJsLike && !CSS_LIKE.has(l) && !HTML_LIKE.has(l) && !PY_LIKE.has(l) && !SQL_LIKE.has(l)) {
    // fallback: 额外移除 #? 但保留，避免误伤 js 中 #? 已处理
    // 不处理 #，保持 js 纯粹
  }
  // 清理因移除注释产生的行尾多余空格，但保留空行结构？不过测试期望会 trim 尾空格？
  // 我们保留原始换行，仅移除注释，不额外清理空行
  return restoreStrings(stripped, placeholders)
}

export default stripComments
