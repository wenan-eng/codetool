"use client"
import { useState } from "react"
import { base32Encode, base32Decode } from "@/lib/base32Codec"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: "你好 hello Base32 123",
  en: "Hello world Base32 123",
  es: "Hola mundo Base32 123",
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    encode: "Base32编码",
    decode: "Base32解码",
    inputPlaceholder: "请输入文本内容，支持Base32的加密/解密。",
    outputPlaceholder: "输出的文本编码/解码结果...",
    sample: "查看示例",
    copy: "复制结果",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    encode: "Base32 Encode",
    decode: "Base32 Decode",
    inputPlaceholder: "Enter text to encode/decode with Base32...",
    outputPlaceholder: "The Base32 encoding/decoding result will appear here...",
    sample: "Sample",
    copy: "Copy Result",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    encode: "Codificar Base32",
    decode: "Decodificar Base32",
    inputPlaceholder: "Introduzca el texto para codificar/decodificar en Base32...",
    outputPlaceholder: "Aquí se mostrará el resultado de codificación/decodificación...",
    sample: "Ejemplo",
    copy: "Copiar Resultado",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

export default function Base32EncodeEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.base32Encode || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    encode: raw.encode || d.encode,
    decode: raw.decode || d.decode,
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
  const [copied, setCopied] = useState(false)

  const handleEncode = () => {
    try {
      setOutput(base32Encode(input))
    } catch (error) {
      setOutput(error instanceof Error ? error.message : String(error))
    }
  }
  const handleDecode = () => {
    try {
      setOutput(base32Decode(input))
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
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleEncode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {msgs.encode}
          </button>
          <button
            onClick={handleDecode}
            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {msgs.decode}
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
