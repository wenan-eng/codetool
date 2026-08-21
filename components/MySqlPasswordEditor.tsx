"use client"
import { useState } from "react"
import { mysqlPassword } from "@/lib/mysqlPassword"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: "MySQL@123456",
  en: "MyS3cureP@ss!",
  es: "ClaveSegura@2026",
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    action: "生成密码",
    inputLabel: "明文密码",
    inputPlaceholder: "请输入明文密码，如：MySQL@123456",
    resultLabel: "结果",
    resultPlaceholder: "生成的哈希值会显示在这里...",
    emptyError: "密码不能为空",
    sample: "查看示例",
    copy: "复制",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    action: "Generate Password",
    inputLabel: "Plain Password",
    inputPlaceholder: "Enter the plain password, e.g. MySQL@123456",
    resultLabel: "Result",
    resultPlaceholder: "The generated hash will appear here...",
    emptyError: "Password cannot be empty",
    sample: "Sample",
    copy: "Copy",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    action: "Generar contraseña",
    inputLabel: "Contraseña en texto plano",
    inputPlaceholder: "Introduzca la contraseña en texto plano, p. ej. MySQL@123456",
    resultLabel: "Resultado",
    resultPlaceholder: "El hash generado aparecerá aquí...",
    emptyError: "La contraseña no puede estar vacía",
    sample: "Ejemplo",
    copy: "Copiar",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

export default function MySqlPasswordEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.mysqlPassword || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    action: raw.action || d.action,
    inputLabel: raw.inputLabel || d.inputLabel,
    inputPlaceholder: raw.inputPlaceholder || d.inputPlaceholder,
    resultLabel: raw.resultLabel || d.resultLabel,
    resultPlaceholder: raw.resultPlaceholder || d.resultPlaceholder,
    emptyError: raw.emptyError || d.emptyError,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!password) {
      setError(msgs.emptyError)
      setResult("")
      return
    }
    try {
      const hash = await mysqlPassword(password)
      setResult(hash)
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setResult("")
    }
  }
  const handleSample = () => {
    setPassword(SAMPLES[locale] || SAMPLES.zh)
    setResult("")
    setError("")
  }
  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const handleClear = () => {
    setPassword("")
    setResult("")
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
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

        <div className="p-4 space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">{msgs.inputLabel}</div>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">{msgs.resultLabel}</div>
            {result ? (
              <div className="border rounded-lg px-3 py-3 font-mono text-sm break-all bg-gray-50/50">
                {result}
              </div>
            ) : (
              <div className="border rounded-lg px-3 py-6 text-sm text-gray-400 text-center">
                {msgs.resultPlaceholder}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
