"use client"
import { useState } from "react"
import { md4Hex } from "@/lib/md4"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: "你好 hello MD4 123",
  en: "Hello world MD4 123",
  es: "Hola mundo MD4 123",
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    action: "MD4加密",
    inputPlaceholder: "请在此输入您要MD4加密的文本内容...",
    lower32: "MD4-32 位小写",
    upper32: "MD4-32 位大写",
    emptyTip: "点击「MD4加密」后结果将显示在此处",
    sample: "查看示例",
    copy: "复制",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    action: "MD4 Encrypt",
    inputPlaceholder: "Enter the text you want to encrypt with MD4...",
    lower32: "MD4 32-bit Lowercase",
    upper32: "MD4 32-bit Uppercase",
    emptyTip: "Results will appear here after clicking MD4 Encrypt",
    sample: "Sample",
    copy: "Copy",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    action: "Cifrar MD4",
    inputPlaceholder: "Introduzca el texto que desea cifrar con MD4...",
    lower32: "MD4 32 bits Minúsculas",
    upper32: "MD4 32 bits Mayúsculas",
    emptyTip: "Los resultados aparecerán aquí tras hacer clic en Cifrar MD4",
    sample: "Ejemplo",
    copy: "Copiar",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

type Md4Result = {
  lower: string
  upper: string
}

export default function Md4Editor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.md4 || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    action: raw.action || d.action,
    inputPlaceholder: raw.inputPlaceholder || d.inputPlaceholder,
    lower32: raw.lower32 || d.lower32,
    upper32: raw.upper32 || d.upper32,
    emptyTip: raw.emptyTip || d.emptyTip,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [input, setInput] = useState("")
  const [result, setResult] = useState<Md4Result | null>(null)
  const [copiedKey, setCopiedKey] = useState("")

  const handleEncrypt = () => {
    const hex = md4Hex(input)
    setResult({ lower: hex, upper: hex.toUpperCase() })
  }
  const handleSample = () => {
    setInput(SAMPLES[locale] || SAMPLES.zh)
    setResult(null)
  }
  const handleCopy = async (key: string, value: string) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(""), 1500)
  }
  const handleClear = () => {
    setInput("")
    setResult(null)
  }

  const rows = result
    ? [
        { key: "lower", label: msgs.lower32, value: result.lower },
        { key: "upper", label: msgs.upper32, value: result.upper },
      ]
    : []

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleEncrypt}
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
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">结果</div>
            {rows.length > 0 ? (
              <div className="divide-y">
                {rows.map((row) => (
                  <div key={row.key} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">{row.label}</div>
                      <div className="font-mono text-sm break-all">{row.value}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(row.key, row.value)}
                      className="shrink-0 px-2 py-1 text-xs border rounded hover:bg-gray-50"
                    >
                      {copiedKey === row.key ? msgs.copied : msgs.copy}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-sm text-gray-400 px-6 text-center">
                {msgs.emptyTip}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
