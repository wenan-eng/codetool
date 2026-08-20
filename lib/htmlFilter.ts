/**
 * html-filter — 过滤 HTML 标签、提取文本或移除 scripts/styles
 * 使用正则实现，支持多种 options
 */

export interface HtmlFilterOptions {
  removeScripts?: boolean
  removeStyles?: boolean
  extractText?: boolean
  allowedTags?: string[]
  keepTags?: string[] // alias for allowedTags
  mode?: string // alias: "text" | "stripTags" etc.
  stripScripts?: boolean // alias
  stripStyles?: boolean // alias
  stripTags?: boolean
}

function normalizeOptions(options?: HtmlFilterOptions): Required<Pick<HtmlFilterOptions, "removeScripts" | "removeStyles" | "extractText">> & { allowedTags?: string[] } {
  if (!options) return { removeScripts: false, removeStyles: false, extractText: false }
  const removeScripts = options.removeScripts ?? options.stripScripts ?? false
  const removeStyles = options.removeStyles ?? options.stripStyles ?? false
  let extractText = options.extractText ?? false
  // mode handling
  if (options.mode === "text" || options.mode === "extractText") extractText = true
  if (options.mode === "stripTags") extractText = true // stripTags means extract text
  if (options.stripTags) extractText = true

  const allowedTagsRaw = options.allowedTags ?? options.keepTags
  const allowedTags = allowedTagsRaw ? allowedTagsRaw.map(t => t.toLowerCase()) : undefined

  return { removeScripts, removeStyles, extractText, allowedTags }
}

function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try { return String.fromCodePoint(parseInt(hex, 16)) } catch { return _ }
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      try { return String.fromCodePoint(parseInt(dec, 10)) } catch { return _ }
    })
}

export function htmlFilter(html: string, options?: HtmlFilterOptions): string {
  if (!html) return html
  const opts = normalizeOptions(options)
  let result = html

  // 1. 移除 script 标签及内容
  if (opts.removeScripts) {
    result = result.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    // 也处理自闭合 <script .../>
    result = result.replace(/<script\b[^>]*\/\s*>/gi, "")
  }

  // 2. 移除 style 标签及内容
  if (opts.removeStyles) {
    result = result.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "")
    result = result.replace(/<style\b[^>]*\/\s*>/gi, "")
  }

  // 3. 如果需要提取纯文本，则移除所有标签
  if (opts.extractText) {
    // 先移除 script/style 若未单独移除，为了提取文本时不包含脚本内容
    if (!opts.removeScripts) {
      result = result.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    }
    if (!opts.removeStyles) {
      result = result.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
    }
    // 移除注释
    result = result.replace(/<!--[\s\S]*?-->/g, " ")
    // 移除所有标签，替换为空格以保留词边界
    result = result.replace(/<[^>]+>/g, " ")
    result = decodeEntities(result)
    // 合并空白
    result = result.replace(/\s+/g, " ").trim()
    return result
  }

  // 4. 如果有 allowedTags 白名单，仅保留白名单标签，其余移除
  if (opts.allowedTags && opts.allowedTags.length > 0) {
    // 也先处理注释移除？保留注释移除
    result = result.replace(/<!--[\s\S]*?-->/g, "")
    result = result.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tagName: string) => {
      const lower = tagName.toLowerCase()
      if (opts.allowedTags!.includes(lower)) {
        return match
      }
      return ""
    })
    return result
  }

  // 5. 默认情况：若未指定 extractText/allowedTags，但指定了 removeScripts/removeStyles，则已处理直接返回
  // 否则若无任何选项，返回移除 scripts/styles 后的结果？但 normalize 默认 false，所以原样返回
  // 为了兼容无 options 时仅原样返回
  return result
}

// 别名以兼容不同命名
export const filterHtml = htmlFilter
export const stripHtml = htmlFilter
export default htmlFilter
