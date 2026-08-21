"use client"
import { useState } from "react"

const INSURANCE_BASE_NOTE = "五险一金按输入的缴费基数与比例估算，公积金比例可自行调整；个税按累计预扣简化为月度速算。"
const TAX_BRACKETS: [number, number, number][] = [[3000, 0.03, 0], [12000, 0.10, 210], [25000, 0.20, 1410], [35000, 0.25, 2660], [55000, 0.30, 4410], [80000, 0.35, 7160]]

function monthlyTax(taxable: number): number {
  for (const [limit, rate, deduct] of TAX_BRACKETS) {
    if (taxable <= limit) return Math.max(0, taxable * rate - deduct)
  }
  return Math.max(0, taxable * 0.45 - 15160)
}

export default function PayslipEditor({ locale = "zh" }: { locale?: string }) {
  const [name, setName] = useState("")
  const [base, setBase] = useState("10000")
  const [insuranceBase, setInsuranceBase] = useState("10000")
  const [fundPct, setFundPct] = useState(12)
  const [error, setError] = useState("")
  const [rows, setRows] = useState<[string, string][]>([])

  const t = (zh: string, en?: string, es?: string) => zh
  const fmt = (n: number) => n.toLocaleString("zh-CN", { maximumFractionDigits: 2 })

  const run = () => {
    setError(""); setRows([])
    try {
      const ib = Number(insuranceBase), b = Number(base)
      if (!ib || !b || b <= 0) throw new Error("请输入有效的工资金额")
      const pension = ib * 0.08, medical = ib * 0.02, unemployment = ib * 0.005
      const fund = ib * (fundPct / 100)
      const insuranceTotal = pension + medical + unemployment + fund
      const taxable = Math.max(0, b - insuranceTotal - 5000)
      const tax = monthlyTax(taxable)
      const net = b - insuranceTotal - tax
      setRows([
        ["税前工资", `¥${fmt(b)}`],
        [`养老保险 (8%)`, `-¥${fmt(pension)}`],
        [`医疗保险 (2%)`, `-¥${fmt(medical)}`],
        [`失业保险 (0.5%)`, `-¥${fmt(unemployment)}`],
        [`公积金 (${fundPct}%)`, `-¥${fmt(fund)}`],
        ["个人所得税", `-¥${fmt(tax)}`],
        ["税后到手", `¥${fmt(net)}`],
      ])
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">姓名</span><input value={name} onChange={e => setName(e.target.value)} placeholder="张三" className="p-3 border rounded-xl text-sm" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">税前基本工资 (元)</span><input value={base} onChange={e => setBase(e.target.value)} inputMode="decimal" className="p-3 border rounded-xl text-sm" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">五险一金缴费基数</span><input value={insuranceBase} onChange={e => setInsuranceBase(e.target.value)} inputMode="decimal" className="p-3 border rounded-xl text-sm" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">公积金比例 %</span><input type="number" value={fundPct} onChange={e => setFundPct(Number(e.target.value) || 0)} className="p-3 border rounded-xl text-sm" /></label>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <button onClick={run} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("生成工资条", "Generate Payslip", "Generar recibo")}</button>
      {rows.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {name && <div className="p-3 bg-gray-50 text-sm font-medium">{t("员工", "Employee", "Empleado")}: {name}</div>}
          {rows.map(([k, v]) => (
            <div key={k} className={`flex justify-between p-3 border-b last:border-0 text-sm ${k === "税后到手" ? "bg-green-50 font-bold text-green-700" : ""}`}>
              <span className={k === "税后到手" ? "" : "text-gray-500"}>{k}</span>
              <span className="font-mono">{v}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">{INSURANCE_BASE_NOTE}（各地比例略有差异，以当地社保局为准）。</p>
    </div>
  )
}
