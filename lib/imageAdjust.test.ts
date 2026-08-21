import { describe, expect, it } from "vitest"
import { adjustPixels, sharpen, boxBlur, rgbToHsl, hslToRgb } from "./imageAdjust"

function solid(r: number, g: number, b: number): Uint8ClampedArray {
  return new Uint8ClampedArray([r, g, b, 255])
}

describe("hsl roundtrip", () => {
  it("红绿蓝往返", () => {
    for (const [r, g, b] of [[255, 0, 0], [0, 255, 0], [0, 0, 255], [128, 128, 128]]) {
      const [h, s, l] = rgbToHsl(r, g, b)
      const [rr, gg, bb] = hslToRgb(h, s, l)
      expect(Math.round(rr)).toBeCloseTo(r, 0)
      expect(Math.round(gg)).toBeCloseTo(g, 0)
      expect(Math.round(bb)).toBeCloseTo(b, 0)
    }
  })
})

describe("adjustPixels", () => {
  it("亮度提升", () => {
    const out = adjustPixels(solid(100, 100, 100), { brightness: 50 })
    expect(out[0]).toBe(150)
  })
  it("对比度增强", () => {
    const out = adjustPixels(solid(200, 200, 200), { contrast: 100 })
    expect(out[0]).toBe(255)
  })
  it("饱和度归零变灰", () => {
    const out = adjustPixels(solid(255, 0, 0), { saturation: -100 })
    expect(out[0]).toBe(out[1])
    expect(out[1]).toBe(out[2])
  })
  it("色相旋转 180 度红变青", () => {
    const out = adjustPixels(solid(255, 0, 0), { hue: 180 })
    expect(out[0]).toBeLessThan(64)
    expect(out[2]).toBeGreaterThan(191)
  })
  it("暖色调升红降蓝", () => {
    const out = adjustPixels(solid(100, 100, 100), { temperature: 50 })
    expect(out[0]).toBeGreaterThan(out[2])
  })
  it("高光提亮只作用亮部", () => {
    const bright = adjustPixels(solid(240, 240, 240), { highlight: 100 })
    const dark = adjustPixels(solid(20, 20, 20), { highlight: 100 })
    expect(bright[0]).toBe(255)
    expect(dark[0]).toBe(20)
  })
  it("淡化向白混合", () => {
    const out = adjustPixels(solid(0, 0, 0), { fade: 100 })
    expect(out[0]).toBe(255)
  })
})

describe("sharpen & blur", () => {
  it("锐化增强边缘", () => {
    const w = 3, h = 3
    const src = new Uint8ClampedArray([
      0,0,0,255, 0,0,0,255, 0,0,0,255,
      0,0,0,255, 200,200,200,255, 0,0,0,255,
      0,0,0,255, 0,0,0,255, 0,0,0,255,
    ])
    const out = sharpen(src, w, h, 50)
    expect(out[(1 * 3 + 1) * 4]).toBeGreaterThan(200)
  })
  it("模糊让极值趋近均值", () => {
    const w = 3, h = 1
    const src = new Uint8ClampedArray([255,255,255,255, 0,0,0,255, 0,0,0,255])
    const out = boxBlur(src, w, h, 1)
    expect(out[0]).toBeGreaterThan(0)
    expect(out[0]).toBeLessThan(255)
  })
})
