"use client"
import { useEffect, useRef, useState } from "react"

export default function WatermarkEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [text, setText] = useState(locale === "en" ? "WATERMARK" : locale === "es" ? "MARCA DE AGUA" : "仅供演示使用")
  const [opacity, setOpacity] = useState(30)
  const [tile, setTile] = useState(true)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  useEffect(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !imgUrl) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(img, 0, 0)
    ctx.globalAlpha = opacity / 100
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "rgba(0,0,0,0.4)"
    ctx.lineWidth = 1
    const fontSize = Math.max(14, Math.round(Math.min(canvas.width, canvas.height) / 25))
    ctx.font = `${fontSize}px sans-serif`
    if (tile) {
      ctx.rotate(-Math.PI / 12)
      const stepX = fontSize * text.length + fontSize * 4
      const stepY = fontSize * 6
      for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          ctx.strokeText(text, x, y)
          ctx.fillText(text, x, y)
        }
      }
    } else {
      ctx.textAlign = "right"
      ctx.strokeText(text, canvas.width - fontSize, canvas.height - fontSize)
      ctx.fillText(text, canvas.width - fontSize, canvas.height - fontSize)
    }
  }, [imgUrl, text, opacity, tile])

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
      a.download = "watermarked.png"
      a.click()
    }, "image/png")
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🖼️ {t("上传图片添加文字水印（本地处理）", "Upload an image to watermark (local)", "Suba una imagen para marcar (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {imgUrl && (
        <>
          <input value={text} onChange={e => setText(e.target.value)} placeholder={t("水印文字", "Watermark text", "Texto de marca")} className="p-3 border rounded-xl text-sm" />
          <label className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 w-24">{t("不透明度", "Opacity", "Opacidad")}</span>
            <input type="range" min={5} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="flex-1" />
            <span className="w-10 font-mono text-xs">{opacity}%</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={tile} onChange={e => setTile(e.target.checked)} />
            {t("平铺满图（取消则右下角单个）", "Tile across image (unchecked = bottom-right single)", "Mosaico (desmarcado = esquina)")}
          </label>
          <div className="bg-white border rounded-xl p-2"><canvas ref={canvasRef} className="max-h-72 mx-auto object-contain max-w-full rounded" /></div>
          <button onClick={download} className="self-start px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t("下载带水印图片", "Download Watermarked", "Descargar marcada")}</button>
        </>
      )}
    </div>
  )
}
