import { describe, expect, it } from "vitest"
import { toTraditional, toSimplified, toMars, fromMars, circleLetters, generateRandomStrings, generateSequence, formatText } from "./textTools3"

describe("chinese-converter", () => {
  it("简转繁", () => {
    expect(toTraditional("我爱妈妈")).toBe("我愛媽媽")
  })
  it("繁转简", () => {
    expect(toSimplified("我愛媽媽")).toBe("我爱妈妈")
  })
  it("非映射字符保留", () => {
    expect(toTraditional("hello 世界")).toBe("hello 世界")
  })
})

describe("mars-converter", () => {
  it("转火星文并还原", () => {
    const mars = toMars("我爱你")
    expect(mars).not.toBe("我爱你")
    expect(fromMars(mars)).toBe("我爱你")
  })
})

describe("letter-circle", () => {
  it("字母与数字加圈", () => {
    expect(circleLetters("Aa1")).toBe("Ⓐⓐ①")
    expect(circleLetters("0")).toBe("⓪")
  })
  it("非字母数字保留", () => {
    expect(circleLetters("你好!")).toBe("你好!")
  })
})

describe("string-random", () => {
  it("数量与长度约束", () => {
    const out = generateRandomStrings({ minLength: 6, maxLength: 12, count: 50 })
    expect(out).toHaveLength(50)
    for (const s of out) expect(s.length).toBeGreaterThanOrEqual(6)
    for (const s of out) expect(s.length).toBeLessThanOrEqual(12)
  })
  it("自定义字符集", () => {
    const out = generateRandomStrings({ minLength: 4, maxLength: 4, count: 20, charset: "ab" })
    for (const s of out) expect(/^[ab]{4}$/.test(s)).toBe(true)
  })
})

describe("sequence-generator", () => {
  it("等差序列", () => {
    expect(generateSequence({ start: 5, step: 3, count: 3, padWidth: 0, prefix: "", suffix: "" })).toEqual(["5", "8", "11"])
  })
  it("补零与前缀后缀", () => {
    expect(generateSequence({ start: 1, step: 1, count: 2, padWidth: 4, prefix: "NO.", suffix: "" })).toEqual(["NO.0001", "NO.0002"])
  })
})

describe("text-formatter", () => {
  it("去 HTML 标签与多余空格", () => {
    const out = formatText("<p>你好   世界</p>", { indent: false, trimSpaces: true, removeEmoji: false, removeHtml: true })
    expect(out).toBe("你好 世界")
  })
  it("首行缩进", () => {
    const out = formatText("第一段\n第二段", { indent: true, trimSpaces: false, removeEmoji: false, removeHtml: false })
    expect(out).toBe("　　第一段\n　　第二段")
  })
})
