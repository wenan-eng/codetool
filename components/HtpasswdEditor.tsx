"use client"
import { useState } from "react"
import { htpasswdGenerate, type HtpasswdAlgorithm } from "@/lib/htpasswd"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, { username: string; password: string }> = {
  zh: { username: "admin", password: "MySQL@123456" },
  en: { username: "editor", password: "MyS3cureP@ss!" },
  es: { username: "usuario", password: "ClaveSegura@2026" },
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    action: "点击生成",
    usernameLabel: "用户名",
    usernamePlaceholder: "请输入用户名",
    passwordLabel: "密码",
    passwordPlaceholder: "请输入密码",
    algoLabel: "算法",
    resultLabel: "输出结果",
    resultPlaceholder: "生成的 htpasswd 条目会显示在这里...",
    sample: "查看示例",
    copy: "复制",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    action: "Generate",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter the username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter the password",
    algoLabel: "Algorithm",
    resultLabel: "Output",
    resultPlaceholder: "The generated htpasswd entry will appear here...",
    sample: "Sample",
    copy: "Copy",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    action: "Generar",
    usernameLabel: "Usuario",
    usernamePlaceholder: "Introduzca el nombre de usuario",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Introduzca la contraseña",
    algoLabel: "Algoritmo",
    resultLabel: "Resultado",
    resultPlaceholder: "La entrada htpasswd generada aparecerá aquí...",
    sample: "Ejemplo",
    copy: "Copiar",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

export default function HtpasswdEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.htpasswd || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    action: raw.action || d.action,
    usernameLabel: raw.usernameLabel || d.usernameLabel,
    usernamePlaceholder: raw.usernamePlaceholder || d.usernamePlaceholder,
    passwordLabel: raw.passwordLabel || d.passwordLabel,
    passwordPlaceholder: raw.passwordPlaceholder || d.passwordPlaceholder,
    algoLabel: raw.algoLabel || d.algoLabel,
    resultLabel: raw.resultLabel || d.resultLabel,
    resultPlaceholder: raw.resultPlaceholder || d.resultPlaceholder,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [algo, setAlgo] = useState<HtpasswdAlgorithm>("SHA")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    try {
      const line = await htpasswdGenerate(username, password, algo)
      setResult(line)
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setResult("")
    }
  }
  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setUsername(s.username)
    setPassword(s.password)
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
    setUsername("")
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
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">{msgs.usernameLabel}</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={msgs.usernamePlaceholder}
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{msgs.passwordLabel}</div>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={msgs.passwordPlaceholder}
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{msgs.algoLabel}</div>
              <select
                value={algo}
                onChange={(e) => setAlgo(e.target.value as HtpasswdAlgorithm)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              >
                <option value="SHA">SHA-1</option>
                <option value="SSHA">SSHA 加盐</option>
              </select>
            </div>
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
