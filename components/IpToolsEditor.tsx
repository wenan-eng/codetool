"use client"
import { useState } from "react"
import { ipToInt, intToIp, parseCidr, subnetOf, randomPublicIps } from "@/lib/webmasterTools"

type ToolId = "ip2int" | "cidr-converter" | "ip-subnet" | "ip-generator"

export default function IpToolsEditor({ toolId, locale = "zh" }: { toolId: ToolId; locale?: string }) {
  const [input, setInput] = useState("")
  const [prefix, setPrefix] = useState(24)
  const [count, setCount] = useState(10)
  const [output, setOutput] = useState("")
  const [rows, setRows] = useState<[string, string][]>([])
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError(""); setOutput(""); setRows([])
    try {
      if (toolId === "ip2int") {
        if (/^\d+$/.test(input.trim())) setOutput(intToIp(Number(input)))
        else setOutput(String(ipToInt(input)))
      } else if (toolId === "cidr-converter") {
        const r = parseCidr(input)
        setRows([
          [t("网络地址", "Network", "Red"), r.network],
          [t("子网掩码", "Mask", "Máscara"), r.mask],
          [t("广播地址", "Broadcast", "Broadcast"), r.broadcast],
          [t("可用范围", "Usable range", "Rango útil"), `${r.firstUsable} ~ ${r.lastUsable}`],
          [t("可用主机数", "Usable hosts", "Hosts útiles"), String(r.usableHosts)],
        ])
      } else if (toolId === "ip-subnet") {
        const r = subnetOf(input, prefix)
        setRows([
          [t("输入 IP", "Input IP", "IP"), r.inputIp],
          [t("网络地址", "Network", "Red"), r.network],
          [t("子网掩码", "Mask", "Máscara"), r.mask],
          [t("广播地址", "Broadcast", "Broadcast"), r.broadcast],
          [t("可用范围", "Usable range", "Rango útil"), `${r.firstUsable} ~ ${r.lastUsable}`],
          [t("可用主机数", "Usable hosts", "Hosts útiles"), String(r.usableHosts)],
        ])
      } else {
        setOutput(randomPublicIps(count).join("\n"))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        {toolId !== "ip-generator" && (
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={toolId === "ip2int" ? t("输入 IPv4 或整数，自动识别方向", "IPv4 or integer, auto-detected", "IPv4 o entero") : toolId === "cidr-converter" ? "192.168.1.0/24" : t("输入 IP 地址，如 192.168.1.100", "e.g. 192.168.1.100", "p. ej. 192.168.1.100")}
            className="flex-1 p-3 border rounded-xl font-mono text-sm"
            onKeyDown={e => { if (e.key === "Enter") run() }}
          />
        )}
        {toolId === "ip-subnet" && (
          <select value={prefix} onChange={e => setPrefix(Number(e.target.value))} className="p-3 border rounded-xl text-sm bg-white">
            {[8, 16, 24, 25, 26, 27, 28, 29, 30].map(b => <option key={b} value={b}>/{b}</option>)}
          </select>
        )}
        {toolId === "ip-generator" && (
          <label className="flex items-center gap-2 text-sm text-gray-600 flex-1">
            {t("生成数量(≤500)", "Count (≤500)", "Cantidad (≤500)")}
            <input type="number" min={1} max={500} value={count} onChange={e => setCount(Number(e.target.value) || 10)} className="w-28 p-3 border rounded-xl" />
          </label>
        )}
        <button onClick={run} disabled={toolId !== "ip-generator" && !input.trim()} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">{t("开始转换", "Convert", "Convertir")}</button>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {output && (
        <textarea readOnly value={output} className="w-full h-40 p-3 border rounded-xl font-mono text-xs bg-gray-50" onFocus={e => e.currentTarget.select()} />
      )}
      {rows.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between p-3 border-b last:border-0 text-sm">
              <span className="text-gray-500">{k}</span>
              <button onClick={() => navigator.clipboard.writeText(v)} className="font-mono hover:text-blue-600">{v} ⧉</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally.", "Todo local.")}</p>
    </div>
  )
}
