"use client"
import { useRef, useState } from "react"
import { formatFileSize } from "@/lib/dataUrlTool"

export default function FileBase64Editor({ locale = "zh" }: { locale?: string }) {
  const [result, setResult] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError("")
    setCopied(false)
    const reader = new FileReader()
    reader.onload = () => setResult({ name: file.name, type: file.type || "application/octet-stream", size: file.size, dataUrl: String(reader.result || "") })
    reader.onerror = () => setError(locale === "en" ? "Failed to read file" : locale === "es" ? "Error al leer el archivo" : "文件读取失败")
    reader.readAsDataURL(file)
  }

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.dataUrl)
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
        {locale === "en" ? "Click or drag a file here to upload (any format)" : locale === "es" ? "Haga clic o arrastre un archivo aquí (cualquier formato)" : "点击或拖拽文件至此区域上传，支持任意格式文件"}
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {result && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded-xl p-4 text-sm flex flex-col gap-1">
            <div className="font-medium">{result.name}</div>
            <div className="text-gray-500">{result.type} • {formatFileSize(result.size)}</div>
          </div>
          <textarea readOnly value={result.dataUrl} className="w-full h-40 p-3 border rounded-xl font-mono text-xs" onFocus={e => e.currentTarget.select()} />
          <div className="flex gap-3">
            <button onClick={copy} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{copied ? (locale === "en" ? "Copied" : locale === "es" ? "Copiado" : "已复制") : locale === "en" ? "Copy Base64 Data" : locale === "es" ? "Copiar datos Base64" : "复制Base64数据"}</button>
            <button onClick={() => { setResult(null); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{locale === "en" ? "Clear" : locale === "es" ? "Limpiar" : "清空数据"}</button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{locale === "en" ? "All processing is done locally in your browser. No data is uploaded." : locale === "es" ? "Todo el procesamiento se realiza localmente en su navegador. No se sube ningún dato." : "所有操作均在浏览器本地完成，不上传数据"}</p>
    </div>
  )
}
