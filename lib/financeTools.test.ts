import { describe, expect, it } from "vitest"
import { equalPayment, equalPrincipal, bonusTax, roiMetrics } from "./financeTools"

describe("equalPayment", () => {
  it("等额本息月供", () => {
    const r = equalPayment(1000000, 4.25, 360)
    expect(r.monthly).toBeCloseTo(4919.40, 0)
    expect(r.totalInterest).toBeGreaterThan(700000)
  })
  it("零利率退化为本金均摊", () => {
    const r = equalPayment(120000, 0, 12)
    expect(r.monthly).toBeCloseTo(10000, 6)
  })
})

describe("equalPrincipal", () => {
  it("首月最高逐月递减", () => {
    const r = equalPrincipal(1000000, 4.25, 360)
    expect(r.firstMonth!).toBeGreaterThan(r.lastMonth!)
    expect(r.decreasingBy).toBeCloseTo(1000000 / 360 * (4.25 / 100 / 12), 4)
  })
  it("总利息低于等额本息", () => {
    expect(equalPrincipal(1000000, 4.25, 360).totalInterest).toBeLessThan(equalPayment(1000000, 4.25, 360).totalInterest)
  })
})

describe("bonusTax", () => {
  it("36000 元适用 3% 档", () => {
    const r = bonusTax(36000)
    expect(r.rate).toBe(0.03)
    expect(r.tax).toBeCloseTo(1080, 6)
  })
  it("144000 元跳档扣速算数", () => {
    const r = bonusTax(144000)
    expect(r.rate).toBe(0.10)
    expect(r.tax).toBeCloseTo(14190, 6)
  })
  it("非法金额报错", () => {
    expect(() => bonusTax(0)).toThrow(/大于 0/)
  })
})

describe("roiMetrics", () => {
  it("利润率与 ROI", () => {
    const r = roiMetrics(15000, 10000)
    expect(r.profit).toBe(5000)
    expect(r.marginPct).toBeCloseTo(33.33, 1)
    expect(r.roiPct).toBe(50)
  })
})
