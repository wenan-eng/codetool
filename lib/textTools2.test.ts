import { describe, expect, it } from "vitest"
import { extractMobiles, extractEmails, extractUrls, extractBirthdays, validateIdcard, parseIdcard, parseUrl, extractByKind } from "./textTools2"

describe("extractMobiles", () => {
  it("提取并去重", () => {
    expect(extractMobiles("联系13812345678或13812345678，座机010-12345678")).toEqual(["13812345678"])
  })
  it("不匹配长数字串中的片段", () => {
    expect(extractMobiles("订单号1138123456789012")).toEqual([])
  })
})

describe("extractEmails", () => {
  it("提取去重并小写化", () => {
    expect(extractEmails("A@B.com 和 a@b.com 以及 x.y+z@test.cn")).toEqual(["a@b.com", "x.y+z@test.cn"])
  })
})

describe("extractUrls", () => {
  it("http 与 www 均可提取", () => {
    const r = extractUrls("访问 https://a.com/x?y=1 和 www.b.com")
    expect(r).toContain("https://a.com/x?y=1")
    expect(r).toContain("https://www.b.com")
  })
})

describe("idcard", () => {
  it("18位提取生日", () => {
    const rows = extractBirthdays("110101199003077777\n220102200501011234")
    expect(rows.map(r => r.birthday)).toEqual(["1990-03-07", "2005-01-01"])
  })
  it("15位提取生日补19", () => {
    expect(extractBirthdays("110101900307777")[0].birthday).toBe("1990-03-07")
  })
  it("校验位验证", () => {
    expect(validateIdcard("11010519491231002X")).toBe(true)
    expect(validateIdcard("110105194912310021")).toBe(false)
  })
  it("解析性别年龄", () => {
    const info = parseIdcard("11010519491231002X")
    expect(info.gender).toBe("女")
    expect(info.age).toBeGreaterThan(50)
    expect(info.valid).toBe(true)
  })
})

describe("parseUrl", () => {
  it("解析完整 URL", () => {
    const p = parseUrl("https://www.example.com:8443/path/page?a=1&b=你好#top")
    expect(p.protocol).toBe("https")
    expect(p.hostname).toBe("www.example.com")
    expect(p.port).toBe("8443")
    expect(p.pathname).toBe("/path/page")
    expect(p.params).toContainEqual(["b", "你好"])
    expect(p.hash).toBe("#top")
  })
  it("无协议自动补 https", () => {
    expect(parseUrl("example.com/a").protocol).toBe("https")
  })
})

describe("extractByKind", () => {
  it("按类型提取", () => {
    expect(extractByKind("编号A42和3.14版本", "number")).toEqual(["42", "3.14"])
    expect(extractByKind("你好hello世界world", "english")).toEqual(["hello", "world"])
  })
})
