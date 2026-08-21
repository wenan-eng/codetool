"use client"
import { useState } from "react"

const DEVICES: { name: string; w: number; h: number }[] = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 15 Pro", w: 393, h: 852 },
  { name: "iPad Mini", w: 768, h: 1024 },
  { name: "iPad Pro", w: 1024, h: 1366 },
  { name: "Laptop", w: 1366, h: 768 },
  { name: "Desktop", w: 1920, h: 1080 },
]

export default function DevicePreviewEditor({ locale = "zh" }: { locale?: string }) {
  const [url, setUrl] = useState("")
  const [loaded, setLoaded] = useState("")
  const [device, setDevice] = useState(DEVICES[1])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const open = () => {
    if (!url.trim()) return
    setLoaded(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://codetool.site" className="flex-1 p-3 border rounded-xl font-mono text-sm" onKeyDown={e => { if (e.key === "Enter") open() }} />
        <button onClick={open} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{t("加载预览", "Load Preview", "Cargar vista")}</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {DEVICES.map(d => (
          <button key={d.name} onClick={() => setDevice(d)} className={`px-3 py-1.5 rounded-lg text-xs ${device.name === d.name ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {d.name} ({d.w}×{d.h})
          </button>
        ))}
      </div>
      {loaded ? (
        <div className="self-center border-4 border-gray-800 rounded-2xl overflow-hidden bg-white shadow-lg transition-all" style={{ width: Math.min(device.w, 640), height: Math.min(device.h, 720) }}>
          <iframe src={loaded} title="preview" className="w-full h-full" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-sm text-gray-400">{t("输入网址后点击加载预览", "Enter a URL and click Load Preview", "Introduzca una URL y cargue la vista")}</div>
      )}
      <p className="text-xs text-gray-400">{t("预览通过 iframe 加载，部分设置 X-Frame-Options 的站点可能拒绝显示；所有操作本地完成", "Preview loads via iframe; sites with X-Frame-Options may refuse. All local.", "Vista vía iframe; algunos sitios pueden rechazar. Todo local.")}</p>
    </div>
  )
}
