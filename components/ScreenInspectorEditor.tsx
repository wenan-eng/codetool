"use client"
import { useState, useEffect, useCallback } from "react"
import {
  getScreenInfo,
  getPixelRatioLabel,
  getViewportCategoryLabel,
  type ScreenInfo,
} from "@/lib/screenInspector"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

export default function ScreenInspectorEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const s = dict.screenInspector || {}
  const fallback = dict.editor || {}

  const t = {
    refresh: s.refresh || (locale === "en" ? "Refresh" : locale === "es" ? "Actualizar" : "刷新"),
    copy: s.copy || fallback.copy || "复制结果",
    copyJson: s.copyJson || (locale === "en" ? "Copy JSON" : locale === "es" ? "Copiar JSON" : "复制 JSON"),
    copied: s.copied || fallback.copied || "已复制",
    localNote: s.localNote || fallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    live: s.live || (locale === "en" ? "Live" : locale === "es" ? "En vivo" : "实时"),
    titleScreen: s.titleScreen || (locale === "en" ? "Screen" : locale === "es" ? "Pantalla" : "屏幕"),
    titleViewport: s.titleViewport || (locale === "en" ? "Viewport & Window" : locale === "es" ? "Ventana y viewport" : "视口与窗口"),
    titleSystem: s.titleSystem || (locale === "en" ? "Display & System" : locale === "es" ? "Visualización y sistema" : "显示与系统"),
    screenRes: s.screenRes || (locale === "en" ? "Screen Resolution" : locale === "es" ? "Resolución de pantalla" : "屏幕分辨率"),
    availRes: s.availRes || (locale === "en" ? "Available Area" : locale === "es" ? "Área disponible" : "可用区域"),
    viewportRes: s.viewportRes || (locale === "en" ? "Viewport" : locale === "es" ? "Viewport" : "视口大小"),
    outerRes: s.outerRes || (locale === "en" ? "Window Outer" : locale === "es" ? "Ventana exterior" : "窗口外部"),
    colorDepth: s.colorDepth || (locale === "en" ? "Color Depth" : locale === "es" ? "Profundidad de color" : "颜色深度"),
    pixelDepth: s.pixelDepth || (locale === "en" ? "Pixel Depth" : locale === "es" ? "Profundidad de píxel" : "像素深度"),
    dpr: s.dpr || "DevicePixelRatio",
    orientation: s.orientation || (locale === "en" ? "Orientation" : locale === "es" ? "Orientación" : "屏幕方向"),
    angle: s.angle || (locale === "en" ? "Angle" : locale === "es" ? "Ángulo" : "旋转角度"),
    aspect: s.aspect || (locale === "en" ? "Aspect Ratio" : locale === "es" ? "Relación de aspecto" : "宽高比"),
    megapixels: s.megapixels || (locale === "en" ? "Megapixels" : locale === "es" ? "Megapíxeles" : "总像素"),
    category: s.category || (locale === "en" ? "Breakpoint" : locale === "es" ? "Categoría" : "断点分类"),
    width: s.width || (locale === "en" ? "Width" : locale === "es" ? "Ancho" : "宽度"),
    height: s.height || (locale === "en" ? "Height" : locale === "es" ? "Alto" : "高度"),
    copyValue: s.copyValue || (locale === "en" ? "Copy" : locale === "es" ? "Copiar" : "复制"),
    autoUpdate: s.autoUpdate || (locale === "en" ? "Auto update on resize" : locale === "es" ? "Actualización automática al redimensionar" : "窗口变化时自动更新"),
  }

  const [info, setInfo] = useState<ScreenInfo | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => {
    const data = getScreenInfo()
    setInfo(data)
    setTick((v) => v + 1)
  }, [])

  useEffect(() => {
    refresh()
    const handler = () => refresh()
    window.addEventListener("resize", handler)
    window.addEventListener("orientationchange", handler)
    // media query for orientation/dpr changes
    const mql = window.matchMedia?.("(orientation: portrait)")
    mql?.addEventListener?.("change", handler)
    return () => {
      window.removeEventListener("resize", handler)
      window.removeEventListener("orientationchange", handler)
      mql?.removeEventListener?.("change", handler)
    }
  }, [refresh])

  const handleCopy = async (val: string, which: "cell" | "json") => {
    await navigator.clipboard.writeText(val)
    if (which === "json") {
      setCopiedJson(true)
      setTimeout(() => setCopiedJson(false), 1200)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  const jsonStr = info ? JSON.stringify(info, null, 2) : ""

  // 简易可视化比例：viewport 占 screen 的比例条
  const viewportRatio = info ? Math.min(100, Math.round((info.viewportWidth / Math.max(1, info.screenWidth)) * 100)) : 0

  if (!info) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-sm text-gray-500">
        {locale === "en" ? "No screen info available (SSR)" : locale === "es" ? "Información no disponible" : "暂无屏幕信息（仅客户端可用）"}
      </div>
    )
  }

  const Card = ({
    title,
    items,
  }: {
    title: string
    items: { label: string; value: string; sub?: string }[]
  }) => (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="font-medium text-sm">{title}</div>
        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">{t.live}</span>
      </div>
      <div className="divide-y">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">{it.label}</div>
              <div className="font-mono text-sm font-medium truncate">{it.value}</div>
              {it.sub && <div className="text-[11px] text-gray-400 truncate">{it.sub}</div>}
            </div>
            <button
              onClick={() => handleCopy(it.value, "cell")}
              className="shrink-0 px-2 py-1 text-[11px] border rounded hover:bg-gray-50"
            >
              {copied ? t.copied : t.copyValue}
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* 顶部操作 */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <button onClick={refresh} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              {t.refresh}
            </button>
            <button
              onClick={() => handleCopy(jsonStr, "json")}
              className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
            >
              {copiedJson ? t.copied : t.copyJson}
            </button>
          </div>
          <div className="text-xs text-gray-400">{t.autoUpdate} · {new Date().toLocaleTimeString()}</div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Viewport / Screen {viewportRatio}%</span>
            <span>
              {info.viewportResolution} / {info.screenResolution}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${viewportRatio}%` }} />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">{t.localNote}</div>
      </div>

      {/* 三栏 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card
          title={t.titleScreen}
          items={[
            { label: t.screenRes, value: info.screenResolution, sub: `${info.screenWidth} × ${info.screenHeight} · ${info.aspectRatio} · ${info.megapixels}` },
            { label: t.availRes, value: info.availResolution, sub: `${t.width} ${info.availWidth} · ${t.height} ${info.availHeight}` },
            { label: t.aspect, value: info.aspectRatio, sub: t.megapixels + " " + info.megapixels },
            { label: t.category, value: getViewportCategoryLabel(info.viewportWidth, locale), sub: info.viewportCategory },
          ]}
        />
        <Card
          title={t.titleViewport}
          items={[
            { label: t.viewportRes, value: info.viewportResolution, sub: `inner ${info.viewportWidth} × ${info.viewportHeight}` },
            { label: t.outerRes, value: `${info.outerWidth} × ${info.outerHeight}`, sub: `outerWidth × outerHeight` },
            { label: t.dpr, value: String(info.devicePixelRatio), sub: getPixelRatioLabel(info.devicePixelRatio) },
            { label: t.orientation + " / " + t.angle, value: `${info.orientationType}`, sub: `${info.orientationAngle}°` },
          ]}
        />
        <Card
          title={t.titleSystem}
          items={[
            { label: t.colorDepth, value: `${info.colorDepth}-bit`, sub: info.colorDepthLabel },
            { label: t.pixelDepth, value: `${info.pixelDepth}-bit`, sub: getViewportCategoryLabel(info.viewportWidth, locale) === info.colorDepthLabel ? "" : getPixelRatioLabel(info.devicePixelRatio) },
            { label: "screen.width / height", value: `${info.screenWidth} / ${info.screenHeight}`, sub: "window.screen" },
            { label: "pixelCount", value: `${info.pixelCount.toLocaleString()}`, sub: info.megapixels },
          ]}
        />
      </div>

      {/* JSON 预览 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <div className="text-sm font-medium">JSON</div>
          <span className="text-[10px] text-gray-400">getScreenInfo() · tick {tick}</span>
        </div>
        <pre className="p-4 text-xs font-mono bg-gray-50 overflow-x-auto max-h-[360px]">{jsonStr}</pre>
      </div>

      {/* 小表格全量 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b font-medium text-sm">Details</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-2">Key</th>
                <th className="text-left px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(info).map(([k, v]) => (
                <tr key={k} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs text-gray-600">{k}</td>
                  <td className="px-4 py-2 font-mono text-xs">{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
