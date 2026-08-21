"use client"
import { useRef, useState } from "react"
import { extractLsb } from "@/lib/lsbCodec"

export default function LsbExtractEditor({ locale = "zh" }: { locale?: string }) {
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const handleFile = (file: File) => {
    setError("")
    setResult("")
    setCopied(false)
    if (!file.type.startsWith("image/")) { setError(t("请选择图片文件", "Please select an image file", "Seleccione una imagen")); return }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        try {
          setResult(extractLsb(new Uint8Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data)))
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500"
      >
        🔍 {t("点击上传或拖拽图片文件（支持 PNG、JPG、GIF、WebP、BMP 等格式）", "Click or drag an image (PNG, JPG, GIF, WebP, BMP...)", "Haga clic o arrastre una imagen (PNG, JPG, GIF, WebP, BMP...)")}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {(result || !error) && (
        <textarea readOnly value={result} placeholder={t("提取结果...", "Extracted text...", "Texto extraído...")} className="w-full h-28 p-3 border rounded-xl text-sm bg-gray-50" />
      )}
      <div className="flex gap-3">
        <button onClick={copy} disabled={!result} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{copied ? t("已复制", "Copied", "Copiado") : t("复制隐写文字", "Copy Hidden Text", "Copiar texto oculto")}</button>
        <button onClick={() => { setResult(""); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
