"use client"
import { useState } from "react"
import { parseBatch, BATCH_FORMATS } from "@/lib/timestampTool"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLE_INPUT = `1700000000
1700000000000
1710000000
1710000000000
1609459200
1640995200000`

export default function TimestampBatchEditor({ locale = "zh" }: { locale?: string }) {
  const msgs = (messagesMap[locale] || zh).timestampBatch || (messagesMap[locale] || zh).timestamp || {}
  const fallback = (messagesMap[locale] || zh).editor

  const t = {
    inputLabel: msgs.inputLabel || (locale === "en" ? "Timestamps (one per line, auto-detect s/ms)" : locale === "es" ? "Timestamps (uno por línea)" : "时间戳（每行一个，自动识别秒/毫秒）"),
    outputLabel: msgs.outputLabel || (locale === "en" ? "Formatted Dates" : locale === "es" ? "Fechas formateadas" : "格式化日期"),
    formatLabel: msgs.formatLabel || (locale === "en" ? "Output Format" : locale === "es" ? "Formato de salida" : "输出格式"),
    convert: msgs.convert || (locale === "en" ? "Batch Convert" : locale === "es" ? "Convertir en lote" : "批量转换"),
    sample: msgs.sample || fallback?.sample || "查看示例",
    copy: msgs.copy || fallback?.copy || "复制结果",
    copied: msgs.copied || fallback?.copied || "已复制",
    clear: msgs.clear || fallback?.clear || "清空数据",
    placeholder: msgs.placeholder || "请输入时间戳，每行一个，例如：\n1700000000\n1700000000000",
    outputPlaceholder: msgs.outputPlaceholder || "转换结果将显示在这里",
    localNote: msgs.localNote || fallback?.localNote || "所有操作均在浏览器本地完成，不上传数据",
    count: msgs.count || (locale === "en" ? "lines" : locale === "es" ? "líneas" : "条"),
  }

  const [input, setInput] = useState("")
  const [format, setFormat] = useState("YYYY-MM-DD H:i:s")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    const res = parseBatch(input, format)
    setOutput(res)
  }

  const handleSample = () => {
    setInput(SAMPLE_INPUT)
    setOutput(parseBatch(SAMPLE_INPUT, format))
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

  const handleFormatChange = (v: string) => {
    setFormat(v)
    if (input.trim() && output) {
      setOutput(parseBatch(input, v))
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <label className="text-sm font-medium">{t.formatLabel}:</label>
          <select
            value={format}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[200px]"
          >
            {BATCH_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-400 hidden md:inline">支持 7 种日期格式，自动识别秒级/毫秒级</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <button onClick={handleConvert} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {t.convert}
          </button>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border rounded-lg hover:bg-gray-50">
            {t.sample}
          </button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border rounded-lg hover:bg-gray-50">
            {copied ? t.copied : t.copy}
          </button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 border rounded-lg hover:bg-gray-50">
            {t.clear}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-500">{t.inputLabel}</div>
              {input && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{input.split("\n").filter((l) => l.trim()).length} {t.count}</span>}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-[320px] p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-500">{t.outputLabel}</div>
              {output && <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded">{output.split("\n").filter((l) => l.trim()).length} {t.count}</span>}
            </div>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={t.outputPlaceholder}
              className="w-full h-[320px] p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50/50"
              readOnly={false}
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">{t.localNote}</div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <div className="font-medium mb-1">说明 / Instructions</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>{locale === "en" ? "Supports both 10-digit (seconds) and 13-digit (milliseconds) timestamps, auto-detected per line." : locale === "es" ? "Soporta timestamps de 10 dígitos (segundos) y 13 dígitos (milisegundos), detección automática." : "支持 10 位秒级和 13 位毫秒级时间戳，逐行自动识别，无需手动区分。"}</li>
          <li>{locale === "en" ? "Invalid lines will show ❌ Invalid timestamp: original content" : locale === "es" ? "Líneas inválidas mostrarán ❌" : "无效行将标记为 ❌ 无效时间戳: 原始内容，便于定位问题。"}</li>
          <li>{locale === "en" ? "All processing is done locally, timestamp data never leaves your browser." : locale === "es" ? "Todo se procesa localmente." : "所有转换在浏览器本地完成，数据不会上传。"}</li>
        </ul>
      </div>
    </div>
  )
}
