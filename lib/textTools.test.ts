import { describe, expect, it } from "vitest"
import { toUpperCase, toLowerCase, convertSymbols, removeEmoji, countWords, literalNewlinesToReal, realNewlinesToLiteral, replaceAll, splitText } from "./textTools"

describe("letter-converter", () => {
  it("大小写转换", () => {
    expect(toUpperCase("www.lanren-tools.com")).toBe("WWW.LANREN-TOOLS.COM")
    expect(toLowerCase("Hello World")).toBe("hello world")
  })
})

describe("symbol-converter", () => {
  it("中文符号转英文", () => {
    expect(convertSymbols("你好，世界！", "zh2en")).toBe("你好,世界!")
  })
  it("英文符号转中文", () => {
    expect(convertSymbols("你好,世界!", "en2zh")).toBe("你好，世界！")
  })
  it("往返一致", () => {
    const s = "混合（测试）：【OK】"
    expect(convertSymbols(convertSymbols(s, "zh2en"), "en2zh")).toBe(s)
  })
})

describe("remove-emoji", () => {
  it("去除 Emoji 保留文字", () => {
    expect(removeEmoji("你好😀世界🎉abc")).toBe("你好世界abc")
  })
  it("纯 Emoji 输出为空", () => {
    expect(removeEmoji("😀😃😄")).toBe("")
  })
})

describe("word-count", () => {
  it("统计各维度", () => {
    const r = countWords("你好 world 123 ！\n第二行")
    expect(r.totalChars).toBe(18)
    expect(r.chineseChars).toBe(5)
    expect(r.englishWords).toBe(1)
    expect(r.lines).toBe(2)
    expect(r.bytesUtf8).toBeGreaterThan(r.charsNoSpaces)
  })
  it("空文本", () => {
    expect(countWords("").lines).toBe(0)
  })
})

describe("newline converters", () => {
  it("字面转真实", () => {
    expect(literalNewlinesToReal("a\\nb")).toBe("a\nb")
  })
  it("真实转字面", () => {
    expect(realNewlinesToLiteral("a\nb")).toBe("a\\nb")
  })
})

describe("text-replace", () => {
  it("普通替换计数", () => {
    const r = replaceAll("aaa", "a", "b")
    expect(r.result).toBe("bbb")
    expect(r.count).toBe(3)
  })
  it("正则替换", () => {
    const r = replaceAll("a1b2c3", "[0-9]", "*", true)
    expect(r.result).toBe("a*b*c*")
    expect(r.count).toBe(3)
  })
  it("无效正则报错", () => {
    expect(() => replaceAll("x", "(", "y", true)).toThrow(/正则/)
  })
})

describe("text-split", () => {
  it("按分隔符拆分", () => {
    expect(splitText("a,b,c", ",", " | ")).toBe("a | b | c")
  })
  it("默认按换行拆分", () => {
    expect(splitText("a\nb\nc", "", "-")).toBe("a-b-c")
  })
})
