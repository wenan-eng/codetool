import { describe, it, expect } from "vitest"
import { htmlFilter } from "./htmlFilter"

describe("htmlFilter", () => {
  it("removes <script> tags and content", () => {
    const html = `<div>hello</div><script>alert(1)</script><p>world</p>`
    const result = htmlFilter(html, { removeScripts: true })
    expect(result).not.toContain("<script>")
    expect(result).not.toContain("alert(1)")
    expect(result).toContain("<div>hello</div>")
    expect(result).toContain("<p>world</p>")
  })

  it("removes <style> tags and content", () => {
    const html = `<style>body{color:red}</style><div>content</div>`
    const result = htmlFilter(html, { removeStyles: true })
    expect(result).not.toContain("<style>")
    expect(result).not.toContain("color:red")
    expect(result).toContain("<div>content</div>")
  })

  it("extractText strips all tags and returns text", () => {
    const html = `<div>hello <b>world</b></div><p>foo &amp; bar</p><!-- comment -->`
    const result = htmlFilter(html, { extractText: true })
    expect(result).not.toContain("<")
    expect(result).not.toContain(">")
    expect(result).toContain("hello world")
    expect(result).toContain("foo & bar")
    expect(result).not.toContain("comment")
  })

  it("allowedTags keeps only whitelist", () => {
    const html = `<div><p>keep</p><span>remove</span><a href="#">link</a></div>`
    const result = htmlFilter(html, { allowedTags: ["p", "a"] })
    expect(result).toContain("<p>keep</p>")
    expect(result).toContain('<a href="#">link</a>')
    expect(result).not.toContain("<div>")
    expect(result).not.toContain("<span>")
  })

  it("handles mode text alias and combined removeScripts+extractText", () => {
    const html = `<script>evil()</script><style>.x{}</style><h1>Title</h1><p>Text</p>`
    const result = htmlFilter(html, { mode: "text", removeScripts: true, removeStyles: true })
    expect(result).toBe("Title Text")
    // extractText via mode text should also work without explicit extractText
    const r2 = htmlFilter(html, { extractText: true })
    expect(r2).toBe("Title Text")
  })
})
