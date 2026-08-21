"use client"
import { useState } from "react"
import { generatePasswords } from "@/lib/randomPwd"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    generate: "生成密码",
    count: "数量",
    minLength: "最小长度",
    maxLength: "最大长度",
    uppercase: "大写字母 A-Z",
    lowercase: "小写字母 a-z",
    digits: "数字 0-9",
    symbols: "特殊符号 !@#$%^&*",
    customChars: "自定义字符集（追加）",
    customCharsPlaceholder: "选填，追加到字符池，例如：+-=?",
    charsetTitle: "字符类型",
    empty: "点击「生成密码」开始",
    clear: "清空数据",
    copied: "已复制",
    copy: "复制",
    localNote: "所有密码均在浏览器本地使用安全随机数生成，不上传任何数据",
  },
  en: {
    generate: "Generate Passwords",
    count: "Count",
    minLength: "Min Length",
    maxLength: "Max Length",
    uppercase: "Uppercase A-Z",
    lowercase: "Lowercase a-z",
    digits: "Digits 0-9",
    symbols: "Symbols !@#$%^&*",
    customChars: "Custom Characters (appended)",
    customCharsPlaceholder: "Optional, appended to the pool, e.g. +-=?",
    charsetTitle: "Character Types",
    empty: "Click Generate Passwords to start",
    clear: "Clear",
    copied: "Copied",
    copy: "Copy",
    localNote: "All passwords are generated locally in your browser with secure randomness, no data is uploaded",
  },
  es: {
    generate: "Generar Contraseñas",
    count: "Cantidad",
    minLength: "Longitud Mínima",
    maxLength: "Longitud Máxima",
    uppercase: "Mayúsculas A-Z",
    lowercase: "Minúsculas a-z",
    digits: "Dígitos 0-9",
    symbols: "Símbolos !@#$%^&*",
    customChars: "Caracteres Personalizados (añadidos)",
    customCharsPlaceholder: "Opcional, se añade al conjunto, p.ej. +-=?",
    charsetTitle: "Tipos de Caracteres",
    empty: "Haga clic en Generar Contraseñas para empezar",
    clear: "Limpiar",
    copied: "Copiado",
    copy: "Copiar",
    localNote: "Todas las contraseñas se generan localmente con aleatoriedad segura, no se suben datos",
  },
}

export default function RandomPwdEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.randomPwd || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    generate: raw.generate || d.generate,
    count: raw.count || d.count,
    minLength: raw.minLength || d.minLength,
    maxLength: raw.maxLength || d.maxLength,
    uppercase: raw.uppercase || d.uppercase,
    lowercase: raw.lowercase || d.lowercase,
    digits: raw.digits || d.digits,
    symbols: raw.symbols || d.symbols,
    customChars: raw.customChars || d.customChars,
    customCharsPlaceholder: raw.customCharsPlaceholder || d.customCharsPlaceholder,
    charsetTitle: raw.charsetTitle || d.charsetTitle,
    empty: raw.empty || d.empty,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    copy: raw.copy || d.copy,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [count, setCount] = useState(5)
  const [minLength, setMinLength] = useState(8)
  const [maxLength, setMaxLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [customChars, setCustomChars] = useState("")
  const [passwords, setPasswords] = useState<string[]>([])
  const [error, setError] = useState("")
  const [copiedIndex, setCopiedIndex] = useState(-1)

  const handleGenerate = () => {
    try {
      setPasswords(
        generatePasswords({
          count,
          minLength,
          maxLength,
          uppercase,
          lowercase,
          digits,
          symbols,
          customChars,
        })
      )
      setError("")
    } catch (e) {
      setPasswords([])
      setError((e as Error).message)
    }
  }
  const handleCopy = async (index: number) => {
    await navigator.clipboard.writeText(passwords[index])
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(-1), 1500)
  }
  const handleClear = () => {
    setPasswords([])
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="text-sm text-gray-600 space-y-1">
              <span>{msgs.count}</span>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="text-sm text-gray-600 space-y-1">
              <span>
                {msgs.minLength}: {minLength}
              </span>
              <input
                type="range"
                min={4}
                max={64}
                value={minLength}
                onChange={(e) => setMinLength(Number(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="text-sm text-gray-600 space-y-1">
              <span>
                {msgs.maxLength}: {maxLength}
              </span>
              <input
                type="range"
                min={4}
                max={64}
                value={maxLength}
                onChange={(e) => setMaxLength(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600">{msgs.charsetTitle}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { label: msgs.uppercase, value: uppercase, set: setUppercase },
                { label: msgs.lowercase, value: lowercase, set: setLowercase },
                { label: msgs.digits, value: digits, set: setDigits },
                { label: msgs.symbols, value: symbols, set: setSymbols },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <label className="block text-sm text-gray-600 space-y-1">
            <span>{msgs.customChars}</span>
            <input
              type="text"
              value={customChars}
              onChange={(e) => setCustomChars(e.target.value)}
              placeholder={msgs.customCharsPlaceholder}
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              {msgs.generate}
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-2 text-sm text-gray-600 hover:text-red-600"
            >
              {msgs.clear}
            </button>
          </div>

          {error && (
            <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
          )}
        </div>

        <div className="divide-y">
          {passwords.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-400">{msgs.empty}</div>
          ) : (
            passwords.map((pwd, index) => (
              <div key={`${index}-${pwd}`} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50">
                <span className="font-mono text-sm break-all">{pwd}</span>
                <button
                  onClick={() => handleCopy(index)}
                  className="shrink-0 px-3 py-1 text-xs text-gray-600 border rounded-md hover:text-blue-600 hover:border-blue-600"
                >
                  {copiedIndex === index ? msgs.copied : msgs.copy}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
