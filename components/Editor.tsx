"use client"
import { useState } from "react"
import { beautify, compress, validate, sampleJson } from "@/lib/jsonTool"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }
export default function Editor({ locale = "zh" }: { locale?: string }) {
  const msgs = (messagesMap[locale] || zh).editor
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const handleBeautify = () => {
    try { const r = beautify(value); setValue(r); setError(null) } catch (e:any){ setError(e.message) }
  }
  const handleCompress = () => {
    try { const r = compress(value); setValue(r); setError(null) } catch (e:any){ setError(e.message) }
  }
  const handleCopy = async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(()=>setCopied(false),1500) }
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
        <button onClick={handleBeautify} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{msgs.beautify}</button>
        <button onClick={handleCompress} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">{msgs.compress}</button>
        <button onClick={()=>setValue(sampleJson)} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{msgs.sample}</button>
        <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{copied ? msgs.copied : msgs.copy}</button>
        <button onClick={()=>{setValue(""); setError(null)}} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">{msgs.clear}</button>
      </div>
      <div className="relative">
        <textarea value={value} onChange={e=>{setValue(e.target.value); if(error) setError(validate(e.target.value).error || null)}} placeholder={msgs.placeholder} className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none" />
        {error && <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 text-red-600 text-xs px-4 py-2">校验失败: {error}</div>}
      </div>
      <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
    </div>
  )
}
