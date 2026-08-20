import { describe, it, expect } from "vitest"
import { convertAll, decimalToBase52, base52ToDecimal, decimalToBase58, base58ToDecimal, decimalToBase62, base62ToDecimal, decimalToBase64, base64ToDecimal } from "./hexConverter"

describe("hexConverter", () => {
  it("255 decimal → all bases matches lanren", () => {
    const r = convertAll("255", 10)
    expect(r[2]).toBe("11111111")
    expect(r[8]).toBe("377")
    expect(r[10]).toBe("255")
    expect(r[16]).toBe("FF")
    expect(r[32]).toBe("7V")
    expect(r[36]).toBe("73")
    expect(r[52]).toBe("Ev")
    expect(r[58]).toBe("5Q")
    expect(r[62]).toBe("47")
    expect(r[64]).toBe("_w")
  })
  it("0 → edge", () => {
    const r = convertAll("0", 10)
    expect(r[2]).toBe("0")
    expect(r[52]).toBe("A")
    expect(r[58]).toBe("1")
    expect(r[62]).toBe("0")
    expect(r[64]).toBe("AA")
  })
  it("binary 11111111 from base2 → 255", () => {
    const r = convertAll("11111111", 2)
    expect(r[10]).toBe("255")
    expect(r[16]).toBe("FF")
  })
  it("hex FF from base16", () => {
    const r = convertAll("FF", 16)
    expect(r[10]).toBe("255")
  })
  it("base52 Ev → 255", () => {
    expect(base52ToDecimal("Ev")).toBe(255)
    expect(decimalToBase52(255)).toBe("Ev")
  })
  it("base58 5Q → 255", () => {
    expect(base58ToDecimal("5Q")).toBe(255)
    expect(decimalToBase58(255)).toBe("5Q")
  })
  it("base62 47 → 255", () => {
    expect(base62ToDecimal("47")).toBe(255)
    expect(decimalToBase62(255)).toBe("47")
  })
  it("base64 _w ↔ 255", () => {
    expect(base64ToDecimal("_w")).toBe(255)
    expect(decimalToBase64(255)).toBe("_w")
    expect(base64ToDecimal("AA")).toBe(0)
  })
  it("throws on invalid input for base", () => {
    expect(() => convertAll("2", 2)).toThrow() // "2" not valid in binary
    expect(() => convertAll("", 10)).toThrow()
    expect(() => base52ToDecimal("0")).toThrow() // 0 not in alphabet
  })
  it("large number 1000", () => {
    const r = convertAll("1000", 10)
    expect(r[2]).toBe((1000).toString(2))
    expect(r[16]).toBe("3E8")
  })
})
