import { describe, expect, it } from "vitest"
import { isValidIp, ipToInt, intToIp, parseCidr, randomPublicIps, generateRobots, checkRobots, generateMeta, solveProportion, analyzeLog, keywordDensity } from "./webmasterTools"

describe("ip2int", () => {
  it("双向转换", () => {
    expect(ipToInt("192.168.1.1")).toBe(3232235777)
    expect(intToIp(3232235777)).toBe("192.168.1.1")
  })
  it("无效地址报错", () => {
    expect(() => ipToInt("999.1.1.1")).toThrow(/无效/)
    expect(() => intToIp(-1)).toThrow()
  })
})

describe("cidr & subnet", () => {
  it("/24 解析", () => {
    const r = parseCidr("192.168.1.100/24")
    expect(r.network).toBe("192.168.1.0")
    expect(r.broadcast).toBe("192.168.1.255")
    expect(r.mask).toBe("255.255.255.0")
    expect(r.usableHosts).toBe(254)
    expect(r.firstUsable).toBe("192.168.1.1")
  })
  it("/31 特例", () => {
    const r = parseCidr("10.0.0.4/31")
    expect(r.usableHosts).toBe(2)
  })
})

describe("randomPublicIps", () => {
  it("生成数量与去重且非保留段", () => {
    const ips = randomPublicIps(50)
    expect(ips.length).toBeGreaterThan(40)
    expect(new Set(ips).size).toBe(ips.length)
    for (const ip of ips) {
      const parts = ip.split(".").map(Number)
      const reserved = (parts[0] === 10) || (parts[0] === 127) || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
      expect(reserved).toBe(false)
    }
  })
})

describe("robots", () => {
  it("生成包含全部规则", () => {
    const out = generateRobots({ userAgent: "Googlebot", allow: ["/public"], disallow: ["/admin", "/private"], crawlDelay: 2, sitemap: "https://a.com/s.xml" })
    expect(out).toContain("User-agent: Googlebot")
    expect(out).toContain("Disallow: /admin")
    expect(out).toContain("Allow: /public")
    expect(out).toContain("Crawl-delay: 2")
    expect(out).toContain("Sitemap: https://a.com/s.xml")
  })
  it("检测空值与未知指令", () => {
    const issues = checkRobots("User-agent:\nFoo: bar\nDisallow:")
    expect(issues.some(i => i.message.includes("为空"))).toBe(true)
    expect(issues.some(i => i.message.includes("未知指令"))).toBe(true)
  })
  it("无 Disallow 提示", () => {
    const issues = checkRobots("User-agent: *\nAllow: /")
    expect(issues.some(i => i.message.includes("允许全部"))).toBe(true)
  })
})

describe("meta generator", () => {
  it("生成标准标签", () => {
    const out = generateMeta({ title: "测试站", description: "描述", keywords: "a,b", author: "文安", viewport: true, charset: true, robotsIndex: false, ogTitle: true })
    expect(out).toContain('<title>测试站</title>')
    expect(out).toContain('charset="UTF-8"')
    expect(out).toContain('noindex')
    expect(out).toContain('og:title')
  })
})

describe("proportion", () => {
  it("求解第四项", () => {
    expect(solveProportion(2, 4, 6)).toBe(12)
  })
  it("除零报错", () => {
    expect(() => solveProportion(0, 1, 1)).toThrow(/不能为 0/)
  })
})

describe("log analysis", () => {
  it("解析 Nginx 日志 PV/UV/状态码", () => {
    const log = [
      '1.2.3.4 - - [21/Aug/2026:10:00:00 +0800] "GET /a HTTP/1.1" 200',
      '1.2.3.4 - - [21/Aug/2026:10:00:01 +0800] "GET /b HTTP/1.1" 404',
      '5.6.7.8 - - [21/Aug/2026:10:00:02 +0800] "POST /c HTTP/1.1" 500',
    ].join("\n")
    const s = analyzeLog(log)
    expect(s.pv).toBe(3)
    expect(s.uv).toBe(2)
    expect(s.statusCounts[0].code).toBe("200")
    expect(s.topIps[0]).toEqual({ ip: "1.2.3.4", count: 2 })
  })
})

describe("keyword density", () => {
  it("统计高频词并过滤停用词", () => {
    const r = keywordDensity("工具 工具 免费工具 the and 在线工具 在线工具 在线")
    expect(r[0].word).toBe("工具")
    expect(r.some(x => x.word === "the")).toBe(false)
    expect(r.every(x => x.count >= 2)).toBe(true)
  })
})
