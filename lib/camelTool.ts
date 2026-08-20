/**
 * 驼峰 / 下划线 互转工具 — 纯函数
 * 复刻 lanren-tools /static/js/camel.js 核心逻辑，简化版忽略 protected context。
 *
 * camelToSnake:  str.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').toLowerCase()
 * snakeToCamel:  str.replace(/_([a-z])/g, (_,l)=>l.toUpperCase())
 * transform:     对整段文本按正则 [a-zA-Z_$][a-zA-Z0-9_$]* 匹配标识符后逐个转换
 */

export function camelToSnake(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase()
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, l: string) => l.toUpperCase())
}

export type CamelDirection = "toSnake" | "toCamel"

/**
 * 对整段文本做批量转换，忽略 protected context（字符串/注释等），直接对所有标识符生效。
 * lang 参数保留以兼容原 API，目前未根据语言做差异化处理。
 */
export function transform(text: string, direction: CamelDirection, lang?: string): string {
  void lang
  if (!text) return text
  return text.replace(/[a-zA-Z_$][a-zA-Z0-9_$]*/g, (match) => {
    return direction === "toSnake" ? camelToSnake(match) : snakeToCamel(match)
  })
}

/** 兼容任务描述的包装别名 */
export function convertCamel(text: string, mode: "toSnake" | "toCamel"): string {
  return transform(text, mode)
}

export default { camelToSnake, snakeToCamel, transform, convertCamel }
