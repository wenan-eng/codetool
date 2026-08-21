"use client"
import { useState } from "react"
import { solveProportion } from "@/lib/webmasterTools"

export default function ProportionCalculatorEditor({ locale = "zh" }: { locale?: string }) {
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [c, setC] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError(""); setResult("")
    try {
      const d = solveProportion(Number(a), Number(b), Number(c))
      setResult(String(Number(d.toPrecision(10))))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 justify-center text-lg font-mono flex-wrap">
        {([["a", a, setA], ["b", b, setB], ["c", c, setC]] as [string, string, (v: string) => void][]).map(([k, v, set], i) => (
          <span key={k} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-400">{i === 1 ? ":" : "="}</span>}
            <input value={v} onChange={e => set(e.target.value)} inputMode="decimal" placeholder={k} className="w-20 p-3 border rounded-xl text-center focus:outline-none focus:border-blue-400" />
          </span>
        ))}
        <span className="text-gray-400">:</span>
        <span className={`w-20 p-3 border rounded-xl text-center bg-gray-50 min-h-[50px] ${result ? "text-blue-600 font-bold" : "text-gray-300"}`}>{result || "d"}</span>
      </div>
      {error && <div className="text-sm text-red-500 text-center">{error}</div>}
      <button onClick={run} disabled={!a.trim() || !b.trim() || !c.trim()} className="self-center px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
        {t("求第四项 (a:b = c:d)", "Solve for d", "Resolver d")}
      </button>
      <p className="text-xs text-gray-400 text-center">{t("公式：d = b × c ÷ a；所有操作均在浏览器本地完成", "d = b × c ÷ a; all processing is local.", "d = b × c ÷ a; todo local.")}</p>
    </div>
  )
}
