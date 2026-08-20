/**
 * HTML 转义 / 反转义 — 复刻 https://www.lanren-tools.com/html-escape/
 * 仅对 5 个 HTML 特殊字符做转义: & < > " '  （中文、数字、普通符号保持原样）
 * 同时支持反转义时解析数值实体 &#DEC; / &#xHEX; 及常见命名实体
 */

export function escapeHtml(str: string): string {
  if (!str) return str
  // & 必须最先替换，避免二次转义
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function unescapeHtml(str: string): string {
  if (!str) return str
  return (
    str
      // 先解数值实体（十六进制 / 十进制），避免 &amp; 先解导致的二次解码
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => {
        const code = parseInt(hex, 16)
        // 非法码点则保留原样
        if (Number.isNaN(code)) return _
        try {
          return String.fromCodePoint(code)
        } catch {
          return _
        }
      })
      .replace(/&#(\d+);/g, (_, dec: string) => {
        const code = parseInt(dec, 10)
        if (Number.isNaN(code)) return _
        try {
          return String.fromCodePoint(code)
        } catch {
          return _
        }
      })
      // 命名实体（除 &amp; 外）
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/gi, "'")
      .replace(/&nbsp;/g, "\u00A0")
      // &amp; 最后处理，确保单层解码：&amp;lt; -> &lt; 而非 <
      .replace(/&amp;/g, "&")
  )
}

export default { escapeHtml, unescapeHtml }
