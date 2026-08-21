"use client"
import { useState } from "react"
import { parseUrl, type ParsedUrl } from "@/lib/textTools2"

export default function NetParserEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [parsed, setParsed] = useState<ParsedUrl | null>(null)
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError("")
    setParsed(null)
    try {
      setParsed(parseUrl(input))
    } catch {
      setError(t("无法解析该 URL，请检查格式", "Cannot parse this URL, check the format", "No se puede analizar esta URL"))
    }
  }

  const rows: [string, string][] | null = parsed
    ? [
        [t("协议", "Protocol", "Protocolo"), parsed.protocol],
        [t("域名", "Hostname", "Host"), parsed.hostname],
        [t("端口", "Port", "Puerto"), parsed.port],
        [t("路径", "Path", "Ruta"), parsed.pathname],
        [t("查询串", "Query string", "Cadena de consulta"), parsed.search || "-"],
        [t("锚点", "Hash", "Ancla"), parsed.hash || "-"],
        [t("来源 Origin", "Origin", "Origen"), parsed.origin],
      ]
    : null
  const params = parsed?.params ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="https://www.example.com/path?key=value"
          className="flex-1 p-3 border rounded-xl font-mono text-sm focus:outline-none focus:border-blue-400"
          onKeyDown={e => { if (e.key === "Enter") run() }}
        />
        <button onClick={run} disabled={!input.trim()} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">{t("URL解析", "Parse URL", "Analizar URL")}</button>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {rows && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b last:border-0">
                  <td className="p-3 text-gray-500 w-40">{k}</td>
                  <td className="p-3 font-mono text-xs break-all">{v}</td>
                </tr>
              ))}
              {params.length > 0 && (
                <tr className="border-b last:border-0 bg-gray-50">
                  <td className="p-3 text-gray-500 align-top">{t("查询参数", "Query params", "Parámetros")}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      {params.map(([k2, v2], i) => (
                        <div key={`${k2}-${i}`} className="font-mono text-xs"><span className="text-blue-600">{k2}</span> = {v2}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
