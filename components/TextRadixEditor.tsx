"use client"
import { useState } from "react"
import { textToRadix, radixToText, type TextRadix } from "@/lib/textRadix"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const RADIX_NAMES: Record<TextRadix, Record<string, string>> = {
  16: { zh: "十六进制", en: "hexadecimal", es: "hexadecimal" },
  8: { zh: "八进制", en: "octal", es: "octal" },
  2: { zh: "二进制", en: "binary", es: "binario" },
}

const SAMPLES: Record<string, string> = {
  zh: "你好 hello 123",
  en: "Hello world 123",
  es: "Hola mundo 123",
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    toRadix: "文本转{radix}",
    fromRadix: "{radix}转文本",
    inputPlaceholder: "请输入要进行（文本与{radix}）互转的文本...",
    outputPlaceholder: "这里显示输出的{radix}结果",
    errorPrefix: "转换失败：",
    sample: "查看示例",
    copy: "复制结果",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    toRadix: "Text to {radix}",
    fromRadix: "{radix} to Text",
    inputPlaceholder: "Enter text to convert between text and {radix}...",
    outputPlaceholder: "The {radix} result will appear here",
    errorPrefix: "Conversion failed: ",
    sample: "Sample",
    copy: "Copy Result",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    toRadix: "Texto a {radix}",
    fromRadix: "{radix} a Texto",
    inputPlaceholder: "Introduzca el texto para convertir entre texto y {radix}...",
    outputPlaceholder: "Aquí se mostrará el resultado en {radix}",
    errorPrefix: "Error de conversión: ",
    sample: "Ejemplo",
    copy: "Copiar Resultado",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

function fill(template: string, radixName: string): string {
  return template.replace(/\{radix\}/g, radixName)
}

export default function TextRadixEditor({
  radix,
  locale = "zh",
}: {
  radix: TextRadix
  locale?: string
}) {
  const raw = (messagesMap[locale] || zh)?.textRadix || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const radixName = RADIX_NAMES[radix][locale] || RADIX_NAMES[radix].zh
  const msgs = {
    toRadix: raw.toRadix || fill(d.toRadix, radixName),
    fromRadix: raw.fromRadix || fill(d.fromRadix, radixName),
    inputPlaceholder: raw.inputPlaceholder || fill(d.inputPlaceholder, radixName),
    outputPlaceholder: raw.outputPlaceholder || fill(d.outputPlaceholder, radixName),
    errorPrefix: raw.errorPrefix || d.errorPrefix,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const handleToRadix = () => {
    setOutput(textToRadix(input, radix))
  }
  const handleFromRadix = () => {
    try {
      setOutput(radixToText(input, radix))
    } catch (e) {
      setOutput(msgs.errorPrefix + (e instanceof Error ? e.message : String(e)))
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
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleToRadix}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {msgs.toRadix}
          </button>
          <button
            onClick={handleFromRadix}
            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {msgs.fromRadix}
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
              readOnly={false}
            />
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
