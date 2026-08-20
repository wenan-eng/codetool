"use client"
import { useState } from "react"
import { jsonToPhpSerialize, phpSerializeToJson } from "@/lib/phpSerialize"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, { json: string; php: string }> = {
  zh: { json: JSON.stringify({ name: "Alice", age: 30, tags: ["php", "json"], active: true }, null, 2), php: 'a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}' },
  en: { json: JSON.stringify({ name: "Alice", age: 30, tags: ["php", "json"], active: true }, null, 2), php: 'a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}' },
  es: { json: JSON.stringify({ name: "Alicia", age: 30, tags: ["php", "json"], active: true }, null, 2), php: 'a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}' },
}

export default function PhpSerializeEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const ph = dict.phpSerialize || {}
  const isEn = locale === "en"
  const isEs = locale === "es"
  const msgs = {
    toPhp: ph.toPhp || (isEn ? "JSON → PHP Serialize" : isEs ? "JSON → PHP Serialize" : "JSON转PHP序列化"),
    toJson: ph.toJson || (isEn ? "PHP Serialize → JSON" : isEs ? "PHP Serialize → JSON" : "PHP反序列化转JSON"),
    sampleJson: ph.sampleJson || (isEn ? "Load JSON Sample" : isEs ? "Ver ejemplo JSON" : "查看JSON示例"),
    samplePhp: ph.samplePhp || (isEn ? "Load PHP Sample" : isEs ? "Ver ejemplo PHP" : "查看PHP示例"),
    copy: ph.copy || (isEn ? "Copy Result" : isEs ? "Copiar resultado" : "复制结果"),
    clear: ph.clear || (isEn ? "Clear" : isEs ? "Limpiar" : "清空数据"),
    copied: ph.copied || (isEn ? "Copied" : isEs ? "Copiado" : "已复制"),
    jsonLabel: ph.jsonLabel || (isEn ? "JSON" : isEs ? "JSON" : "JSON"),
    phpLabel: ph.phpLabel || (isEn ? "PHP Serialize" : isEs ? "PHP Serialize" : "PHP序列化"),
    jsonPlaceholder: ph.jsonPlaceholder || (isEn ? 'Paste JSON, e.g. {"a":1,"b":[2,3]}' : isEs ? 'Pegue JSON, ej. {"a":1}' : '请输入 JSON，如 {"a":1,"b":[2,3]}'),
    phpPlaceholder: ph.phpPlaceholder || (isEn ? 'Paste PHP serialize, e.g. a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}' : isEs ? 'Pegue PHP serialize, ej. a:2:{...}' : '请输入 PHP 序列化字符串，如 a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}'),
    localNote: ph.localNote || (isEn ? "All processing is done locally, no upload" : isEs ? "Todo se procesa localmente, sin subida" : "所有操作均在浏览器本地完成，不上传数据"),
    swap: ph.swap || "⇄",
  }

  const [jsonInput, setJsonInput] = useState("")
  const [phpInput, setPhpInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<"json"|"php"|null>(null)

  const handleJsonToPhp = () => {
    if (!jsonInput.trim()) { setError(isEn ? "Please enter JSON" : isEs ? "Ingrese JSON" : "请输入 JSON 内容"); return }
    try {
      const r = jsonToPhpSerialize(jsonInput)
      setPhpInput(r)
      setError(null)
    } catch (e: any) { setError(e.message) }
  }
  const handlePhpToJson = () => {
    if (!phpInput.trim()) { setError(isEn ? "Please enter PHP serialize" : isEs ? "Ingrese PHP serialize" : "请输入 PHP 序列化内容"); return }
    try {
      const r = phpSerializeToJson(phpInput)
      setJsonInput(r)
      setError(null)
    } catch (e: any) { setError(e.message) }
  }
  const handleCopy = async (v: string, which: "json"|"php") => {
    if (!v) return
    await navigator.clipboard.writeText(v)
    setCopied(which)
    setTimeout(()=>setCopied(null),1500)
  }
  const handleClear = () => { setJsonInput(""); setPhpInput(""); setError(null) }
  const handleSampleJson = () => { setJsonInput((SAMPLES[locale]||SAMPLES.zh).json); setError(null) }
  const handleSamplePhp = () => { setPhpInput((SAMPLES[locale]||SAMPLES.zh).php); setError(null) }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button onClick={handleJsonToPhp} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{msgs.toPhp}</button>
          <button onClick={handlePhpToJson} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">{msgs.toJson}</button>
          <button onClick={handleSampleJson} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{msgs.sampleJson}</button>
          <button onClick={handleSamplePhp} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{msgs.samplePhp}</button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">{msgs.clear}</button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.jsonLabel}</span>
              <button onClick={()=>handleCopy(jsonInput,"json")} className="text-xs px-2 py-1 border rounded hover:bg-white">{copied==="json"?msgs.copied:msgs.copy}</button>
            </div>
            <textarea value={jsonInput} onChange={e=>setJsonInput(e.target.value)} placeholder={msgs.jsonPlaceholder} className="w-full h-[340px] p-4 font-mono text-sm resize-none focus:outline-none" />
          </div>
          <div className="relative flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.phpLabel}</span>
              <button onClick={()=>handleCopy(phpInput,"php")} className="text-xs px-2 py-1 border rounded hover:bg-white">{copied==="php"?msgs.copied:msgs.copy}</button>
            </div>
            <textarea value={phpInput} onChange={e=>setPhpInput(e.target.value)} placeholder={msgs.phpPlaceholder} className="w-full h-[340px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50" />
          </div>
        </div>
        {error && <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-200">{error}</div>}
        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
