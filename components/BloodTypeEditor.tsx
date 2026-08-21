"use client"
import { useState } from "react"
import { bloodPossibilities } from "@/lib/textMisc"

const TYPES = ["A", "B", "AB", "O"] as const

export default function BloodTypeEditor({ locale = "zh" }: { locale?: string }) {
  const [father, setFather] = useState<string>("A")
  const [mother, setMother] = useState<string>("B")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const result = bloodPossibilities(father, mother)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        {([["👨", t("父亲血型", "Father", "Padre"), father, setFather], ["👩", t("母亲血型", "Mother", "Madre"), mother, setMother]] as [string, string, string, (v: string) => void][]).map(([emoji, label, val, set]) => (
          <label key={label} className="flex flex-col gap-2 text-sm">
            <span className="text-gray-600">{emoji} {label}</span>
            <div className="flex gap-2">
              {TYPES.map(x => (
                <button key={x} onClick={() => set(x)} className={`flex-1 py-2 rounded-lg border text-sm ${val === x ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 hover:border-blue-300"}`}>{x}</button>
              ))}
            </div>
          </label>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="text-sm text-gray-500 mb-2">{t("子女可能的血型", "Possible child blood types", "Posibles tipos del hijo")}</div>
        <div className="flex gap-3 flex-wrap">
          {TYPES.map(x => (
            <span key={x} className={`px-4 py-2 rounded-full text-sm font-medium ${result.includes(x) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 line-through"}`}>{x}</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{t("基于 ABO 血型遗传规律的通用判断，极罕见孟买血型等特殊情况未计入；所有计算均在浏览器本地完成", "Based on standard ABO inheritance rules; rare cases like Bombay phenotype are not covered. All computed locally.", "Basado en las reglas ABO estándar; casos raros no incluidos. Todo local.")}</p>
    </div>
  )
}
