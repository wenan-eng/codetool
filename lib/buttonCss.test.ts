import { describe, it, expect } from "vitest"
import { generateButtonCss, generateButtonInlineStyle, generateButtonHtml, defaultButtonOptions } from "./buttonCss"

describe("buttonCss", () => {
  it("generateButtonCss contains bg, radius, padding", () => {
    const css = generateButtonCss({ bgColor: "#ff0000", textColor: "#fff", borderRadius: 12, paddingY: 8, paddingX: 16, fontSize: 14, borderColor: "#ff0000", borderWidth: 1, borderStyle: "solid" })
    expect(css).toContain("background-color: #ff0000")
    expect(css).toContain("border-radius: 12px")
    expect(css).toContain("padding: 8px 16px")
    expect(css).toContain("font-size: 14px")
  })

  it("generateButtonCss supports hover", () => {
    const css = generateButtonCss({ ...defaultButtonOptions, hoverBgColor: "#000", hoverTextColor: "#fff" })
    expect(css).toContain(":hover")
    expect(css).toContain("#000")
  })

  it("generateButtonInlineStyle returns style object", () => {
    const style = generateButtonInlineStyle({ bgColor: "#123456", textColor: "#fff", borderRadius: 4, paddingY: 6, paddingX: 12, fontSize: 12, borderColor: "#123456", borderWidth: 2, borderStyle: "solid" })
    expect(style.backgroundColor).toBe("#123456")
    expect(style.borderRadius).toBe("4px")
    expect(style.padding).toBe("6px 12px")
  })

  it("handles border none", () => {
    const css = generateButtonCss({ bgColor: "#fff", textColor: "#000", borderRadius: 0, paddingY: 4, paddingX: 8, fontSize: 10, borderStyle: "none" })
    expect(css).toContain("border: none")
  })

  it("generateButtonHtml escapes and defaults", () => {
    const html = generateButtonHtml({ bgColor: "#fff", textColor: "#000", borderRadius: 4, paddingY: 4, paddingX: 8, fontSize: 12, text: "Click <me>" })
    expect(html).toBe('<button class="btn">Click &lt;me&gt;</button>')
    const html2 = generateButtonHtml({ bgColor: "#fff", textColor: "#000", borderRadius: 4, paddingY: 4, paddingX: 8, fontSize: 12 })
    expect(html2).toContain("Button")
    // custom class
    const css2 = generateButtonCss({ bgColor: "#000", textColor: "#fff", borderRadius: 4, paddingY: 4, paddingX: 8, fontSize: 12 }, ".my-btn")
    expect(css2).toContain(".my-btn")
  })
})
