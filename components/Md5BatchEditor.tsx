"use client"
import { useState } from "react"
import { md5BatchFormatLines } from "@/lib/md5Batch"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: "apple\nbanana\n你好",
  en: "apple\nbanana\nhello",
  es: "manzana\nplátano\nhola",
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    action: "批量加密",
    lengthLabel: "输出长度",
    caseLabel: "大小写",
    len32: "32位",
    len16: "16位",
    lower: "小写",
    upper: "大写",
    inputPlaceholder: "请输入需要处理的数据，每行一个...",
    outputPlaceholder: "这里用于显示批量加密的结果，每行对应输入的一行",
    sample: "查看示例",
    copy: "复制结果",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    action: "Bulk Encrypt",
    lengthLabel: "Output Length",
    caseLabel: "Letter Case",
    len32: "32-bit",
    len16: "16-bit",
    lower: "Lowercase",
    upper: "Uppercase",
    inputPlaceholder: "Enter the data to process, one item per line...",
    outputPlaceholder: "The bulk encryption result will appear here, one line per input line",
    sample: "Sample",
    copy: "Copy Result",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    action: "Cifrar en Lote",
    lengthLabel: "Longitud de Salida",
    caseLabel: "Mayúsculas/Minúsculas",
    len32: "32 bits",
    len16: "16 bits",
    lower: "Minúsculas",
    upper: "Mayúsculas",
    inputPlaceholder: "Introduzca los datos a procesar, uno por línea...",
    outputPlaceholder: "El resultado del cifrado por lotes se mostrará aquí, una línea por cada línea de entrada",
    sample: "Ejemplo",
    copy: "Copiar Resultado",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

export default function Md5BatchEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.md5Batch || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    action: raw.action || d.action,
    lengthLabel: raw.lengthLabel || d.lengthLabel,
    caseLabel: raw.caseLabel || d.caseLabel,
    len32: raw.len32 || d.len32,
    len16: raw.len16 || d.len16,
    lower: raw.lower || d.lower,
    upper: raw.upper || d.upper,
    inputPlaceholder: raw.inputPlaceholder || d.inputPlaceholder,
    outputPlaceholder: raw.outputPlaceholder || d.outputPlaceholder,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [lengthOpt, setLengthOpt] = useState<"32" | "16">("32")
  const [caseOpt, setCaseOpt] = useState<"lower" | "upper">("lower")
  const [copied, setCopied] = useState(false)

  const handleBatch = () => {
    setOutput(
      md5BatchFormatLines(input, {
        length: lengthOpt === "16" ? 16 : 32,
        uppercase: caseOpt === "upper",
      }).join("\n")
    )
  }
  const handleSample = () => {
    setInput(SAMPLES[locale] || SAMPLES.zh)
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
        <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-gray-50">
          <span className="text-xs text-gray-500">{msgs.lengthLabel}</span>
          <select
            value={lengthOpt}
            onChange={(e) => setLengthOpt(e.target.value as "32" | "16")}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="32">{msgs.len32}</option>
            <option value="16">{msgs.len16}</option>
          </select>
          <span className="text-xs text-gray-500">{msgs.caseLabel}</span>
          <select
            value={caseOpt}
            onChange={(e) => setCaseOpt(e.target.value as "lower" | "upper")}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="lower">{msgs.lower}</option>
            <option value="upper">{msgs.upper}</option>
          </select>
          <button
            onClick={handleBatch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {msgs.action}
          </button>
          <button
            onClick={handleSample}
            className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          >
            {msgs.sample}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          >
            {copied ? msgs.copied : msgs.copy}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm text-gray-600 hover:text-red-600"
          >
            {msgs.clear}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">输入</div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>结果</span>
              {output && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {output.split("\n").length} 行
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
