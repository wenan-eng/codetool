"use client"
import { useState } from "react"
import { keywordDensity } from "@/lib/webmasterTools"

export default function DensityEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [rows, setRows] = useState<{ word: string; count: number; pct: number }[]>([])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : es)

  const run = () => {
    setRows(keywordDensity(input))
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t("粘贴网页正文或 HTML 内容，统计高频词密度（自动过滤停用词）...", "Paste page content to compute keyword density (stop words filtered)...", "Pegue el contenido para calcular la densidad...")} className="w-full h-44 p-3 border rounded-xl text-sm" />
      <button onClick={run} disabled={!input.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{t("开始统计", "Analyze", "Analizar")}</button>
      {rows.length > 0 && (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b"><th className="p-3">{t("关键词", "Keyword", "Palabra")}</th><th className="p-3">{t("出现次数", "Count", "Veces")}</th><th className="p-3">{t("密度", "Density", "Densidad")}</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.word} className="border-b last:border-0">
                  <td className="p-3 font-medium">{r.word}</td>
                  <td className="p-3">{r.count}</td>
                  <td className="p-3 font-mono text-xs">{r.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("一般建议核心关键词密度控制在 2%-8%；所有操作均在浏览器本地完成", "Core keyword density of 2%-8% is generally recommended. All local.", "Se recomienda una densidad del 2%-8%. Todo local.")}</p>
    </div>
  )
}
