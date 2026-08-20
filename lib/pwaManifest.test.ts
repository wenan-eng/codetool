import { describe, it, expect } from "vitest"
import { generateManifest, validateManifest, stringifyManifest, parseManifest, defaultManifest } from "./pwaManifest"

describe("pwaManifest", () => {
  it("generateManifest merges defaults and custom fields", () => {
    const m = generateManifest({ name: "Test App", short_name: "Test", theme_color: "#ff0000" })
    expect(m.name).toBe("Test App")
    expect(m.short_name).toBe("Test")
    expect(m.theme_color).toBe("#ff0000")
    expect(m.display).toBe(defaultManifest.display)
    expect(m.icons.length).toBeGreaterThan(0)
  })

  it("stringify and parse roundtrip", () => {
    const m = generateManifest({ name: "Demo", short_name: "Demo", description: "hi" })
    const json = stringifyManifest(m)
    expect(json).toContain('"name": "Demo"')
    const parsed = parseManifest(json)
    expect(parsed.name).toBe("Demo")
    expect(parsed.short_name).toBe("Demo")
  })

  it("validateManifest detects missing required fields", () => {
    const { valid, errors } = validateManifest({ name: "", short_name: "", start_url: "" } as any)
    expect(valid).toBe(false)
    expect(errors.length).toBeGreaterThanOrEqual(3)
    expect(errors.join(",")).toContain("name")
    expect(errors.join(",")).toContain("short_name")
  })

  it("validateManifest accepts correct manifest", () => {
    const m = generateManifest({ name: "Good", short_name: "Good", start_url: "/", icons: [{ src: "/a.png", sizes: "192x192", type: "image/png" }] })
    const res = validateManifest(m)
    expect(res.valid).toBe(true)
    expect(res.errors).toEqual([])
  })

  it("generateManifest filters empty icons and handles custom icons", () => {
    const m = generateManifest({
      name: "X",
      short_name: "X",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: " ", sizes: " ", type: "image/png" } as any,
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    })
    expect(m.icons.length).toBe(2)
    expect(m.icons[0].src).toBe("/icon-192.png")
    expect(m.icons[1].purpose).toBe("maskable")
    // invalid sizes -> validate should catch
    const bad = validateManifest({ name: "A", short_name: "A", start_url: "/", icons: [{ src: "/a.png", sizes: "bad", type: "image/png" }] })
    expect(bad.valid).toBe(false)
    expect(bad.errors.some(e => e.includes("sizes"))).toBe(true)
  })
})
