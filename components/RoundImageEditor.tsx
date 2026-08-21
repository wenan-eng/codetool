"use client"
import { useRef, useState } from "react"

export default function RoundImageEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [radius, setRadius] = useState(30)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const render = () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !imgUrl) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const r = Math.min((radius / 100) * Math.min(canvas.width, canvas.height) / 2, Math.min(canvas.width, canvas.height) / 2)
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, r)
    ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, r)
    ctx.arcTo(0, canvas.height, 0, 0, r)
    ctx.arcTo(0, 0, canvas.width, 0, r)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0)
  }

  const loadFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => { imgRef.current = img; setImgUrl(String(reader.result || "")) }
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  }

  const download = () => {
    canvasRef.current?.toBlob(blob => {
      if (!blob) return
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "rounded.png"
      a.click()
    }, "image/png")
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        ⭕ {t("上传图片生成透明圆角（PNG 输出，本地处理）", "Upload an image for rounded corners (PNG output)", "Suba una imagen para esquinas redondeadas (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {imgUrl && (
        <>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 w-28">{t("圆角程度%", "Roundness %", "Redondeo %")}</span>
            <input type="range" min={0} max={100} value={radius} onChange={e => { setRadius(Number(e.target.value)); setTimeout(render, 0) }} className="flex-1" />
            <span className="w-10 font-mono text-xs">{radius}%</span>
          </label>
          <div className="bg-[repeating-conic-gradient(#eee_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] border rounded-xl p-2">
            <canvas ref={canvasRef} className="max-h-72 mx-auto object-contain max-w-full" />
          </div>
          <button onClick={() => { render(); download() }} className="self-start px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t("下载透明圆角 PNG", "Download Rounded PNG", "Descargar PNG")}</button>
        </>
      )}
      <p className="text-xs text-gray-400">{t("棋盘格代表透明区域；所有操作均在浏览器本地完成", "Checkerboard = transparent area. All processing is local.", "El tablero = transparencia. Todo local.")}</p>
    </div>
  )
}
