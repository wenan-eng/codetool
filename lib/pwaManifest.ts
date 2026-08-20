/**
 * pwaManifest — PWA manifest helper
 * 提供 Manifest 类型、默认值、生成与校验
 */

export type ManifestIcon = {
  src: string
  sizes: string
  type?: string
  purpose?: string
}

export type PwaManifest = {
  name: string
  short_name: string
  description?: string
  start_url?: string
  scope?: string
  display?: "fullscreen" | "standalone" | "minimal-ui" | "browser"
  orientation?: "any" | "natural" | "landscape" | "portrait" | "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary"
  background_color?: string
  theme_color?: string
  icons: ManifestIcon[]
  lang?: string
  dir?: string
  categories?: string[]
  [key: string]: any
}

export const defaultManifest: PwaManifest = {
  name: "My App",
  short_name: "App",
  description: "An awesome PWA app",
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "any",
  background_color: "#ffffff",
  theme_color: "#0ea5e9",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
  ],
  lang: "zh-CN",
}

export function generateManifest(input: Partial<PwaManifest>): PwaManifest {
  const merged: PwaManifest = {
    ...defaultManifest,
    ...input,
    icons: input.icons !== undefined ? input.icons : defaultManifest.icons,
  }
  // normalize: trim strings, filter empty icons
  if (typeof merged.name === "string") merged.name = merged.name.trim()
  if (typeof merged.short_name === "string") merged.short_name = merged.short_name.trim()
  if (Array.isArray(merged.icons)) {
    merged.icons = merged.icons
      .filter((ic) => ic && typeof ic.src === "string" && ic.src.trim() && typeof ic.sizes === "string" && ic.sizes.trim())
      .map((ic) => ({
        src: ic.src.trim(),
        sizes: ic.sizes.trim(),
        type: ic.type?.trim() || "image/png",
        purpose: ic.purpose?.trim() || undefined,
      }))
      // remove undefined purpose
      .map((ic) => {
        const o: ManifestIcon = { src: ic.src, sizes: ic.sizes, type: ic.type }
        if (ic.purpose) o.purpose = ic.purpose
        return o
      })
  }
  return merged
}

export function stringifyManifest(manifest: PwaManifest, pretty = true): string {
  return JSON.stringify(manifest, null, pretty ? 2 : 0)
}

export function parseManifest(jsonStr: string): PwaManifest {
  if (!jsonStr || !jsonStr.trim()) throw new Error("请输入 manifest JSON")
  let parsed: any
  try { parsed = JSON.parse(jsonStr) } catch (e: any) { throw new Error("JSON解析失败: " + e.message) }
  return parsed as PwaManifest
}

export function validateManifest(m: Partial<PwaManifest>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!m.name || typeof m.name !== "string" || !m.name.trim()) errors.push("name 为必填")
  if (!m.short_name || typeof m.short_name !== "string" || !m.short_name.trim()) errors.push("short_name 为必填")
  if (!m.start_url || typeof m.start_url !== "string" || !m.start_url.trim()) errors.push("start_url 为必填")
  if (m.display && !["fullscreen", "standalone", "minimal-ui", "browser"].includes(m.display)) errors.push("display 值非法")
  if (m.theme_color && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(m.theme_color) && !/^rgba?\(/.test(m.theme_color)) {
    // allow hex or rgb? warn only if not hex and not empty
    // keep permissive: only warn if clearly not color-like
  }
  if (Array.isArray(m.icons)) {
    m.icons.forEach((ic, idx) => {
      if (!ic.src) errors.push(`icons[${idx}].src 为必填`)
      if (!ic.sizes) errors.push(`icons[${idx}].sizes 为必填 如 192x192`)
      else if (!/^\d+x\d+$/.test(ic.sizes)) errors.push(`icons[${idx}].sizes 格式应为 192x192`)
    })
  } else if (m.icons !== undefined) {
    errors.push("icons 应为数组")
  }
  return { valid: errors.length === 0, errors }
}

export default { defaultManifest, generateManifest, stringifyManifest, parseManifest, validateManifest }
