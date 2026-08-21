"use client"
import { useEffect, useState } from "react"
import { parseDataUrl, formatFileSize, bytesToBase64 } from "@/lib/dataUrlTool"

export default function Base64ImageEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [parsed, setParsed] = useState<{ mime: string; size: number; dataUrl: string; w: number; h: number } | null>(null)
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  useEffect(() => {
    setError("")
    setParsed(null)
    const trimmed = input.trim()
    if (!trimmed) return
    try {
      const r = parseDataUrl(trimmed)
      if (!r.mime.startsWith("image/")) { setError(t("内容不是图片类型", "Content is not an image", "El contenido no es una imagen")); return }
      const dataUrl = `data:${r.mime};base64,${bytesToBase64(r.bytes)}`
      const img = new Image()
      img.onload = () => setParsed({ mime: r.mime, size: r.size, dataUrl, w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => setError(t("图片数据无法解码，请检查 base64 是否完整", "Cannot decode image data, check the base64 integrity", "No se puede decodificar la imagen, verifique el base64"))
      img.src = dataUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [input])

  const download = () => {
    if (!parsed) return
    const a = document.createElement("a")
    a.href = parsed.dataUrl
    a.download = `image.${parsed.mime.split("/")[1]?.replace("+xml", "") || "png"}`
    a.click()
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("请粘贴 base64 图片字符串...\n例如：data:image/png;base64,iVBORw0KGgo...", "Paste a base64 image string...\ne.g. data:image/png;base64,iVBORw0KGgo...", "Pegue una cadena base64 de imagen...\nEj.: data:image/png;base64,iVBORw0KGgo...")}
        className="w-full h-40 p-3 border rounded-xl font-mono text-xs focus:outline-none focus:border-blue-400"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {parsed && (
        <div className="bg-white border rounded-xl p-4 flex flex-col gap-3 items-start">
          <img src={parsed.dataUrl} alt="" className="max-w-full max-h-72 object-contain rounded-lg bg-gray-50" />
          <div className="text-sm text-gray-600">{parsed.mime} • {parsed.w}×{parsed.h} • {formatFileSize(parsed.size)}</div>
          <button onClick={download} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("下载图片", "Download Image", "Descargar imagen")}</button>
        </div>
      )}
      <button onClick={() => { setInput(""); setParsed(null); setError("") }} className="self-start px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
