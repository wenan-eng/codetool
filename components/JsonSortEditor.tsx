"use client"
import { useState } from "react"
import { sortKeys } from "@/lib/jsonFlatten"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: JSON.stringify({ z: 3, a: 2, m: { d: 4, b: 1, c: { z: 9, a: 8 } }, list: [{ z: 1, a: 2 }, 5] }, null, 2),
  en: JSON.stringify({ z: 3, a: 2, m: { d: 4, b: 1, c: { z: 9, a: 8 } }, list: [{ z: 1, a: 2 }, 5] }, null, 2),
  es: JSON.stringify({ z: 3, a: 2, m: { d: 4, b: 1, c: { z: 9, a: 8 } }, list: [{ z: 1, a: 2 }, 5] }, null, 2),
}

export default function JsonSortEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const jf = dict.jsonSort || {}
  const editorFallback = dict.editor || {}
  const msgs = {
    sort: jf.sort || (locale === "en" ? "Sort Keys" : locale === "es" ? "Ordenar Claves" : "排序"),
    sample: jf.sample || editorFallback.sample || "查看示例",
    copy: jf.copy || editorFallback.copy || "复制结果",
    clear: jf.clear || editorFallback.clear || "清空数据",
    copied: jf.copied || editorFallback.copied || "已复制",
    inputPlaceholder: jf.inputPlaceholder || (locale === "en" ? "Paste JSON to sort keys" : locale==="es" ? "Pegue JSON para ordenar claves" : "请输入要排序的 JSON"),
    outputPlaceholder: jf.outputPlaceholder || (locale === "en" ? "Sorted result will appear here" : locale==="es" ? "El resultado ordenado aparecerá aquí" : "排序后的结果将显示在这里"),
    localNote: jf.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    inputLabel: jf.inputLabel || (locale === "en" ? "Original JSON" : locale === "es" ? "JSON Original" : "原始 JSON"),
    outputLabel: jf.outputLabel || (locale === "en" ? "Sorted JSON" : locale === "es" ? "JSON Ordenado" : "排序后"),
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSort = () => {
    if (!input.trim()) { setError(locale==="en" ? "Please enter JSON" : locale==="es" ? "Ingrese JSON" : "请输入 JSON 内容"); return }
    try {
      const obj = JSON.parse(input)
      const sorted = sortKeys(obj)
      setOutput(JSON.stringify(sorted, null, 2))
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSample = () => { setInput(SAMPLES[locale] || SAMPLES.zh); setOutput(""); setError(null) }
  const handleCopy = async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500) }
  const handleClear = () => { setInput(""); setOutput(""); setError(null) }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button onClick={handleSort} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{msgs.sort}</button>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{msgs.sample}</button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{copied ? msgs.copied : msgs.copy}</button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">{msgs.clear}</button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.inputLabel}</div>
            <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={msgs.inputPlaceholder} className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none" />
          </div>
          <div className="relative">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {output && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{output.split("\n").length} 行</span>}
            </div>
            <textarea value={output} onChange={e=>setOutput(e.target.value)} placeholder={msgs.outputPlaceholder} className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50" />
          </div>
        </div>
        {error && <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-200">{locale==="en"?"Error: ":"校验失败: "}{error}</div>}
        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
