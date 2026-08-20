"use client"
import { useState } from "react"
import { unflatten } from "@/lib/jsonFlatten"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: JSON.stringify({ "a.b": 1, "a.c.0": 2, "a.c.1": 3, "a.c.2.d": "hi", e: 4 }, null, 2),
  en: JSON.stringify({ "a.b": 1, "a.c.0": 2, "a.c.1": 3, "a.c.2.d": "hi", e: 4 }, null, 2),
  es: JSON.stringify({ "a.b": 1, "a.c.0": 2, "a.c.1": 3, "a.c.2.d": "hi", e: 4 }, null, 2),
}

export default function JsonUnflattenEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const jf = dict.jsonUnflatten || {}
  const editorFallback = dict.editor || {}
  const msgs = {
    unflatten: jf.unflatten || (locale === "en" ? "Unflatten" : locale === "es" ? "Desaplanar" : "还原嵌套"),
    sample: jf.sample || editorFallback.sample || "查看示例",
    copy: jf.copy || editorFallback.copy || "复制结果",
    clear: jf.clear || editorFallback.clear || "清空数据",
    copied: jf.copied || editorFallback.copied || "已复制",
    inputPlaceholder: jf.inputPlaceholder || (locale === "en" ? "Paste flattened JSON, e.g. {\"a.b\":1}" : locale === "es" ? "Pegue JSON aplanado, ej. {\"a.b\":1}" : '请输入扁平 JSON，例如 {"a.b":1}'),
    outputPlaceholder: jf.outputPlaceholder || (locale === "en" ? "Nested result will appear here" : locale === "es" ? "El resultado anidado aparecerá aquí" : "还原后的嵌套结果将显示在这里"),
    localNote: jf.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    inputLabel: jf.inputLabel || (locale === "en" ? "Flattened (dot notation)" : locale === "es" ? "Aplanado (notación punto)" : "扁平 JSON（点号）"),
    outputLabel: jf.outputLabel || (locale === "en" ? "Nested JSON" : locale === "es" ? "JSON Anidado" : "嵌套 JSON"),
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleUnflatten = () => {
    if (!input.trim()) { setError(locale==="en" ? "Please enter JSON" : locale==="es" ? "Ingrese JSON" : "请输入 JSON 内容"); return }
    try {
      const flat = JSON.parse(input)
      if (flat === null || typeof flat !== "object" || Array.isArray(flat)) throw new Error(locale==="en" ? "Input must be a flat object" : locale==="es" ? "La entrada debe ser un objeto plano" : "输入需为扁平对象")
      const nested = unflatten(flat as Record<string, any>)
      setOutput(JSON.stringify(nested, null, 2))
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
          <button onClick={handleUnflatten} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{msgs.unflatten}</button>
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
