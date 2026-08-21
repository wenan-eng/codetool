"use client"
import { useState, useEffect } from "react"

const FESTIVALS: { name: string; date: [number, number, number] }[] = [
  { name: "元旦", date: [2027, 1, 1] },
  { name: "春节", date: [2027, 2, 6] },
  { name: "清明节", date: [2027, 4, 5] },
  { name: "劳动节", date: [2027, 5, 1] },
  { name: "端午节", date: [2027, 6, 9] },
  { name: "中秋节", date: [2027, 9, 15] },
  { name: "国庆节", date: [2026, 10, 1] },
]

export default function CountdownEditor({ locale = "zh" }: { locale?: string }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const rows = FESTIVALS
    .map(f => {
      const target = new Date(f.date[0], f.date[1] - 1, f.date[2]).getTime()
      const diff = Math.max(0, target - now)
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      return { ...f, days, hours, minutes, seconds, passed: diff === 0 }
    })
    .sort((a, b) => (a.days * 86400 + a.hours * 3600) - (b.days * 86400 + b.hours * 3600))

  return (
    <div className="flex flex-col gap-3">
      {rows.map(r => (
        <div key={r.name} className="bg-white border rounded-xl p-4 flex items-center justify-between">
          <span className="font-medium">{r.name} <span className="text-xs text-gray-400 ml-1">{r.date.join("-")}</span></span>
          {r.passed ? (
            <span className="text-sm text-gray-400">🎉 进行中/已过</span>
          ) : (
            <span className="font-mono text-sm text-blue-600">
              {r.days > 0 && <>{r.days} 天 </>}
              {String(r.hours).padStart(2, "0")}:{String(r.minutes).padStart(2, "0")}:{String(r.seconds).padStart(2, "0")}
            </span>
          )}
        </div>
      ))}
      <p className="text-xs text-gray-400">节日日期为公历推算（农历节日以当年官方安排为准）；倒计时实时本地计算。</p>
    </div>
  )
}
