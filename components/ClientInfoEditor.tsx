"use client"
import { useEffect, useState } from "react"

export default function ClientInfoEditor({ locale = "zh" }: { locale?: string }) {
  const [info, setInfo] = useState<[string, string][]>([])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  useEffect(() => {
    const rows: [string, string][] = []
    rows.push(["User-Agent", navigator.userAgent])
    rows.push([t("屏幕分辨率", "Screen", "Pantalla"), `${screen.width} × ${screen.height}`])
    rows.push([t("窗口大小", "Window", "Ventana"), `${innerWidth} × ${innerHeight}`])
    rows.push([t("像素比", "Device pixel ratio", "DPR"), String(devicePixelRatio)])
    rows.push([t("浏览器语言", "Language", "Idioma"), navigator.language])
    rows.push([t("语言列表", "Languages", "Idiomas"), navigator.languages?.join(", ") || "-"])
    rows.push([t("时区", "Timezone", "Zona horaria"), Intl.DateTimeFormat().resolvedOptions().timeZone || "-"])
    try { rows.push([t("本地时间", "Local time", "Hora local"), new Date().toLocaleString()]) } catch { /* noop */ }
    rows.push([t("Cookie 支持", "Cookies enabled", "Cookies"), navigator.cookieEnabled ? t("启用", "Enabled", "Sí") : t("禁用", "Disabled", "No")])
    rows.push([t("在线状态", "Online", "En línea"), navigator.onLine ? "✅" : "❌"])
    rows.push([t("CPU 线程数", "CPU threads", "Hilos CPU"), String(navigator.hardwareConcurrency ?? "-")])
    rows.push([t("内存(GB,约)", "Memory (GB, approx)", "Memoria"), String((navigator as any).deviceMemory ?? (navigator as any).deviceMemory === 0 ? (navigator as any).deviceMemory : "-")])
    if ("ontouchstart" in window) rows.push([t("触屏", "Touchscreen", "Táctil"), "✅"])
    setInfo(rows)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border rounded-xl overflow-hidden">
        {info.map(([k, v]) => (
          <div key={k} className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b last:border-0 gap-1">
            <span className="text-sm text-gray-500">{k}</span>
            <button onClick={() => navigator.clipboard.writeText(v)} className="text-sm font-mono break-all text-left hover:text-blue-600">{v} ⧉</button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">{t("以上信息由您的浏览器本地提供，未发送到任何服务器；点击行可复制", "Provided locally by your browser, never sent anywhere. Click a row to copy.", "Provisto localmente por su navegador. Clic para copiar.")}</p>
    </div>
  )
}
