"use client"
import { useState } from "react"
import { imageExtract } from "@/lib/imageExtract"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: `<div>\n  <img src="https://example.com/a.jpg" alt="a">\n  <img src='https://example.com/b.png' />\n  <p>文本</p>\n  <IMG SRC="https://example.com/c.webp" width=100>\n</div>`,
  en: `<div>\n  <img src="https://example.com/a.jpg" alt="a">\n  <img src='https://example.com/b.png' />\n  <p>text</p>\n  <IMG SRC="https://example.com/c.webp" width=100>\n</div>`,
  es: `<div>\n  <img src="https://example.com/a.jpg" alt="a">\n  <img src='https://example.com/b.png' />\n  <p>texto</p>\n  <IMG SRC="https://example.com/c.webp" width=100>\n</div>`,
}

export default function ImageExtractEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const ie = dict.imageExtract || dict["image-extract"] || {}
  const editorFallback = dict.editor || {}

  const msgs = {
    extract: ie.extract || ie.action || (locale === "en" ? "Extract Images" : locale === "es" ? "Extraer Imágenes" : "提取图片"),
    sample: ie.sample || editorFallback.sample || "查看示例",
    copy: ie.copy || editorFallback.copy || "复制结果",
    clear: ie.clear || editorFallback.clear || "清空数据",
    copied: ie.copied || editorFallback.copied || "已复制",
    inputPlaceholder: ie.inputPlaceholder || ie.placeholder || (locale === "en" ? "Paste HTML with <img> tags" : locale === "es" ? "Pegue HTML con etiquetas <img>" : "请输入包含 <img> 的 HTML"),
    outputPlaceholder: ie.outputPlaceholder || (locale === "en" ? "Image URLs will appear here, one per line" : locale === "es" ? "URLs de imágenes aparecerán aquí, una por línea" : "提取的图片 URL 将显示在这里，每行一个"),
    localNote: ie.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    inputLabel: ie.inputLabel || (locale === "en" ? "HTML Input" : locale === "es" ? "Entrada HTML" : "HTML 输入"),
    outputLabel: ie.outputLabel || (locale === "en" ? "Image URLs" : locale === "es" ? "URLs de Imágenes" : "图片链接"),
    count: ie.count || (locale === "en" ? "images" : locale === "es" ? "imágenes" : "张图片"),
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [urls, setUrls] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const handleExtract = () => {
    const result = imageExtract(input)
    setUrls(result)
    setOutput(result.join("\n"))
  }

  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setInput(s)
    const result = imageExtract(s)
    setUrls(result)
    setOutput(result.join("\n"))
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setUrls([])
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button onClick={handleExtract} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {msgs.extract}
          </button>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {msgs.sample}
          </button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {copied ? msgs.copied : msgs.copy}
          </button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">
            {msgs.clear}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.inputLabel}</div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {urls.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {urls.length} {msgs.count}
                </span>
              )}
            </div>
            <textarea
              value={output}
              onChange={e => setOutput(e.target.value)}
              placeholder={msgs.outputPlaceholder}
              className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
            />
          </div>
        </div>

        {urls.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50">
            <div className="text-xs text-gray-500 mb-2">预览:</div>
            <div className="flex flex-wrap gap-2">
              {urls.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                  {u}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
