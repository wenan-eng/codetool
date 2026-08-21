import { describe, it, expect } from "vitest"
import { generatePasswords } from "./randomPwd"

const ALL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

describe("randomPwd", () => {
  it("generates the requested count", () => {
    expect(generatePasswords({ count: 5 }).length).toBe(5)
    expect(generatePasswords({ count: 1 }).length).toBe(1)
    expect(generatePasswords().length).toBe(5)
  })
  it("respects length range across many generations", () => {
    for (let i = 0; i < 200; i++) {
      const pwds = generatePasswords({ count: 3, minLength: 8, maxLength: 16 })
      for (const p of pwds) {
        expect(p.length).toBeGreaterThanOrEqual(8)
        expect(p.length).toBeLessThanOrEqual(16)
      }
    }
    expect(generatePasswords({ count: 10, minLength: 12, maxLength: 12 }).every((p) => p.length === 12)).toBe(true)
  })
  it("swaps min and max when inverted", () => {
    const pwds = generatePasswords({ count: 20, minLength: 16, maxLength: 8 })
    expect(pwds.every((p) => p.length >= 8 && p.length <= 16)).toBe(true)
  })
  it("only uses characters from enabled sets", () => {
    const pwds = generatePasswords({
      count: 50,
      minLength: 32,
      maxLength: 32,
      lowercase: true,
      digits: true,
      uppercase: false,
      symbols: false,
    })
    expect(pwds.every((p) => /^[a-z0-9]+$/.test(p))).toBe(true)
  })
  it("guarantees at least one char of each enabled type when length allows", () => {
    for (let i = 0; i < 100; i++) {
      const [p] = generatePasswords({
        count: 1,
        minLength: 20,
        maxLength: 20,
        uppercase: true,
        lowercase: true,
        digits: true,
        symbols: true,
      })
      expect(/[A-Z]/.test(p)).toBe(true)
      expect(/[a-z]/.test(p)).toBe(true)
      expect(/[0-9]/.test(p)).toBe(true)
      expect(/[!@#$%^&*]/.test(p)).toBe(true)
    }
  })
  it("appends custom charset chars", () => {
    const pwds = generatePasswords({
      count: 30,
      minLength: 24,
      maxLength: 24,
      lowercase: true,
      uppercase: false,
      digits: false,
      symbols: false,
      customChars: "你好",
    })
    expect(pwds.every((p) => /^[a-z你好]+$/.test(p))).toBe(true)
    expect(pwds.some((p) => p.includes("你") || p.includes("好"))).toBe(true)
  })
  it("throws when no charset selected", () => {
    expect(() => generatePasswords({ uppercase: false, lowercase: false, digits: false, symbols: false })).toThrow(/字符类型/)
  })
  it("produces varied passwords without bias toward first index", () => {
    const pwds = generatePasswords({
      count: 200,
      minLength: 40,
      maxLength: 40,
      digits: true,
      uppercase: false,
      lowercase: false,
      symbols: false,
    })
    const counts: Record<string, number> = {}
    for (const p of pwds) for (const c of p) counts[c] = (counts[c] || 0) + 1
    expect(Object.keys(counts).sort().join("")).toBe("0123456789")
    const total = pwds.reduce((sum, p) => sum + p.length, 0)
    for (const d of "0123456789") {
      expect(counts[d]).toBeGreaterThan(total * 0.05)
      expect(counts[d]).toBeLessThan(total * 0.15)
    }
  })
  it("clamps count into range 1-100", () => {
    expect(generatePasswords({ count: 0 }).length).toBe(1)
    expect(generatePasswords({ count: 500 }).length).toBe(100)
  })
})
