"use client"
import { useState } from "react"
import { csvMerge } from "@/lib/csvMerge"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string[]> = {
  zh: ["name,age\nAlice,30\nBob,25", "name,city\nCharlie,Beijing\nDavid,Shanghai"],
  en: ["name,age\nAlice,30\nBob,25", "name,city\nCharlie,NYC\nDavid,LA"],
  es: ["name,age\nAlicia,30\nBob,25", "name,city\nCarlos,Madrid\nDavid,Barcelona"],
}

export default function CsvMergeEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const cm = dict.csvMerge || dict["csv-merge"] || {}
  const editorFallback = dict.editor || {}

  const msgs = {
    merge: cm.merge || cm.action || (locale === "en" ? "Merge CSVs" : locale === "es" ? "Fusionar CSVs" : "合并 CSV"),
    sample: cm.sample || editorFallback.sample || "查看示例",
    copy: cm.copy || editorFallback.copy || "复制结果",
    clear: cm.clear || editorFallback.clear || "清空数据",
    copied: cm.copied || editorFallback.copied || "已复制",
    add: cm.add || (locale === "en" ? "Add CSV" : locale === "es" ? "Añadir CSV" : "添加 CSV"),
    remove: cm.remove || (locale === "en" ? "Remove" : locale === "es" ? "Eliminar" : "移除"),
    inputLabel: cm.inputLabel || (locale === "en" ? "CSV Input" : locale === "es" ? "Entrada CSV" : "CSV 输入"),
    outputLabel: cm.outputLabel || (locale === "en" ? "Merged Result" : locale === "es" ? "Resultado Fusionado" : "合并结果"),
    placeholder: cm.placeholder || cm.inputPlaceholder || (locale === "en" ? "Paste CSV, first row as header" : locale === "es" ? "Pegue CSV, primera fila cabecera" : "粘贴 CSV，首行为表头"),
    outputPlaceholder: cm.outputPlaceholder || (locale === "en" ? "Merged CSV will appear here" : locale === "es" ? "CSV fusionado aparecerá aquí" : "合并后的 CSV 将显示在这里"),
    localNote: cm.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
  }

  const [inputs, setInputs] = useState<string[]>(["", ""])
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleMerge = () => {
    const nonEmpty = inputs.filter(s => s.trim() !== "")
    if (nonEmpty.length === 0) {
      setError(locale === "en" ? "Please paste at least one CSV" : locale === "es" ? "Pegue al menos un CSV" : "请至少粘贴一个 CSV")
      return
    }
    try {
      const result = csvMerge(inputs)
      setOutput(result)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setInputs(s)
    setOutput(csvMerge(s))
    setError(null)
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleClear = () => {
    setInputs(["", ""])
    setOutput("")
    setError(null)
  }

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs]
    next[idx] = val
    setInputs(next)
  }

  const addInput = () => setInputs([...inputs, ""])
  const removeInput = (idx: number) => {
    if (inputs.length <= 1) return
    setInputs(inputs.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button onClick={handleMerge} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {msgs.merge}
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
          <button onClick={addInput} className="px-3 py-2 text-sm border rounded bg-white hover:bg-gray-50">
            {msgs.add}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="space-y-3">
            <div className="text-xs text-gray-500 font-medium">{msgs.inputLabel} ({inputs.length})</div>
            {inputs.map((val, idx) => (
              <div key={idx} className="relative border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center px-3 py-1 bg-gray-50 border-b">
                  <span className="text-xs text-gray-500">CSV {idx + 1}</span>
                  <button onClick={() => removeInput(idx)} className="text-xs text-gray-400 hover:text-red-600">
                    {msgs.remove}
                  </button>
                </div>
                <textarea
                  value={val}
                  onChange={e => updateInput(idx, e.target.value)}
                  placeholder={msgs.placeholder}
                  className="w-full h-[160px] p-3 font-mono text-sm resize-none focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="relative flex flex-col border rounded-lg overflow-hidden">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {output && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{output.split("\n").length} 行</span>}
            </div>
            <textarea
              value={output}
              onChange={e => setOutput(e.target.value)}
              placeholder={msgs.outputPlaceholder}
              className="w-full h-[360px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
            />
          </div>
        </div>

        {error && <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-200">{error}</div>}
        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
