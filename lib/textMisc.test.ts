import { describe, expect, it } from "vitest"
import { convertUnit } from "./unitConverter"
import { cssConvert, baseConvert, shoeConvert, rmbUpper, bloodPossibilities } from "./textMisc"

describe("wind & bandwidth", () => {
  it("风速：km/h 转 m/s", () => {
    expect(convertUnit("wind", 36, "km/h", "m/s")).toBeCloseTo(10, 10)
  })
  it("带宽：Mbps 转 MB/s（8倍关系）", () => {
    expect(convertUnit("bandwidth", 8, "Mbps", "MB/s")).toBeCloseTo(1, 10)
  })
})

describe("css units", () => {
  it("rem 与 px 双向（root 16）", () => {
    expect(cssConvert(2, "rem", "px")).toBe(32)
    expect(cssConvert(32, "px", "rem")).toBe(2)
  })
  it("pt 转 px", () => {
    expect(cssConvert(12, "pt", "px")).toBeCloseTo(16, 10)
  })
  it("百分比转 px", () => {
    expect(cssConvert(50, "%", "px")).toBe(8)
  })
})

describe("base converter", () => {
  it("二进制转十进制", () => {
    expect(baseConvert("1010", 2, 10)).toBe("10")
  })
  it("十六进制转二进制", () => {
    expect(baseConvert("0xFF", 16, 2)).toBe("11111111")
  })
  it("大数 BigInt 精度", () => {
    expect(baseConvert("ffffffffffffffff", 16, 10)).toBe("18446744073709551615")
  })
  it("非法字符报错", () => {
    expect(() => baseConvert("129", 2, 10)).toThrow(/有效数字/)
  })
})

describe("shoe size", () => {
  it("按 EU 查表返回中国码", () => {
    expect(shoeConvert("42", "eu")).toBe("42")
  })
  it("按 cm 查表", () => {
    expect(shoeConvert("26", "cm")).toBe("42")
  })
})

describe("rmb upper", () => {
  it("整数金额", () => {
    expect(rmbUpper(100)).toBe("壹佰元整")
    expect(rmbUpper(1234)).toBe("壹仟贰佰叁拾肆元整")
  })
  it("带角分", () => {
    expect(rmbUpper(1.23)).toBe("壹元贰角叁分")
    expect(rmbUpper(0.05)).toBe("伍分")
  })
  it("中间补零", () => {
    expect(rmbUpper(105)).toBe("壹佰零伍元整")
    expect(rmbUpper(10050)).toBe("壹万零伍拾元整")
  })
  it("零元", () => {
    expect(rmbUpper(0)).toBe("零元整")
  })
})

describe("blood type", () => {
  it("A+B 全可能", () => {
    expect(bloodPossibilities("A", "B")).toEqual(["A", "B", "AB", "O"])
  })
  it("O+O 只能 O", () => {
    expect(bloodPossibilities("O", "O")).toEqual(["O"])
  })
  it("顺序无关", () => {
    expect(bloodPossibilities("B", "A")).toEqual(["A", "B", "AB", "O"])
  })
})
