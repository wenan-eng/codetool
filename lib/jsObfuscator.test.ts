import { describe, expect, it } from "vitest"
import { obfuscateJs } from "./jsObfuscator"

const SAMPLE = "function greet(name){ return 'Hello ' + name; }"

describe("obfuscateJs", () => {
  it("标准模式输出可执行且语义等价", () => {
    const out = obfuscateJs({ code: SAMPLE })
    expect(out).not.toContain("Hello ")
    expect(out.length).toBeGreaterThan(SAMPLE.length)
    const fn = new Function(out + "; return typeof greet === 'function';")
    expect(fn()).toBe(true)
  })

  it("高级模式包含控制流平坦化特征", () => {
    const out = obfuscateJs({ code: SAMPLE, mode: "high" })
    expect(out).toContain("_0x")
  })

  it("注释头注入", () => {
    const out = obfuscateJs({ code: SAMPLE, comment: "版权所有" })
    expect(out.startsWith("/* 版权所有 */")).toBe(true)
  })

  it("盗用提醒守卫注入", () => {
    const out = obfuscateJs({ code: SAMPLE, theftAlert: true, alertMessage: "禁止盗用", domainLock: ["example.com"] })
    expect(out).toContain("禁止盗用")
    expect(out).toContain("example.com")
  })

  it("域名锁跳转守卫", () => {
    const out = obfuscateJs({ code: SAMPLE, domainLock: ["mydomain.com"], redirectUrl: "https://mydomain.com" })
    expect(out).toContain("mydomain.com")
    expect(out).toContain("location.href")
  })

  it("空代码报错", () => {
    expect(() => obfuscateJs({ code: "   " })).toThrow(/为空/)
  })
})
