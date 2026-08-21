"use client"
import { useMemo, useState } from "react"

const PATTERNS: { label: string; regex: string; flags: string }[] = [
  { label: "手机号", regex: "1[3-9]\\\\d{9}", flags: "g" },
  { label: "邮箱", regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}", flags: "gi" },
  { label: "URL", regex: "https?:\\\\/\\\\/[^\\\\s]+", flags: "gi" },
  { label: "IPv4", regex: "\\\\d{1,3}(?:\\\\.\\\\d{1,3}){3}", flags: "g" },
  { label: "日期(YYYY-MM-DD)", regex: "\\\\d{4}-\\\\d{2}-\\\\d{2}", flags: "g" },
  { label: "整数", regex: "-?\\\\d+", flags: "g" },
  { label: "中文字符", regex: "[\\\\u4e00-\\\\u9fff]+", flags: "g" },
]

export default function RegexGeneratorEditor({ locale = "zh" }: { locale?: string }) {
  const [regex, setRegex] = useState(PATTERNS[0].regex.replace(/\\\\\\\\/g, "\\"))
  const [flags, setFlags] = useState("g")
  const [testText, setTestText] = useState("")
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const matches = useMemo(() => {
    if (!testText || !regex) return []
    try {
      setError("")
      return testText.match(new RegExp(regex, flags)) || []
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return []
    }
  }, [regex, flags, testText])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {PATTERNS.map(p => (
          <button key={p.label} onClick={() => { setRegex(p.regex.replace(/\\\\\\\\/g, "\\")); setFlags(p.flags) }} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
            {p.label}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">{t("正则表达式", "Pattern", "Patrón")}</span>
        <input value={regex} onChange={e => setRegex(e.target.value)} className="w-full p-3 border rounded-xl font-mono text-sm" />
        <input value={flags} onChange={e => setFlags(e.target.value)} placeholder="g" className="w-24 p-2 border rounded-lg font-mono text-xs mt-1" />
      </label>
      <textarea value={testText} onChange={e => setTestText(e.target.value)} placeholder={t("输入测试文本，实时高亮匹配结果...", "Test text with live match preview...", "Texto de prueba...")} className="w-full h-28 p-3 border rounded-xl text-sm" />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {testText && !error && (
        <div className="bg-white border rounded-xl p-4 text-sm">
          <span className="text-gray-500">{t("匹配到", "Matches:", "Coincidencias:")}</span> <span className="font-bold text-blue-600">{matches.length}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {matches.slice(0, 50).map((m, i) => <code key={`${m}-${i}`} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-xs">{m}</code>)}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成", "All processing is local.", "Todo local.")}</p>
    </div>
  )
}
