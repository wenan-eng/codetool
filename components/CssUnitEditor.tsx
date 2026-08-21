"use client"
import { useState } from "react"
import { cssConvert } from "@/lib/textMisc"

const UNITS = ["px", "rem", "em", "pt", "%"] as const
type Unit = (typeof UNITS)[number]

export default function CssUnitEditor({ locale = "zh" }: { locale?: string }) {
  const [value, setValue] = useState("16")
  const [from, setFrom] = useState<Unit>("px")
  const [to, setTo] = useState<Unit>("rem")
  const [root, setRoot] = useState(16)
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError("")
    const num = Number(value)
    if (value.trim() === "" || Number.isNaN(num)) { setError(t("请输入有效数值", "Enter a valid number", "Introduzca un número válido")); return }
    try {
      setResult(String(Number(cssConvert(num, from, to, root).toPrecision(8))))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        {t("根字号(root)", "Root font size", "Tamaño raíz")}
        <input type="number" value={root} onChange={e => setRoot(Number(e.target.value) || 16)} className="w-24 p-2 border rounded-lg" />
        px
      </label>
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div className="flex flex-col gap-2">
          <input value={value} onChange={e => { setValue(e.target.value); setResult("") }} inputMode="decimal" placeholder={t("请输入要转换的数值", "Enter a value", "Introduzca un valor")} className="w-full p-3 border rounded-xl text-sm" />
          <select value={from} onChange={e => setFrom(e.target.value as Unit)} className="p-2.5 border rounded-lg text-sm bg-white">{UNITS.map(x => <option key={x} value={x}>{x}</option>)}</select>
        </div>
        <button onClick={() => { setFrom(to); setTo(from); setResult("") }} className="hidden md:flex h-10 w-10 items-center justify-center border rounded-full text-blue-600 hover:bg-blue-50 mb-1">⇄</button>
        <div className="flex flex-col gap-2">
          <div className="w-full p-3 border rounded-xl text-sm bg-gray-50 font-mono min-h-[46px] break-all">{result || "—"}</div>
          <select value={to} onChange={e => { setTo(e.target.value as Unit); setResult("") }} className="p-2.5 border rounded-lg text-sm bg-white">{UNITS.map(x => <option key={x} value={x}>{x}</option>)}</select>
        </div>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <button onClick={run} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("单位转换", "Convert", "Convertir")}</button>
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
