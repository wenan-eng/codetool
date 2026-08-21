"use client"
import { useEffect, useRef, useState } from "react"

export default function ImageCompressorEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [origSize, setOrigSize] = useState(0)
  const [outSize, setOutSize] = useState(0)
  const [quality, setQuality] = useState(70)
  const [scalePct, setScalePct] = useState(100)
  const [done, setDone] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`)

  const compress = () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scalePct / 100))
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scalePct / 100))
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (!blob) return
      setOutSize(blob.size)
      setDone(true)
    }, "image/jpeg", quality / 100)
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🗜️ {t("上传图片进行高清压缩（JPG 输出，本地处理）", "Upload an image to compress (JPG output, local)", "Suba una imagen para comprimir (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setDone(false); setOrigSize(f.size); const reader = new FileReader(); reader.onload = () => { const img = new Image(); img.onload = () => { imgRef.current = img; setImgUrl(String(reader.result || "")) }; img.src = String(reader.result || "") }; reader.readAsDataURL(f) } }} />
      </label>
      {imgUrl && (
        <>
          <div className="text-sm text-gray-500">{t("原始大小", "Original", "Original")}: <span className="font-mono">{fmtSize(origSize)}</span></div>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 w-28">{t("输出质量%", "Quality %", "Calidad %")}</span>
            <input type="range" min={10} max={95} value={quality} onChange={e => setQuality(Number(e.target.value))} className="flex-1" />
            <span className="w-10 font-mono text-xs">{quality}</span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 w-28">{t("尺寸比例%", "Scale %", "Escala %")}</span>
            <input type="range" min={20} max={100} value={scalePct} onChange={e => setScalePct(Number(e.target.value))} className="flex-1" />
            <span className="w-10 font-mono text-xs">{scalePct}</span>
          </label>
          <button onClick={compress} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">🗜️ {t("开始压缩并下载", "Compress & Download", "Comprimir y descargar")}</button>
          {done && (
            <div className={`border rounded-xl p-3 text-sm ${outSize < origSize ? "bg-green-50 border-green-200 text-green-700" : "bg-yellow-50 border-yellow-200 text-yellow-700"}`}>
              {t("压缩后大小", "Compressed size", "Tamaño comprimido")}: <span className="font-mono">{fmtSize(outSize)}</span>
              {" "}({t("节省", "saved", "ahorrado")} {Math.max(0, Math.round((1 - outSize / origSize) * 100))}%)
              {outSize >= origSize && t(" —— 原图压缩率已很高，建议调低质量或尺寸", " — source is already well compressed; try lower quality or scale", ": pruebe menor calidad o escala")}
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally. No data is uploaded.", "Todo local.")}</p>
    </div>
  )
}
