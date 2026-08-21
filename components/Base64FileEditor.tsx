"use client"
import { useState } from "react"
import { parseDataUrl, formatFileSize, extFromMime } from "@/lib/dataUrlTool"

export default function Base64FileEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [name, setName] = useState("")
  const [parsed, setParsed] = useState<{ mime: string; size: number; bytes: Uint8Array } | null>(null)
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const analyze = () => {
    setError("")
    setParsed(null)
    try {
      const r = parseDataUrl(input)
      setParsed({ mime: r.mime, size: r.size, bytes: r.bytes })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const download = () => {
    if (!parsed) return
    const blob = new Blob([parsed.bytes as unknown as BlobPart], { type: parsed.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = (name.trim() || "download") + (/\.[a-zA-Z0-9]+$/.test(name.trim()) ? "" : extFromMime(parsed.mime))
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("请粘贴 base64 文件字符串...\n例如：data:image/png;base64,iVBORw0KGgo...", "Paste a base64 file string...\ne.g. data:image/png;base64,iVBORw0KGgo...", "Pegue una cadena base64...\nEj.: data:image/png;base64,iVBORw0KGgo...")}
        className="w-full h-40 p-3 border rounded-xl font-mono text-xs focus:outline-none focus:border-blue-400"
      />
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t("请输入文件名，如：懒人工具", "Enter file name, e.g. myfile", "Introduzca el nombre del archivo")}
        className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-400"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button onClick={analyze} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("解析并预览", "Parse & Preview", "Analizar y previsualizar")}</button>
        <button onClick={() => { setInput(""); setName(""); setParsed(null); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {parsed && (
        <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
          <div className="text-sm text-gray-600">{parsed.mime} • {formatFileSize(parsed.size)}</div>
          <button onClick={download} className="self-start px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("下载文件", "Download File", "Descargar archivo")}</button>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
