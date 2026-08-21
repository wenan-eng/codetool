"use client"
import { useRef, useState } from "react"
import { analyzeLog, type LogStats } from "@/lib/webmasterTools"

export default function LogAnalysisEditor({ locale = "zh" }: { locale?: string }) {
  const [stats, setStats] = useState<LogStats | null>(null)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : es)
  const fmt = (n: number) => n.toLocaleString()

  const loadFile = async (file: File) => {
    setError(""); setStats(null)
    try {
      const text = await file.text()
      const s = analyzeLog(text)
      if (s.pv === 0) { setError(t("未解析到有效日志行，请确认是 Nginx/Apache combined 格式", "No valid log lines parsed; expected Nginx/Apache combined format", "Sin líneas válidas; formato Nginx/Apache esperado")); return }
      setStats(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        📊 {t("上传 Nginx/Apache 访问日志（combined 格式），本地解析不上传", "Upload an Nginx/Apache access log (combined), parsed locally", "Suba un log de acceso Nginx/Apache, análisis local")}
        <input ref={inputRef} type="file" accept=".log,.txt,text/plain" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      <textarea
        onChange={e => { if (e.target.value.trim()) loadFile(new File([e.target.value], "inline.log")) }}
        placeholder={t("或直接粘贴日志内容...", "...or paste log content directly", "...o pegue el contenido del registro")}
        className="w-full h-24 p-3 border rounded-xl font-mono text-xs"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border rounded-xl p-4 text-center"><div className="text-2xl font-bold text-blue-600">{fmt(stats.pv)}</div><div className="text-xs text-gray-500 mt-1">{t("总请求数 PV", "Total requests (PV)", "Peticiones (PV)")}</div></div>
            <div className="bg-white border rounded-xl p-4 text-center"><div className="text-2xl font-bold text-blue-600">{fmt(stats.uv)}</div><div className="text-xs text-gray-500 mt-1">{t("独立 IP 数 UV", "Unique IPs (UV)", "IPs únicas (UV)")}</div></div>
          </div>
          <div className="bg-white border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b"><th className="p-3">Status</th><th className="p-3">{t("次数", "Count", "Veces")}</th><th className="p-3">{t("TOP IP", "Top IP", "TOP IP")}</th><th className="p-3">{t("次数", "Count", "Veces")}</th></tr></thead>
              <tbody>
                {Array.from({ length: Math.max(stats.statusCounts.length, stats.topIps.length) }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-3 font-mono">{stats.statusCounts[i]?.code ?? ""}</td>
                    <td className="p-3">{stats.statusCounts[i] ? fmt(stats.statusCounts[i].count) : ""}</td>
                    <td className="p-3 font-mono text-xs">{stats.topIps[i]?.ip ?? ""}</td>
                    <td className="p-3">{stats.topIps[i] ? fmt(stats.topIps[i].count) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
