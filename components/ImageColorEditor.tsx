"use client"
import { useEffect, useRef, useState } from "react"

export default function ImageColorEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [palette, setPalette] = useState<{ hex: string; pct: number }[]>([])
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const extract = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scale = Math.min(1, 200 / Math.max(canvas.width, canvas.height))
    const w = Math.max(1, Math.round(canvas.width * scale))
    const h = Math.max(1, Math.round(canvas.height * scale))
    const tmp = document.createElement("canvas")
    tmp.width = w; tmp.height = h
    const ctx = tmp.getContext("2d")
    if (!ctx) return
    ctx.drawImage(imgRef.current!, 0, 0, w, h)
    const data = ctx.getImageData(0, 0, w, h).data
    const buckets = new Map<string, { count: number; r: number; g: number; b: number }>()
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2]
      const key = `${r >> 4}-${g >> 4}-${b >> 4}`
      const cur = buckets.get(key)
      if (cur) { cur.count++; cur.r += r; cur.g += g; cur.b += b }
      else buckets.set(key, { count: 1, r, g, b })
    }
    const sorted = [...buckets.values()].sort((a, b2) => b2.count - a.count).slice(0, 8)
    const total = w * h
    setPalette(sorted.map(s => {
      const hex = `#${[s.r / s.count, s.g / s.count, s.b / s.count].map(v => Math.round(v).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
      return { hex, pct: Math.round((s.count / total) * 1000) / 10 }
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🎨 {t("上传图片提取主色配色方案（本地处理）", "Upload an image to extract its palette (local)", "Suba una imagen para extraer su paleta (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { const img = new Image(); img.onload = () => { imgRef.current = img; setPalette([]); setImgUrl(String(reader.result || "")); setTimeout(() => { const c = canvasRef.current; if (c) { c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext("2d")?.drawImage(img, 0, 0) } }, 50) }; img.src = String(reader.result || "") }; reader.readAsDataURL(f) } }} />
      </label>
      {imgUrl && (
        <>
          <div className="bg-white border rounded-xl p-2"><img ref={imgRef} src={imgUrl} alt="" className="max-h-56 mx-auto object-contain hidden" /><canvas ref={canvasRef} className="max-h-56 mx-auto object-contain max-w-full rounded" /></div>
          <button onClick={extract} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">🎨 {t("提取配色", "Extract Palette", "Extraer paleta")}</button>
          {palette.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {palette.map(p => (
                <button key={p.hex} onClick={() => navigator.clipboard.writeText(p.hex)} className="flex flex-col items-center gap-1 group">
                  <div className="w-full aspect-square rounded-lg border" style={{ backgroundColor: p.hex }} />
                  <span className="text-xs font-mono group-hover:text-blue-600">{p.hex}</span>
                  <span className="text-xs text-gray-400">{p.pct}%</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally.", "Todo local.")}</p>
    </div>
  )
}
