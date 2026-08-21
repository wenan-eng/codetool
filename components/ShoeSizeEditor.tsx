"use client"
import { useState } from "react"
import { shoeConvert, shoeTable } from "@/lib/textMisc"

const KEYS = ["cn", "eu", "usM", "usW", "uk", "cm"] as const
type Key = (typeof KEYS)[number]

export default function ShoeSizeEditor({ locale = "zh" }: { locale?: string }) {
  const [fromKey, setFromKey] = useState<Key>("eu")
  const [input, setInput] = useState("")
  const [cn, setCn] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const labels: Record<Key, string> = { cn: t("中国码", "CN", "CN"), eu: "EU", usM: t("美码(男)", "US Men", "US Hombre"), usW: t("美码(女)", "US Women", "US Mujer"), uk: "UK", cm: "cm" }

  const run = () => {
    setCn(shoeConvert(input, fromKey))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        <select value={fromKey} onChange={e => setFromKey(e.target.value as Key)} className="p-3 border rounded-xl text-sm bg-white">
          {KEYS.map(k => <option key={k} value={k}>{labels[k]}</option>)}
        </select>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={t("请输入尺码，如 42", "Enter a size, e.g. 42", "Introduzca la talla, p. ej. 42")} className="flex-1 p-3 border rounded-xl text-sm" />
        <button onClick={run} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">{t("开始换算", "Convert", "Convertir")}</button>
      </div>
      {cn && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          {t("对应中国码：", "CN size: ", "Talla CN: ")}<span className="font-bold text-blue-700 text-lg">{cn}</span>
        </div>
      )}
      {!cn && input && <div className="text-sm text-gray-500">{t("未找到匹配尺码，请参考下表", "No match found, see table below", "Sin coincidencia, vea la tabla")}</div>}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b">{KEYS.map(k => <th key={k} className="p-2.5">{labels[k]}</th>)}</tr></thead>
          <tbody>
            {shoeTable().map((r, i) => (
              <tr key={i} className={`border-b last:border-0 ${cn === r.cn ? "bg-blue-50" : ""}`}>
                {KEYS.map(k => <td key={k} className="p-2.5">{r[k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400">{t("各品牌存在差异，表格仅供参考；所有操作均在浏览器本地完成", "Sizes vary by brand; table is for reference. All processing is local.", "Las tallas varían según marca; tabla de referencia. Todo local.")}</p>
    </div>
  )
}
