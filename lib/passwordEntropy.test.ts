import { describe, it, expect } from "vitest"
import { calculateEntropy } from "./passwordEntropy"

describe("passwordEntropy", () => {
  it("known vector abc equals about 14.1 bits", () => {
    const r = calculateEntropy("abc")
    expect(r.length).toBe(3)
    expect(r.poolSize).toBe(26)
    expect(r.entropyBits).toBeCloseTo(14.1, 1)
    expect(r.combinations).toBe(Math.pow(2, r.entropyBits).toExponential(2))
  })
  it("full ascii pool of 95 for mixed charset", () => {
    const r = calculateEntropy("aZ9!")
    expect(r.poolSize).toBe(95)
    expect(r.entropyBits).toBeCloseTo(4 * Math.log2(95), 10)
  })
  it("digits and uppercase pool of 36", () => {
    const r = calculateEntropy("ABC123")
    expect(r.poolSize).toBe(36)
    expect(r.entropyBits).toBeCloseTo(6 * Math.log2(36), 10)
    expect(r.strength).toBe("一般")
  })
  it("unicode chars counted individually by occurrence", () => {
    const r = calculateEntropy("你好")
    expect(r.length).toBe(2)
    expect(r.poolSize).toBe(2)
    expect(r.entropyBits).toBeCloseTo(2, 10)
  })
  it("mixed unicode with ascii adds distinct extras", () => {
    const r = calculateEntropy("a你")
    expect(r.poolSize).toBe(27)
    expect(r.entropyBits).toBeCloseTo(2 * Math.log2(27), 10)
  })
  it("empty password returns zeros", () => {
    const r = calculateEntropy("")
    expect(r.length).toBe(0)
    expect(r.poolSize).toBe(0)
    expect(r.entropyBits).toBe(0)
    expect(r.strength).toBe("弱")
  })
  it("strength ratings follow thresholds", () => {
    expect(calculateEntropy("abc").strength).toBe("弱")
    expect(calculateEntropy("abcdefg").strength).toBe("一般")
    expect(calculateEntropy("password").strength).toBe("强")
    expect(calculateEntropy("Str0ng!Passw0rd!her").strength).toBe("很强")
    expect(calculateEntropy("Str0ng!Passw0rd!here").strength).toBe("极强")
  })
  it("boundary at exactly 128 bits is 极强", () => {
    const r = calculateEntropy("aZ9!aZ9!aZ9!aZ9!aZ9!")
    expect(r.entropyBits).toBeGreaterThan(128)
    expect(r.strength).toBe("极强")
    expect(calculateEntropy("Str0ng!Passw0rd!her").strength).toBe("很强")
  })
})
