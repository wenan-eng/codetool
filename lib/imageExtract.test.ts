import { describe, it, expect } from "vitest"
import { imageExtract } from "./imageExtract"

describe("imageExtract", () => {
  it("extracts single img src with double quotes", () => {
    const html = `<img src="https://example.com/a.jpg" alt="a">`
    expect(imageExtract(html)).toEqual(["https://example.com/a.jpg"])
  })

  it("extracts multiple imgs with single and double quotes", () => {
    const html = `<img src='https://example.com/b.png'><div><IMG SRC="https://example.com/c.gif" /></div>`
    const result = imageExtract(html)
    expect(result).toHaveLength(2)
    expect(result).toContain("https://example.com/b.png")
    expect(result).toContain("https://example.com/c.gif")
  })

  it("handles img with other attributes and whitespace variations", () => {
    const html = `<img  alt="x"   src = "https://example.com/d.webp"  width=100 >`
    expect(imageExtract(html)).toEqual(["https://example.com/d.webp"])
  })

  it("handles unquoted src and ignores tags without src", () => {
    const html = `<img src=https://example.com/e.jpg><img alt="no src"><img src="https://example.com/f.jpg">`
    const result = imageExtract(html)
    expect(result).toEqual(["https://example.com/e.jpg", "https://example.com/f.jpg"])
  })

  it("returns empty for no images and case-insensitive tag", () => {
    expect(imageExtract(`<div>no images</div>`)).toEqual([])
    expect(imageExtract(``)).toEqual([])
    const html = `<IMG src="https://example.com/g.jpg"><img src='https://example.com/h.jpg' />`
    expect(imageExtract(html)).toEqual(["https://example.com/g.jpg", "https://example.com/h.jpg"])
  })
})
