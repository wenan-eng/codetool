"use client"
import { useState } from "react"

export default function ShortcutEditor({ locale = "zh" }: { locale?: string }) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("https://")
  const [done, setDone] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const create = () => {
    const content = `[InternetShortcut]\nURL=${url.trim()}\nIconIndex=0\n`
    const blob = new Blob([content], { type: "application/internet-shortcut" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${(name.trim() || "shortcut").replace(/[\\/:*?"<>|]/g, "_")}.url`
    a.click()
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("快捷方式名称", "Shortcut name", "Nombre")}</span><input value={name} onChange={e => setName(e.target.value)} placeholder={t("如：工具箱", "e.g. Toolbox", "p. ej. Herramientas")} className="p-3 border rounded-xl text-sm" /></label>
      <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">URL</span><input value={url} onChange={e => setUrl(e.target.value)} className="p-3 border rounded-xl font-mono text-sm" /></label>
      <button onClick={create} disabled={!url.trim() || !/^https?:\/\//i.test(url.trim())} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
        {done ? `✅ ${t("已下载", "Downloaded", "Descargado")}` : t("下载 .url 快捷方式", "Download .url file", "Descargar .url")}
      </button>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
        {t("使用方法：下载后将 .url 文件放到桌面，双击即可用默认浏览器打开该网址（Windows/macOS 通用）。所有操作均在本地完成。", "Place the .url file on your desktop and double-click to open in the default browser (Windows/macOS). All local.", "Coloque el .url en el escritorio y ábralo con doble clic. Todo local.")}
      </div>
    </div>
  )
}
