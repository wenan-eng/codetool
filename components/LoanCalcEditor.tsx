"use client"
import { useState } from "react"
import { equalPayment, equalPrincipal } from "@/lib/financeTools"

export default function LoanCalcEditor({ locale = "zh" }: { locale?: string }) {
  const [principal, setPrincipal] = useState("1000000")
  const [rate, setRate] = useState("4.25")
  const [years, setYears] = useState("30")
  const [mode, setMode] = useState<"equalPayment" | "equalPrincipal">("equalPayment")
  const [rows, setRows] = useState<[string, string][]>([])
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const fmt = (n: number) => n.toLocaleString("zh-CN", { maximumFractionDigits: 2 })

  const run = () => {
    setError(""); setRows([])
    try {
      const p = Number(principal), r = Number(rate), m = Math.round(Number(years) * 12)
      const res = mode === "equalPayment" ? equalPayment(p, r, m) : equalPrincipal(p, r, m)
      if (mode === "equalPayment") {
        setRows([
          [t("每月月供", "Monthly payment", "Cuota mensual"), `${fmt(res.monthly)} ${t("元", "CNY", "CNY")}`],
          [t("还款总额", "Total payment", "Pago total"), `${fmt(res.totalPayment)} ${t("元", "CNY", "CNY")}`],
          [t("利息总额", "Total interest", "Interés total"), `${fmt(res.totalInterest)} ${t("元", "CNY", "CNY")}`],
        ])
      } else {
        setRows([
          [t("首月月供", "First month", "Primera cuota"), `${fmt(res.firstMonth!)} ${t("元", "CNY", "CNY")}`],
          [t("末月月供", "Last month", "Última cuota"), `${fmt(res.lastMonth!)} ${t("元", "CNY", "CNY")}`],
          [t("每月递减", "Decreasing by", "Decremento"), `${fmt(res.decreasingBy!)} ${t("元", "CNY", "CNY")}`],
          [t("利息总额", "Total interest", "Interés total"), `${fmt(res.totalInterest)} ${t("元", "CNY", "CNY")}`],
          [t("还款总额", "Total payment", "Pago total"), `${fmt(res.totalPayment)} ${t("元", "CNY", "CNY")}`],
        ])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("贷款总额 (元)", "Principal (CNY)", "Principal (CNY)")}</span><input value={principal} onChange={e => setPrincipal(e.target.value)} inputMode="decimal" placeholder="543000" className="p-3 border rounded-xl text-sm" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("年利率 (%)", "Annual rate (%)", "Tasa anual (%)")}</span><input value={rate} onChange={e => setRate(e.target.value)} inputMode="decimal" placeholder="4.25" className="p-3 border rounded-xl text-sm" /></label>
      </div>
      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-sm flex-1"><span className="text-gray-600 whitespace-nowrap">{t("期限(年)", "Term (years)", "Plazo (años)")}</span><input value={years} onChange={e => setYears(e.target.value)} inputMode="numeric" className="w-full p-3 border rounded-xl text-sm" /></label>
        <select value={mode} onChange={e => setMode(e.target.value as "equalPayment" | "equalPrincipal")} className="p-3 border rounded-xl text-sm bg-white flex-1">
          <option value="equalPayment">{t("等额本息", "Equal installment", "Cuota fija")}</option>
          <option value="equalPrincipal">{t("等额本金", "Equal principal", "Capital fijo")}</option>
        </select>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <button onClick={run} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("开始计算", "Calculate", "Calcular")}</button>
      {rows.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between p-3 border-b last:border-0 text-sm"><span className="text-gray-500">{k}</span><span className="font-mono font-medium">{v}</span></div>
          ))}
        </div>
      )}
    </div>
  )
}
