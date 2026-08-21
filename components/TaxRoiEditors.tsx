"use client"
import { useState } from "react"
import { bonusTax, roiMetrics, equalPayment } from "@/lib/financeTools"

export function BonusTaxEditor({ locale = "zh" }: { locale?: string }) {
  const [bonus, setBonus] = useState("")
  const [rows, setRows] = useState<[string, string][]>([])
  const [error, setError] = useState("")
  const t = (zh: string, en?: string, es?: string) => zh
  const fmt = (n: number) => n.toLocaleString("zh-CN", { maximumFractionDigits: 2 })

  const run = () => {
    setError(""); setRows([])
    try {
      const r = bonusTax(Number(bonus))
      setRows([
        [t("适用税率", "Rate", "Tasa"), `${Math.round(r.rate * 100)}%`],
        ["速算扣除数", `¥${fmt(r.quickDeduct)}`],
        [t("应缴个税", "Tax", "Impuesto"), `¥${fmt(r.tax)}`],
        [t("税后到手", "After tax", "Neto"), `¥${fmt(r.afterTax)}`],
      ])
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("年终奖金额 (元)", "Bonus amount (CNY)", "Importe (CNY)")}</span><input value={bonus} onChange={e => setBonus(e.target.value)} inputMode="decimal" placeholder="36000" className="p-3 border rounded-xl text-sm" /></label>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <button onClick={run} disabled={!bonus.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{t("开始计算", "Calculate", "Calcular")}</button>
      {rows.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between p-3 border-b last:border-0 text-sm"><span className="text-gray-500">{k}</span><span className="font-mono font-medium">{v}</span></div>)}
        </div>
      )}
      <p className="text-xs text-gray-400">按全年一次性奖金单独计税政策（月度税率表换算）；政策调整时以官方为准。</p>
    </div>
  )
}

export function StampDutyEditor({ locale = "zh" }: { locale?: string }) {
  const [amount, setAmount] = useState("")
  const [ratePct, setRatePct] = useState("0.05")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const fmt = (n: number) => n.toLocaleString("zh-CN", { maximumFractionDigits: 2 })

  const run = () => {
    setError("")
    try {
      const tax = Number(amount) * (Number(ratePct) / 100)
      if (Number.isNaN(tax) || Number(amount) <= 0) throw new Error("请输入有效的合同金额")
      setResult(`应缴印花税：${fmt(tax)} 元`)
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">合同金额 (元)</span><input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="1000000" className="p-3 border rounded-xl text-sm" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">税率 (%)</span><input value={ratePct} onChange={e => setRatePct(e.target.value)} inputMode="decimal" className="p-3 border rounded-xl text-sm" /></label>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <button onClick={run} disabled={!amount.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">开始计算</button>
      {result && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 font-mono font-bold text-blue-700">{result}</div>}
      <p className="text-xs text-gray-400">常见档位：买卖合同 0.03%、产权转移书据 0.05%、营业账簿 0.025%；以最新政策为准。</p>
    </div>
  )
}

export function RoiEditor({ locale = "zh" }: { locale?: string }) {
  const [revenue, setRevenue] = useState("")
  const [cost, setCost] = useState("")
  const [rows, setRows] = useState<[string, string][]>([])
  const [error, setError] = useState("")
  const fmt = (n: number) => n.toLocaleString("zh-CN", { maximumFractionDigits: 2 })

  const run = () => {
    setError(""); setRows([])
    try {
      const r = roiMetrics(Number(revenue), Number(cost))
      setRows([
        ["利润", fmt(r.profit)],
        ["利润率(按收入)", `${r.marginPct}%`],
        ["投资回报率 ROI", `${r.roiPct}%`],
      ])
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">售价/收益 (元)</span><input value={revenue} onChange={e => setRevenue(e.target.value)} inputMode="decimal" className="p-3 border rounded-xl text-sm" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">成本 (元)</span><input value={cost} onChange={e => setCost(e.target.value)} inputMode="decimal" className="p-3 border rounded-xl text-sm" /></label>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <button onClick={run} disabled={!revenue.trim() || !cost.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">开始计算</button>
      {rows.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between p-3 border-b last:border-0 text-sm"><span className="text-gray-500">{k}</span><span className="font-mono font-medium">{v}</span></div>)}
        </div>
      )}
    </div>
  )
}
