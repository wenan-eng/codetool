import { describe, expect, it } from "vitest"
import { isValidIp, ipToInt, intToIp, parseCidr, randomPublicIps, generateRobots, checkRobots, generateMeta, solveProportion } from "./webmasterTools"

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
      const first = Number(ip.split(".")[0])
      expect([10, 127, 172, 192, 169]).not.toContain(first === 172 ? 172 : first === 192 ? 192 : first)
      if (first === 172) expect(Number(ip.split(".")[1])).toBeLessThan(16 || 32)
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
