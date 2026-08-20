import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  formatResolution,
  getAspectRatio,
  getColorDepthLabel,
  getViewportCategory,
  getViewportCategoryLabel,
  getPixelCount,
  getMegapixels,
  getPixelRatioLabel,
  getScreenInfo,
} from "./screenInspector"

describe("screenInspector helpers", () => {
  it("formatResolution formats width×height", () => {
    expect(formatResolution(1920, 1080)).toBe("1920 × 1080")
    expect(formatResolution(0, 1080)).toBe("—")
    expect(formatResolution(NaN, 1080)).toBe("—")
    expect(formatResolution(2560.7, 1440.2)).toBe("2561 × 1440")
  })

  it("getAspectRatio computes simplified ratio", () => {
    expect(getAspectRatio(1920, 1080)).toBe("16:9")
    expect(getAspectRatio(2560, 1440)).toBe("16:9")
    expect(getAspectRatio(1024, 768)).toBe("4:3")
    expect(getAspectRatio(0, 1080)).toBe("—")
    expect(getAspectRatio(1920, 1200)).toBe("8:5")
    expect(getAspectRatio(3440, 1440)).toBe("43:18")
  })

  it("getColorDepthLabel returns human readable", () => {
    expect(getColorDepthLabel(24)).toBe("24-bit True Color")
    expect(getColorDepthLabel(32)).toBe("32-bit True Color (含透明)")
    expect(getColorDepthLabel(16)).toBe("16-bit High Color")
    expect(getColorDepthLabel(30)).toBe("30-bit Deep Color")
    expect(getColorDepthLabel(99)).toBe("99-bit")
    expect(getColorDepthLabel(NaN)).toBe("未知")
  })

  it("getViewportCategory classifies width", () => {
    expect(getViewportCategory(375)).toBe("mobile")
    expect(getViewportCategory(767)).toBe("mobile")
    expect(getViewportCategory(768)).toBe("tablet")
    expect(getViewportCategory(1023)).toBe("tablet")
    expect(getViewportCategory(1024)).toBe("desktop")
    expect(getViewportCategory(1920)).toBe("desktop")
  })

  it("getViewportCategoryLabel locale aware", () => {
    expect(getViewportCategoryLabel(375, "zh")).toBe("移动端")
    expect(getViewportCategoryLabel(800, "zh")).toBe("平板")
    expect(getViewportCategoryLabel(1280, "zh")).toBe("桌面端")
    expect(getViewportCategoryLabel(375, "en")).toBe("Mobile")
    expect(getViewportCategoryLabel(1280, "en")).toBe("Desktop")
    expect(getViewportCategoryLabel(375, "es")).toBe("Móvil")
  })

  it("getPixelCount and getMegapixels", () => {
    expect(getPixelCount(1920, 1080)).toBe(2073600)
    expect(getPixelCount(0, 1080)).toBe(0)
    expect(getMegapixels(1920, 1080)).toBe("2.07 MP")
    expect(getMegapixels(3840, 2160)).toBe("8.29 MP")
    expect(getMegapixels(0, 0)).toBe("—")
  })

  it("getPixelRatioLabel labels DPR", () => {
    expect(getPixelRatioLabel(1)).toBe("1× 标准")
    expect(getPixelRatioLabel(2)).toBe("2× Retina")
    expect(getPixelRatioLabel(3)).toBe("3× Super Retina")
    expect(getPixelRatioLabel(1.5)).toBe("1.5×")
    expect(getPixelRatioLabel(0)).toBe("—")
    expect(getPixelRatioLabel(NaN)).toBe("—")
  })

  it("getScreenInfo reads window.screen (mocked) and returns structured info", () => {
    const originalWindow = (global as any).window
    const originalDocument = (global as any).document

    ;(global as any).window = {
      screen: {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1050,
        colorDepth: 24,
        pixelDepth: 24,
        orientation: { type: "landscape-primary", angle: 0 },
      },
      innerWidth: 1280,
      innerHeight: 720,
      outerWidth: 1300,
      outerHeight: 800,
      devicePixelRatio: 2,
    }
    ;(global as any).document = {
      documentElement: { clientWidth: 1280, clientHeight: 720 },
    }

    const info = getScreenInfo()
    expect(info).not.toBeNull()
    expect(info!.screenResolution).toBe("1920 × 1080")
    expect(info!.viewportResolution).toBe("1280 × 720")
    expect(info!.availResolution).toBe("1920 × 1050")
    expect(info!.aspectRatio).toBe("16:9")
    expect(info!.colorDepthLabel).toBe("24-bit True Color")
    expect(info!.devicePixelRatio).toBe(2)
    expect(info!.orientationType).toBe("landscape-primary")
    expect(info!.orientationAngle).toBe(0)

    ;(global as any).window = originalWindow
    ;(global as any).document = originalDocument
  })

  it("getScreenInfo returns null on SSR (no window)", () => {
    const originalWindow = (global as any).window
    // @ts-ignore
    delete (global as any).window
    expect(getScreenInfo()).toBeNull()
    ;(global as any).window = originalWindow
  })
})
