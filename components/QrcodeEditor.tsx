"use client"
import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

const PRESETS: { key: string; label: string; placeholder: string }[] = [
  { key: "text", label: "文本", placeholder: "请输入任意文本内容..." },
  { key: "url", label: "网址", placeholder: "https://www.codetool.site" },
  { key: "wifi", label: "WiFi", placeholder: "WiFi名称" },
]

export default function QrcodeEditor({ locale = "zh" }: { locale?: string }) {
  const [mode, setMode] = useState("text")
  const [content, setContent] = useState("")
  const [ssid, setSsid] = useState("")
  const [wifiPwd, setWifiPwd] = useState("")
  const [enc, setEnc] = useState("WPA")
  const [size, setSize] = useState(300)
  const [error, setError] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  useEffect(() => {
    let payload = content.trim()
    if (mode === "url" && payload && !/^https?:\/\//i.test(payload)) payload = `https://${payload}`
    if (mode === "wifi") {
      if (!ssid) { setError(t("请输入 WiFi 名称", "Enter the WiFi name", "Introduzca el nombre WiFi")); return }
      payload = `WIFI:T:${enc};S:${ssid};${wifiPwd ? `P:${wifiPwd};` : ""};;`
    }
    if (!payload) {
      const c = canvasRef.current
      if (c) { const ctx = c.getContext("2d"); ctx?.clearRect(0, 0, c.width, c.height) }
      setError("")
      return
    }
    QRCode.toCanvas(canvasRef.current, payload, { width: size, margin: 2 }, err => {
      setError(err ? String(err) : "")
    })
  }, [content, mode, size, ssid, wifiPwd, enc])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {PRESETS.map(p => (
          <button key={p.key} onClick={() => { setMode(p.key); setError("") }} className={`px-3 py-1.5 rounded-lg text-sm ${mode === p.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {t(p.label, p.key === "text" ? "Text" : p.key === "url" ? "URL" : "WiFi", p.key === "text" ? "Texto" : p.key === "url" ? "URL" : "WiFi")}
          </button>
        ))}
      </div>
      {mode === "wifi" ? (
        <div className="grid md:grid-cols-3 gap-3">
          <input value={ssid} onChange={e => setSsid(e.target.value)} placeholder={t("WiFi 名称", "SSID", "Nombre")} className="p-3 border rounded-xl text-sm" />
          <input value={wifiPwd} onChange={e => setWifiPwd(e.target.value)} placeholder={t("密码（可空）", "Password (optional)", "Contraseña")} className="p-3 border rounded-xl text-sm" />
          <select value={enc} onChange={e => setEnc(e.target.value)} className="p-3 border rounded-xl text-sm bg-white">
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">{t("无密码", "Open", "Abierta")}</option>
          </select>
        </div>
      ) : (
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={PRESETS.find(p => p.key === mode)?.placeholder} className="w-full h-24 p-3 border rounded-xl text-sm" />
      )}
      <label className="flex items-center gap-3 text-sm">
        <span className="text-gray-600 w-20">{t("尺寸", "Size", "Tamaño")}</span>
        <input type="range" min={128} max={800} step={16} value={size} onChange={e => setSize(Number(e.target.value))} className="flex-1" />
        <span className="w-12 font-mono text-xs">{size}px</span>
      </label>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="self-center bg-white border rounded-xl p-3">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <button
        onClick={() => canvasRef.current?.toBlob(blob => { if (!blob) return; const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrcode.png"; a.click() }, "image/png")}
        className="self-start px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
      >⬇️ {t("下载二维码 PNG", "Download PNG", "Descargar PNG")}</button>
      <p className="text-xs text-gray-400">{t("所有生成均在浏览器本地完成，不上传数据", "Generated locally. No data is uploaded.", "Generado localmente.")}</p>
    </div>
  )
}
