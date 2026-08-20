import { describe, it, expect } from "vitest"
import { escapeHtml, unescapeHtml } from "./htmlEscape"

describe("htmlEscape", () => {
  it('escape "<div>" -> "&lt;div&gt;"', () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;")
  })

  it('unescape "&lt;div&gt;" -> "<div>"', () => {
    expect(unescapeHtml("&lt;div&gt;")).toBe("<div>")
  })

  it("roundtrip preserves original", () => {
    const original = `<div class="example">这是一个"示例"文本 & 特殊字符 'test'</div>`
    expect(unescapeHtml(escapeHtml(original))).toBe(original)
  })

  it("&amp; handling: escape & and unescape roundtrip", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b")
    expect(unescapeHtml("a &amp; b")).toBe("a & b")
    // 确保 & 先转义，不会二次转义
    expect(escapeHtml("&lt;")).toBe("&amp;lt;")
    // 单层解码： &amp;lt; -> &lt; 而非 <
    expect(unescapeHtml("&amp;lt;")).toBe("&lt;")
  })

  it("quote and numeric entities", () => {
    expect(escapeHtml(`"hello" & 'world'`)).toBe(`&quot;hello&quot; &amp; &#39;world&#39;`)
    expect(unescapeHtml(`&quot;hello&quot; &amp; &#39;world&#39;`)).toBe(`"hello" & 'world'`)
    // 数值实体
    expect(unescapeHtml("&#60;div&#62;")).toBe("<div>")
    expect(unescapeHtml("&#x3C;div&#x3E;")).toBe("<div>")
    expect(unescapeHtml("&#x3c;div&#x3e;")).toBe("<div>")
  })
})
