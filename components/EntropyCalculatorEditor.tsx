"use client"
import { useMemo, useState } from "react"
import { calculateEntropy } from "@/lib/passwordEntropy"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    inputPlaceholder: "输入或粘贴密码",
    show: "显示",
    hide: "隐藏",
    lengthLabel: "密码长度",
    poolLabel: "字符池大小",
    entropyLabel: "熵 (bit)",
    combinationsLabel: "组合数 (2^熵)",
    strengthLabel: "强度评级",
    localNote: "所有计算均在浏览器本地完成，不上传任何数据",
  },
  en: {
    inputPlaceholder: "Enter or paste a password",
    show: "Show",
    hide: "Hide",
    lengthLabel: "Length",
    poolLabel: "Character Pool",
    entropyLabel: "Entropy (bit)",
    combinationsLabel: "Combinations (2^entropy)",
    strengthLabel: "Strength",
    localNote: "All calculations are completed locally in your browser, no data is uploaded",
  },
  es: {
    inputPlaceholder: "Introduzca o pegue una contraseña",
    show: "Mostrar",
    hide: "Ocultar",
    lengthLabel: "Longitud",
    poolLabel: "Conjunto de Caracteres",
    entropyLabel: "Entropía (bit)",
    combinationsLabel: "Combinaciones (2^entropía)",
    strengthLabel: "Nivel de Fuerza",
    localNote: "Todos los cálculos se completan localmente en su navegador, no se suben datos",
  },
}

const STRENGTH_STYLES: Record<string, string> = {
  弱: "bg-red-50 text-red-600 border-red-200",
  一般: "bg-orange-50 text-orange-600 border-orange-200",
  强: "bg-blue-50 text-blue-600 border-blue-200",
  很强: "bg-green-50 text-green-600 border-green-200",
  极强: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

export default function EntropyCalculatorEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.entropyCalculator || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    inputPlaceholder: raw.inputPlaceholder || d.inputPlaceholder,
    show: raw.show || d.show,
    hide: raw.hide || d.hide,
    lengthLabel: raw.lengthLabel || d.lengthLabel,
    poolLabel: raw.poolLabel || d.poolLabel,
    entropyLabel: raw.entropyLabel || d.entropyLabel,
    combinationsLabel: raw.combinationsLabel || d.combinationsLabel,
    strengthLabel: raw.strengthLabel || d.strengthLabel,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const result = useMemo(() => calculateEntropy(password), [password])
  const strengthStyle = STRENGTH_STYLES[result.strength] || STRENGTH_STYLES["弱"]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-2">
            <input
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="flex-1 px-3 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            <button
              onClick={() => setVisible(!visible)}
              className="px-3 py-2 text-sm text-gray-600 border rounded-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap"
            >
              {visible ? msgs.hide : msgs.show}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-400">{msgs.lengthLabel}</div>
            <div className="mt-1 text-xl font-semibold text-gray-800">{result.length}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-400">{msgs.poolLabel}</div>
            <div className="mt-1 text-xl font-semibold text-gray-800">{result.poolSize}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-400">{msgs.entropyLabel}</div>
            <div className="mt-1 text-xl font-semibold text-gray-800">
              {result.entropyBits > 0 ? result.entropyBits.toFixed(1) : "0"}
            </div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-gray-400">{msgs.combinationsLabel}</div>
            <div className="mt-1 text-xl font-semibold text-gray-800 break-all">
              {result.combinations}
            </div>
          </div>
          <div className={`rounded-xl border p-3 ${strengthStyle}`}>
            <div className="text-xs opacity-70">{msgs.strengthLabel}</div>
            <div className="mt-1 text-xl font-semibold">{result.strength}</div>
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
