"use client"
import { useRef, useState } from "react"
import { formatFileSize } from "@/lib/dataUrlTool"

export default function ImageBase64Editor({ locale = "zh" }: { locale?: string }) {
  const [result, setResult] = useState<{ name: string; type: string; size: number; dataUrl: string; w: number; h: number } | null>(null)
  const [raw, setRaw] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError("")
    setCopied(false)
    if (!file.type.startsWith("image/")) { setError(locale === "en" ? "Please select an image file" : locale === "es" ? "Seleccione un archivo de imagen" : "请选择图片文件"); return }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || "")
      const img = new Image()
      img.onload = () => setResult({ name: file.name, type: file.type, size: file.size, dataUrl, w: img.naturalWidth, h: img.naturalHeight })
      img.src = dataUrl
    }
    reader.onerror = () => setError(locale === "en" ? "Failed to read image" : locale === "es" ? "Error al leer la imagen" : "图片读取失败")
    reader.readAsDataURL(file)
  }

  const output = result ? (raw ? result.dataUrl.split(",")[1] || "" : result.dataUrl) : ""

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500"
      >
        {t("点击或拖拽图片至此区域上传（PNG、JPG、GIF、WebP、BMP 等）", "Click or drag an image here (PNG, JPG, GIF, WebP, BMP...)", "Haga clic o arrastre una imagen aquí (PNG, JPG, GIF, WebP, BMP...)")}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {result && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded-xl p-4 flex gap-4 items-center">
            <img src={result.dataUrl} alt="" className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
            <div className="text-sm flex flex-col gap-1">
              <div className="font-medium">{result.name}</div>
              <div className="text-gray-500">{result.type} • {result.w}×{result.h} • {formatFileSize(result.size)}</div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={raw} onChange={e => setRaw(e.target.checked)} />
            {t("仅输出纯 base64（不含 Data URL 前缀）", "Output pure base64 only (without Data URL prefix)", "Solo base64 puro (sin prefijo Data URL)")}
          </label>
          <textarea readOnly value={output} className="w-full h-36 p-3 border rounded-xl font-mono text-xs break-all" onFocus={e => e.currentTarget.select()} />
          <div className="flex gap-3">
            <button onClick={copy} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{copied ? t("已复制", "Copied", "Copiado") : t("复制Base64数据", "Copy Base64 Data", "Copiar datos Base64")}</button>
            <button onClick={() => setResult(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
