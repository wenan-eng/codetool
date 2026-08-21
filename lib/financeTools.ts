export interface EqualPaymentResult {
  monthly: number
  totalInterest: number
  totalPayment: number
  firstMonth?: number
  lastMonth?: number
  decreasingBy?: number
}

export function equalPayment(principal: number, annualRatePct: number, months: number): EqualPaymentResult {
  if (principal <= 0 || months <= 0) throw new Error("本金与期限必须大于 0")
  const r = annualRatePct / 100 / 12
  const monthly = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const totalPayment = monthly * months
  return { monthly, totalInterest: totalPayment - principal, totalPayment }
}

export function equalPrincipal(principal: number, annualRatePct: number, months: number): EqualPaymentResult {
  if (principal <= 0 || months <= 0) throw new Error("本金与期限必须大于 0")
  const r = annualRatePct / 100 / 12
  const monthlyBase = principal / months
  const firstMonth = monthlyBase + principal * r
  const lastMonth = monthlyBase + (principal / months) * r
  const totalInterest = ((months + 1) / 2) * principal * r
  return { monthly: firstMonth, firstMonth, lastMonth, decreasingBy: monthlyBase * r, totalInterest, totalPayment: principal + totalInterest }
}

const BONUS_BRACKETS: [number, number, number][] = [
  [3000, 0.03, 0],
  [12000, 0.10, 210],
  [25000, 0.20, 1410],
  [35000, 0.25, 2660],
  [55000, 0.30, 4410],
  [80000, 0.35, 7160],
]

export function bonusTax(bonus: number): { tax: number; rate: number; quickDeduct: number; afterTax: number } {
  if (bonus <= 0) throw new Error("年终奖金额必须大于 0")
  const perMonth = bonus / 12
  for (const [limit, rate, deduct] of BONUS_BRACKETS) {
    if (perMonth <= limit) {
      const tax = bonus * rate - deduct
      return { tax, rate, quickDeduct: deduct, afterTax: bonus - tax }
    }
  }
  throw new Error("金额超出计算范围")
}

export function roiMetrics(revenue: number, cost: number): { profit: number; marginPct: number; roiPct: number } {
  if (cost <= 0) throw new Error("成本必须大于 0")
  const profit = revenue - cost
  return {
    profit,
    marginPct: Math.round((profit / revenue) * 10000) / 100,
    roiPct: Math.round((profit / cost) * 10000) / 100,
  }
}
