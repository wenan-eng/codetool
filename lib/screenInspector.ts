/**
 * screen-inspector — 屏幕信息检测工具
 * 纯函数 + client 端 getScreenInfo 封装
 * 所有读取 window/screen 的逻辑集中在 getScreenInfo，避免 SSR 报错
 */

export interface ScreenInfo {
  screenWidth: number
  screenHeight: number
  availWidth: number
  availHeight: number
  colorDepth: number
  pixelDepth: number
  viewportWidth: number
  viewportHeight: number
  outerWidth: number
  outerHeight: number
  devicePixelRatio: number
  orientationType: string
  orientationAngle: number
  screenResolution: string
  viewportResolution: string
  availResolution: string
  aspectRatio: string
  megapixels: string
  colorDepthLabel: string
  viewportCategory: string
  pixelCount: number
}

// ---------- 纯函数 helpers (便于单测) ----------

/** 格式化分辨率，如 1920 × 1080 */
export function formatResolution(width: number, height: number): string {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return "—"
  if (width <= 0 || height <= 0) return "—"
  return `${Math.round(width)} × ${Math.round(height)}`
}

/** gcd 求最大公约数 */
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

/** 计算宽高比，如 16:9。宽高为 0 时返回 "—" */
export function getAspectRatio(width: number, height: number): string {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return "—"
  if (width <= 0 || height <= 0) return "—"
  const w = Math.round(width)
  const h = Math.round(height)
  const g = gcd(w, h)
  const rw = w / g
  const rh = h / g
  // 过于极端的比值保持原值，大于 21:9 仍展示计算结果
  return `${rw}:${rh}`
}

/** 颜色深度标签 */
export function getColorDepthLabel(depth: number): string {
  if (!Number.isFinite(depth)) return "未知"
  switch (depth) {
    case 1:
      return "1-bit 单色"
    case 2:
      return "2-bit 4色"
    case 4:
      return "4-bit 16色"
    case 8:
      return "8-bit 256色"
    case 16:
      return "16-bit High Color"
    case 24:
      return "24-bit True Color"
    case 30:
      return "30-bit Deep Color"
    case 32:
      return "32-bit True Color (含透明)"
    case 48:
      return "48-bit Deep Color"
    default:
      if (depth < 1) return `${depth}-bit 未知`
      return `${depth}-bit`
  }
}

/** 视口断点分类 */
export function getViewportCategory(width: number): string {
  if (!Number.isFinite(width)) return "unknown"
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

/** 中文断点标签 */
export function getViewportCategoryLabel(width: number, locale: string = "zh"): string {
  const cat = getViewportCategory(width)
  if (locale === "en") {
    if (cat === "mobile") return "Mobile"
    if (cat === "tablet") return "Tablet"
    return "Desktop"
  }
  if (locale === "es") {
    if (cat === "mobile") return "Móvil"
    if (cat === "tablet") return "Tableta"
    return "Escritorio"
  }
  if (cat === "mobile") return "移动端"
  if (cat === "tablet") return "平板"
  return "桌面端"
}

/** 像素总数 */
export function getPixelCount(width: number, height: number): number {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return 0
  if (width <= 0 || height <= 0) return 0
  return Math.round(width) * Math.round(height)
}

/** 百万像素，如 2.07 MP */
export function getMegapixels(width: number, height: number): string {
  const count = getPixelCount(width, height)
  if (count === 0) return "—"
  return `${(count / 1_000_000).toFixed(2)} MP`
}

/** 设备像素比标签 */
export function getPixelRatioLabel(dpr: number): string {
  if (!Number.isFinite(dpr) || dpr <= 0) return "—"
  if (dpr === 1) return "1× 标准"
  if (dpr === 2) return "2× Retina"
  if (dpr === 3) return "3× Super Retina"
  return `${dpr}×`
}

// ---------- client 端读取 ----------

/**
 * 读取屏幕/视口信息，SSR 时返回 null
 * 需在 useEffect 中调用以保证实时性
 */
export function getScreenInfo(): ScreenInfo | null {
  if (typeof window === "undefined" || typeof window.screen === "undefined") return null

  const s = window.screen
  const viewportWidth = window.innerWidth || document.documentElement?.clientWidth || 0
  const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 0
  const outerWidth = (window as any).outerWidth ?? viewportWidth
  const outerHeight = (window as any).outerHeight ?? viewportHeight
  const devicePixelRatio = window.devicePixelRatio || 1

  // orientation：优先 screen.orientation，其次 window.orientation
  let orientationType = "unknown"
  let orientationAngle = 0
  try {
    const ori: any = (s as any).orientation || (window as any).screen?.orientation
    if (ori) {
      orientationType = ori.type || (viewportWidth > viewportHeight ? "landscape-primary" : "portrait-primary")
      orientationAngle = typeof ori.angle === "number" ? ori.angle : Number(ori.angle) || 0
    } else if (typeof (window as any).orientation === "number") {
      orientationAngle = (window as any).orientation
      orientationType = Math.abs(orientationAngle) === 90 ? "landscape-primary" : "portrait-primary"
    } else {
      orientationType = viewportWidth > viewportHeight ? "landscape-primary" : "portrait-primary"
      orientationAngle = viewportWidth > viewportHeight ? 90 : 0
    }
  } catch {
    orientationType = viewportWidth > viewportHeight ? "landscape-primary" : "portrait-primary"
  }

  const screenWidth = s.width || 0
  const screenHeight = s.height || 0
  const availWidth = s.availWidth || screenWidth
  const availHeight = s.availHeight || screenHeight
  const colorDepth = s.colorDepth || 24
  const pixelDepth = s.pixelDepth ?? colorDepth

  return {
    screenWidth,
    screenHeight,
    availWidth,
    availHeight,
    colorDepth,
    pixelDepth,
    viewportWidth,
    viewportHeight,
    outerWidth,
    outerHeight,
    devicePixelRatio,
    orientationType,
    orientationAngle,
    screenResolution: formatResolution(screenWidth, screenHeight),
    viewportResolution: formatResolution(viewportWidth, viewportHeight),
    availResolution: formatResolution(availWidth, availHeight),
    aspectRatio: getAspectRatio(screenWidth, screenHeight),
    megapixels: getMegapixels(screenWidth, screenHeight),
    colorDepthLabel: getColorDepthLabel(colorDepth),
    viewportCategory: getViewportCategory(viewportWidth),
    pixelCount: getPixelCount(screenWidth, screenHeight),
  }
}

export default {
  getScreenInfo,
  formatResolution,
  getAspectRatio,
  getColorDepthLabel,
  getViewportCategory,
  getViewportCategoryLabel,
  getPixelCount,
  getMegapixels,
  getPixelRatioLabel,
}
