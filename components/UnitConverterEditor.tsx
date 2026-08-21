"use client"
import { useMemo, useState } from "react"
import { convertUnit, getUnits, type CategoryKey } from "@/lib/unitConverter"

export default function UnitConverterEditor({ category, locale = "zh" }: { category: CategoryKey; locale?: string }) {
  const units = useMemo(() => getUnits(category), [category])
  const [value, setValue] = useState("1")
  const [from, setFrom] = useState(units[0]?.sym ?? "")
  const [to, setTo] = useState(units[1]?.sym ?? "")
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const num = Number(value)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setResult("")
  }

  const run = () => {
    setError("")
    if (value.trim() === "" || Number.isNaN(num)) { setError(t("请输入有效数值", "Enter a valid number", "Introduzca un número válido")); return }
    try {
      const r = convertUnit(category, num, from, to)
      setResult(String(Number(r.toPrecision(10))))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">{t("源单位", "From", "De")}</label>
          <input
            value={value}
            onChange={e => { setValue(e.target.value); setResult("") }}
            placeholder={t("请输入要转换的数值", "Enter a value", "Introduzca un valor")}
            inputMode="decimal"
            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <select value={from} onChange={e => setFrom(e.target.value)} className="p-2.5 border rounded-lg text-sm bg-white">
            {units.map(x => <option key={x.sym} value={x.sym}>{x.sym}（{x.name}）</option>)}
          </select>
        </div>
        <button onClick={swap} title="⇄" className="hidden md:flex h-10 w-10 items-center justify-center border rounded-full text-blue-600 hover:bg-blue-50 mb-1">⇄</button>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">{t("目标单位", "To", "A")}</label>
          <div className="w-full p-3 border rounded-xl text-sm bg-gray-50 font-mono min-h-[46px] break-all">{result || "—"}</div>
          <select value={to} onChange={e => { setTo(e.target.value); setResult("") }} className="p-2.5 border rounded-lg text-sm bg-white">
            {units.map(x => <option key={x.sym} value={x.sym}>{x.sym}（{x.name}）</option>)}
          </select>
        </div>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button onClick={run} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("单位转换", "Convert", "Convertir")}</button>
        <button onClick={() => { setValue(""); setResult(""); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {result && (
        <button
          onClick={async () => { await navigator.clipboard.writeText(`${value} ${from} = ${result} ${to}`); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          className="self-start px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
        >
          {copied ? t("已复制", "Copied", "Copiado") : `${value} ${from} = ${result} ${to} ⧉`}
        </button>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
