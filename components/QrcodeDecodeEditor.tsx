"use client"
import { useRef, useState } from "react"
import jsQR from "jsqr"

export default function QrcodeDecodeEditor({ locale = "zh" }: { locale?: string }) {
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [preview, setPreview] = useState("")
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const decodeFile = (file: File) => {
    setError("")
    setResult("")
    setCopied(false)
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || "")
      setPreview(dataUrl)
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        try {
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(data.data, canvas.width, canvas.height)
          if (code?.data) setResult(code.data)
          else setError(t("未识别到二维码，请确认图片清晰完整", "No QR code detected; check clarity and completeness", "No se detectó un código QR"))
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🔍 {t("上传含二维码的图片进行解码（本地处理）", "Upload an image containing a QR code (local)", "Suba una imagen con código QR (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) decodeFile(f) }} />
      </label>
      {preview && <div className="bg-white border rounded-xl p-3 max-w-xs mx-auto"><img src={preview} alt="" className="w-full rounded" /></div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      {result && (
        <button
          onClick={async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left font-mono text-sm break-all hover:bg-blue-100"
        >
          {result} <span className="text-xs text-gray-400">{copied ? t("已复制", "Copied", "Copiado") : "⧉"}</span>
        </button>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <p className="text-xs text-gray-400">{t("所有解码均在浏览器本地完成，不上传数据", "All decoding runs locally.", "Todo local.")}</p>
    </div>
  )
}
