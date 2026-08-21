"use client"
import { useRef, useState } from "react"

export default function PlaceholderEditor({ locale = "zh" }: { locale?: string }) {
  const [w, setW] = useState(400)
  const [h, setH] = useState(300)
  const [bg, setBg] = useState("#3B82F6")
  const [fg, setFg] = useState("#FFFFFF")
  const [label, setLabel] = useState("")
  const [url, setUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const generate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const width = Math.max(1, Math.min(w, 4000))
    const height = Math.max(1, Math.min(h, 4000))
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = fg
    ctx.globalAlpha = 0.35
    ctx.beginPath()
    ctx.moveTo(0, 0); ctx.lineTo(width, height)
    ctx.moveTo(width, 0); ctx.lineTo(0, height)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.fillStyle = fg
    const fontSize = Math.max(12, Math.round(Math.min(width, height) / 10))
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(label.trim() || `${width} × ${height}`, width / 2, height / 2)
    setUrl(canvas.toDataURL("image/png"))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("宽度", "Width", "Ancho")}</span><input type="number" value={w} onChange={e => setW(Number(e.target.value) || 1)} className="p-2.5 border rounded-lg" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("高度", "Height", "Alto")}</span><input type="number" value={h} onChange={e => setH(Number(e.target.value) || 1)} className="p-2.5 border rounded-lg" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("背景色", "Background", "Fondo")}</span><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="p-1 h-[42px] border rounded-lg" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("文字色", "Text color", "Texto")}</span><input type="color" value={fg} onChange={e => setFg(e.target.value)} className="p-1 h-[42px] border rounded-lg" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("自定义文字", "Custom text", "Texto")}</span><input value={label} onChange={e => setLabel(e.target.value)} placeholder={t("留空显示尺寸", "Empty = size", "Vacío = tamaño")} className="p-2.5 border rounded-lg" /></label>
      </div>
      <button onClick={generate} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">🎨 {t("生成占位图", "Generate", "Generar")}</button>
      {url && (
        <>
          <div className="bg-white border rounded-xl p-3 max-w-md"><img src={url} alt="" className="w-full h-auto rounded" /></div>
          <div className="flex gap-3">
            <a href={url} download={`placeholder-${Math.min(w,4000)}x${Math.min(h,4000)}.png`} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t("下载 PNG", "Download PNG", "Descargar PNG")}</a>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally.", "Todo local.")}</p>
    </div>
  )
}
