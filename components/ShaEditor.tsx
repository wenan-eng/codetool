"use client"
import { useState } from "react"
import { shaHash, type ShaAlgorithm } from "@/lib/shaHash"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const ALGORITHMS: ShaAlgorithm[] = ["SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"]

const SAMPLES: Record<string, string> = {
  zh: "你好 hello SHA 123",
  en: "Hello world SHA 123",
  es: "Hola mundo SHA 123",
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    action: "生成哈希",
    algoLabel: "算法",
    caseLabel: "大小写",
    lower: "小写",
    upper: "大写",
    inputPlaceholderPrefix: "请输入要计算",
    inputPlaceholderSuffix: "哈希的文本，例如：Hello World",
    outputPlaceholderPrefix: "生成的",
    outputPlaceholderSuffix: "哈希值将显示在此处...",
    sample: "查看示例",
    copy: "复制结果",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    action: "Generate Hash",
    algoLabel: "Algorithm",
    caseLabel: "Letter Case",
    lower: "Lowercase",
    upper: "Uppercase",
    inputPlaceholderPrefix: "Enter the text to hash with",
    inputPlaceholderSuffix: ", e.g.: Hello World",
    outputPlaceholderPrefix: "The generated",
    outputPlaceholderSuffix: "hash will appear here...",
    sample: "Sample",
    copy: "Copy Result",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    action: "Generar Hash",
    algoLabel: "Algoritmo",
    caseLabel: "Mayúsculas/Minúsculas",
    lower: "Minúsculas",
    upper: "Mayúsculas",
    inputPlaceholderPrefix: "Introduzca el texto para calcular el hash",
    inputPlaceholderSuffix: ", por ejemplo: Hello World",
    outputPlaceholderPrefix: "El hash",
    outputPlaceholderSuffix: "generado se mostrará aquí...",
    sample: "Ejemplo",
    copy: "Copiar Resultado",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

export default function ShaEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.sha || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    action: raw.action || d.action,
    algoLabel: raw.algoLabel || d.algoLabel,
    caseLabel: raw.caseLabel || d.caseLabel,
    lower: raw.lower || d.lower,
    upper: raw.upper || d.upper,
    inputPlaceholderPrefix: raw.inputPlaceholderPrefix || d.inputPlaceholderPrefix,
    inputPlaceholderSuffix: raw.inputPlaceholderSuffix || d.inputPlaceholderSuffix,
    outputPlaceholderPrefix: raw.outputPlaceholderPrefix || d.outputPlaceholderPrefix,
    outputPlaceholderSuffix: raw.outputPlaceholderSuffix || d.outputPlaceholderSuffix,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [algo, setAlgo] = useState<ShaAlgorithm>("SHA-256")
  const [caseOpt, setCaseOpt] = useState<"lower" | "upper">("lower")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    try {
      setOutput(await shaHash(input, algo, caseOpt === "upper"))
    } catch (error) {
      setOutput(error instanceof Error ? error.message : String(error))
    }
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
          <span className="text-xs text-gray-500">{msgs.algoLabel}</span>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as ShaAlgorithm)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            {ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
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
            onClick={handleGenerate}
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
              placeholder={`${msgs.inputPlaceholderPrefix} ${algo} ${msgs.inputPlaceholderSuffix}`}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">结果</div>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={`${msgs.outputPlaceholderPrefix} ${algo} ${msgs.outputPlaceholderSuffix}`}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50 break-all"
            />
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
