"use client"
import { useState } from "react"
import { rmbUpper } from "@/lib/textMisc"

export default function RmbUpperEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError("")
    setCopied(false)
    try {
      setResult(rmbUpper(Number(input)))
    } catch (e) {
      setResult("")
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          inputMode="decimal"
          placeholder={t("请输入人民币金额，如 1234.56", "Enter an amount, e.g. 1234.56", "Introduzca el importe, p. ej. 1234,56")}
          className="flex-1 p-3 border rounded-xl text-sm"
        />
        <button onClick={run} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{t("转大写", "Convert", "Convertir")}</button>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {result && (
        <button
          onClick={async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left text-lg font-medium tracking-wider hover:bg-blue-100"
        >
          {result} <span className="text-xs text-gray-400">{copied ? t("已复制", "Copied", "Copiado") : "⧉"}</span>
        </button>
      )}
      <p className="text-xs text-gray-400">{t("符合财务大写规范（壹贰叁肆伍陆柒捌玖拾佰仟万亿）；所有操作均在浏览器本地完成", "Follows financial uppercase standards; all processing is local.", "Sigue la norma financiera china; todo local.")}</p>
    </div>
  )
}
