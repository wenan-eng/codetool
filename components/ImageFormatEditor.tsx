"use client"
import { useRef, useState } from "react"
import { convertImageCanvas, type ImageFormat } from "@/lib/imageFormat"

const FORMAT_CONFIG: Record<string, { format: ImageFormat | null; label: string }> = {
  "image-jpg": { format: "jpeg", label: "JPG" },
  "image-png": { format: "png", label: "PNG" },
  "image-webp": { format: "webp", label: "WebP" },
  "image-bmp": { format: "bmp", label: "BMP" },
  png2jpg: { format: "jpeg", label: "JPG" },
  webp2jpg: { format: "jpeg", label: "JPG" },
}

export default function ImageFormatEditor({ toolId, locale = "zh" }: { toolId: keyof typeof FORMAT_CONFIG; locale?: string }) {
  const cfg = FORMAT_CONFIG[toolId]
  const [imgUrl, setImgUrl] = useState("")
  const [origSize, setOrigSize] = useState(0)
  const [outSize, setOutSize] = useState(0)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`)

  const loadFile = (file: File) => {
    setError("")
    setDone(false)
    setOutSize(0)
    setOrigSize(file.size)
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setImgUrl(String(reader.result || ""))
      }
      img.onerror = () => setError(t("浏览器无法解码该图片格式", "The browser cannot decode this image", "El navegador no puede decodificar esta imagen"))
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  }

  const convert = async () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas || !cfg.format) return
    setError("")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (cfg.format !== "jpeg") ctx.drawImage(img, 0, 0)
    else {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    try {
      const blob = await convertImageCanvas(canvas, cfg.format)
      setOutSize(blob.size)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `converted.${cfg.format === "jpeg" ? "jpg" : cfg.format}`
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500 block">
        🖼️ {t(`点击上传图片，转换为 ${cfg.label} 格式（全程本地处理）`, `Upload an image to convert to ${cfg.label} (local only)`, `Suba una imagen para convertir a ${cfg.label} (local)`)}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {imgUrl && (
        <>
          <div className="bg-white border rounded-xl p-3 text-sm flex items-center gap-4">
            <img src={imgUrl} alt="" className="max-h-32 object-contain rounded" />
            <div className="text-gray-500">{t("原始大小", "Original size", "Tamaño original")}: {fmtSize(origSize)}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={convert} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t(`下载 ${cfg.label}`, `Download ${cfg.label}`, `Descargar ${cfg.label}`)}</button>
            <button onClick={() => { setImgUrl(""); setDone(false); setOutSize(0) }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("换一张", "Change Image", "Cambiar imagen")}</button>
          </div>
          {done && outSize > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
              {t(`转换完成，${cfg.label} 文件大小：`, `Converted. ${cfg.label} size: `, `Convertido. Tamaño ${cfg.label}: `)}{fmtSize(outSize)}
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
