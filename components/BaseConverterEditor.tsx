"use client"
import { useState } from "react"
import { baseConvert } from "@/lib/textMisc"

export default function BaseConverterEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [fromBase, setFromBase] = useState(10)
  const [error, setError] = useState("")
  const [results, setResults] = useState<{ base: number; value: string }[]>([])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError("")
    setResults([])
    try {
      setResults([2, 8, 10, 16].map(b => ({ base: b, value: baseConvert(input, fromBase, b) })))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t("请输入要转换的数值", "Enter a value", "Introduzca un valor")}
          className="flex-1 p-3 border rounded-xl font-mono text-sm"
        />
        <select value={fromBase} onChange={e => setFromBase(Number(e.target.value))} className="p-3 border rounded-xl text-sm bg-white">
          {[2, 8, 10, 16].map(b => <option key={b} value={b}>{t("源进制", "From", "De")} {b}</option>)}
        </select>
        <button onClick={run} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{t("进制转换", "Convert", "Convertir")}</button>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {results.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {results.map(r => (
            <div key={r.base} className="flex items-center justify-between p-3 border-b last:border-0">
              <span className="text-sm text-gray-500">{t("目标进制", "Base", "Base")} {r.base}</span>
              <button onClick={() => navigator.clipboard.writeText(r.value)} className="font-mono text-sm hover:text-blue-600">{r.value} ⧉</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
