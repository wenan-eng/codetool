"use client"
import { useState } from "react"
import { escapeHtml, unescapeHtml } from "@/lib/htmlEscape"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: `<div class="example">这是一个"示例"文本 & 特殊字符</div>`,
  en: `<div class="example">This is a "sample" text & special chars</div>`,
  es: `<div class="example">Este es un texto "de ejemplo" & caracteres especiales</div>`,
}

export default function HtmlEscapeEditor({ locale = "zh" }: { locale?: string }) {
  const msgsAll = messagesMap[locale] || zh
  const htmlMsgs = msgsAll.htmlEscape || {}
  const editorFallback = msgsAll.editor || {}

  const msgs = {
    escape: htmlMsgs.escape || (locale === "en" ? "HTML Escape" : locale === "es" ? "Escapar HTML" : "HTML转义"),
    unescape: htmlMsgs.unescape || (locale === "en" ? "HTML Unescape" : locale === "es" ? "Desescapar HTML" : "HTML反转义"),
    sample: htmlMsgs.sample || editorFallback.sample || "查看示例",
    copy: htmlMsgs.copy || editorFallback.copy || "复制结果",
    clear: htmlMsgs.clear || editorFallback.clear || "清空数据",
    inputPlaceholder:
      htmlMsgs.inputPlaceholder ||
      (locale === "en"
        ? "Enter HTML characters to escape/unescape"
        : locale === "es"
          ? "Ingrese caracteres HTML para escapar/desescapar"
          : "请输入要转义的 HTML 字符："),
    outputPlaceholder:
      htmlMsgs.outputPlaceholder ||
      (locale === "en" ? "Result will appear here" : locale === "es" ? "El resultado aparecerá aquí" : "转换结果将显示在这里"),
    copied: htmlMsgs.copied || editorFallback.copied || "已复制",
    localNote: htmlMsgs.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    inputLabel: htmlMsgs.inputLabel || (locale === "en" ? "Input" : locale === "es" ? "Entrada" : "输入"),
    outputLabel: htmlMsgs.outputLabel || (locale === "en" ? "Result" : locale === "es" ? "Resultado" : "结果"),
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const handleEscape = () => {
    setOutput(escapeHtml(input))
  }
  const handleUnescape = () => {
    setOutput(unescapeHtml(input))
  }
  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setInput(s)
    setOutput(escapeHtml(s))
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
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleEscape}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {msgs.escape}
          </button>
          <button
            onClick={handleUnescape}
            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {msgs.unescape}
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
              onChange={(e) => setInput(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {output && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {output.length} 字符
                </span>
              )}
            </div>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={msgs.outputPlaceholder}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
            />
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
