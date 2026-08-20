"use client"
import { useState } from "react"
import { htmlFilter } from "@/lib/htmlFilter"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: `<div><h1>标题</h1><p>你好 <b>世界</b> &amp; 朋友</p><script>alert(1)</script><style>body{color:red}</style><!-- 注释 --><a href="#">链接</a></div>`,
  en: `<div><h1>Title</h1><p>Hello <b>world</b> &amp; friends</p><script>alert(1)</script><style>body{color:red}</style><!-- comment --><a href="#">link</a></div>`,
  es: `<div><h1>Título</h1><p>Hola <b>mundo</b> &amp; amigos</p><script>alert(1)</script><style>body{color:red}</style><!-- comentario --><a href="#">enlace</a></div>`,
}

export default function HtmlFilterEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const hf = dict.htmlFilter || dict["html-filter"] || {}
  const editorFallback = dict.editor || {}

  const msgs = {
    filter: hf.filter || hf.action || (locale === "en" ? "Filter HTML" : locale === "es" ? "Filtrar HTML" : "过滤 HTML"),
    extractText: hf.extractText || (locale === "en" ? "Extract Text" : locale === "es" ? "Extraer Texto" : "提取纯文本"),
    sample: hf.sample || editorFallback.sample || "查看示例",
    copy: hf.copy || editorFallback.copy || "复制结果",
    clear: hf.clear || editorFallback.clear || "清空数据",
    copied: hf.copied || editorFallback.copied || "已复制",
    inputPlaceholder: hf.inputPlaceholder || hf.placeholder || (locale === "en" ? "Paste HTML" : locale === "es" ? "Pegue HTML" : "请输入 HTML 代码"),
    outputPlaceholder: hf.outputPlaceholder || (locale === "en" ? "Filtered result will appear here" : locale === "es" ? "El resultado filtrado aparecerá aquí" : "过滤后的结果将显示在这里"),
    localNote: hf.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    inputLabel: hf.inputLabel || (locale === "en" ? "HTML Input" : locale === "es" ? "Entrada HTML" : "HTML 输入"),
    outputLabel: hf.outputLabel || (locale === "en" ? "Result" : locale === "es" ? "Resultado" : "结果"),
    removeScripts: hf.removeScripts || (locale === "en" ? "Remove <script>" : locale === "es" ? "Eliminar <script>" : "移除 <script>"),
    removeStyles: hf.removeStyles || (locale === "en" ? "Remove <style>" : locale === "es" ? "Eliminar <style>" : "移除 <style>"),
    allowedTags: hf.allowedTags || (locale === "en" ? "Allowed tags (comma separated)" : locale === "es" ? "Etiquetas permitidas (coma)" : "白名单标签（逗号分隔）"),
    allowedPlaceholder: hf.allowedPlaceholder || "p, a, div",
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [removeScripts, setRemoveScripts] = useState(true)
  const [removeStyles, setRemoveStyles] = useState(true)
  const [extractText, setExtractText] = useState(false)
  const [allowedTags, setAllowedTags] = useState("")
  const [copied, setCopied] = useState(false)

  const handleFilter = () => {
    const opts: any = {
      removeScripts,
      removeStyles,
      extractText,
    }
    if (allowedTags.trim()) {
      opts.allowedTags = allowedTags.split(",").map(s => s.trim()).filter(Boolean)
    }
    setOutput(htmlFilter(input, opts))
  }

  const handleExtractText = () => {
    setExtractText(true)
    const opts: any = { removeScripts: true, removeStyles: true, extractText: true }
    if (allowedTags.trim()) opts.allowedTags = allowedTags.split(",").map(s => s.trim()).filter(Boolean)
    setOutput(htmlFilter(input, opts))
  }

  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setInput(s)
    setOutput("")
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
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50 items-center">
          <button onClick={handleFilter} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {msgs.filter}
          </button>
          <button onClick={handleExtractText} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
            {msgs.extractText}
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

        <div className="px-4 py-3 bg-gray-50 border-b flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={removeScripts} onChange={e => setRemoveScripts(e.target.checked)} />
            {msgs.removeScripts}
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={removeStyles} onChange={e => setRemoveStyles(e.target.checked)} />
            {msgs.removeStyles}
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={extractText} onChange={e => setExtractText(e.target.checked)} />
            {msgs.extractText}
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{msgs.allowedTags}:</span>
            <input
              value={allowedTags}
              onChange={e => setAllowedTags(e.target.value)}
              placeholder={msgs.allowedPlaceholder}
              className="border rounded px-2 py-1 text-sm w-32"
            />
          </label>
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
              {output && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{output.length} 字符</span>}
            </div>
            <textarea
              value={output}
              onChange={e => setOutput(e.target.value)}
              placeholder={msgs.outputPlaceholder}
              className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
            />
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
