import { describe, it, expect } from "vitest"
import { htmlEntityEncode, htmlEntityDecode, transformHtmlEntity } from "./htmlEntityCodec"

describe("htmlEntityCodec", () => {
  it("encodes &<>\"' with named entities", () => {
    expect(htmlEntityEncode("&<>\"'")).toBe("&amp;&lt;&gt;&quot;&#39;")
  })
  it("encodes Chinese as decimal numeric entities", () => {
    expect(htmlEntityEncode("你好")).toBe("&#20320;&#22909;")
  })
  it("round-trips mixed content", () => {
    const s = '你好 <b class="x">a & b</b> © — 😀 \'q\''
    expect(htmlEntityDecode(htmlEntityEncode(s))).toBe(s)
  })
  it("handles empty string", () => {
    expect(htmlEntityEncode("")).toBe("")
    expect(htmlEntityDecode("")).toBe("")
  })
  it("decodes named entities", () => {
    expect(htmlEntityDecode("&amp;&lt;&gt;&quot;&#39;&copy;&mdash;&nbsp;")).toBe("&<>\"'©— ")
  })
  it("decodes decimal and hex numeric entities", () => {
    expect(htmlEntityDecode("&#20320;&#x4f60;")).toBe("你你")
    expect(htmlEntityDecode("&#128512;")).toBe("😀")
    expect(htmlEntityDecode("&#X1F600;")).toBe("😀")
  })
  it("keeps unknown entities untouched", () => {
    expect(htmlEntityDecode("&unknown; &#zz; 100")).toBe("&unknown; &#zz; 100")
  })
  it("transformHtmlEntity switches mode", () => {
    expect(transformHtmlEntity("<你>", "encode")).toBe("&lt;&#20320;&gt;")
    expect(transformHtmlEntity("&lt;&#20320;&gt;", "decode")).toBe("<你>")
  })
})
