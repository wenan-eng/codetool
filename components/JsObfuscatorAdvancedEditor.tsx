"use client"
import { useState } from "react"

export default function JsObfuscatorAdvancedEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"standard" | "high">("standard")
  const [domains, setDomains] = useState("")
  const [theftAlert, setTheftAlert] = useState(true)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertFrequency, setAlertFrequency] = useState<"once" | "daily" | "always">("daily")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = async () => {
    setError("")
    setBusy(true)
    try {
      const { obfuscateJs } = await import("@/lib/jsObfuscator")
      setOutput(obfuscateJs({
        code: input,
        mode,
        comment,
        domainLock: domains.split(/[\s,，]+/).map(s => s.trim()).filter(Boolean),
        theftAlert,
        alertMessage,
        alertFrequency,
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
    setBusy(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("请输入或粘贴要混淆加密的 JS 代码", "Paste the JS code to obfuscate", "Pegue el código JS a ofuscar")}
        className="w-full h-40 p-3 border rounded-xl font-mono text-xs focus:outline-none focus:border-blue-400"
      />
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">{t("混淆模式", "Obfuscation mode", "Modo de ofuscación")}</span>
          <select value={mode} onChange={e => setMode(e.target.value as "standard" | "high")} className="p-2 border rounded-lg text-sm">
            <option value="standard">{t("标准混淆模式（推荐）", "Standard (recommended)", "Estándar (recomendado)")}</option>
            <option value="high">{t("高强度混淆（更慢更难还原）", "High strength (slower, harder to reverse)", "Alta intensidad (más lento)")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">{t("授权域名（逗号分隔，留空不限制）", "Authorized domains (comma separated)", "Dominios autorizados (separados por comas)")}</span>
          <input value={domains} onChange={e => setDomains(e.target.value)} placeholder={t("请输入授权域名，例如：example.com", "e.g. example.com", "p.ej. example.com")} className="p-2 border rounded-lg text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">{t("盗用限制", "Theft protection", "Protección contra robo")}</span>
          <select value={theftAlert ? "alert" : "redirect"} onChange={e => setTheftAlert(e.target.value === "alert")} className="p-2 border rounded-lg text-sm">
            <option value="alert">{t("使用 Alert() 弹窗提醒", "Alert() popup reminder", "Ventana emergente Alert()")}</option>
            <option value="redirect">{t("静默跳转到授权域名", "Silent redirect to authorized domain", "Redirección silenciosa")}</option>
          </select>
        </label>
        {theftAlert && (
          <>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">{t("提醒内容", "Alert message", "Mensaje de aviso")}</span>
              <input value={alertMessage} onChange={e => setAlertMessage(e.target.value)} placeholder={t("请输入盗用时的警告或提示信息", "Warning message shown when stolen", "Mensaje de advertencia")} className="p-2 border rounded-lg text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">{t("提醒频率", "Alert frequency", "Frecuencia de aviso")}</span>
              <select value={alertFrequency} onChange={e => setAlertFrequency(e.target.value as "once" | "daily" | "always")} className="p-2 border rounded-lg text-sm">
                <option value="once">{t("仅首次访问提醒", "First visit only", "Solo primera visita")}</option>
                <option value="daily">{t("适中提醒（每天首次访问提醒）", "Daily first visit", "Primera visita diaria")}</option>
                <option value="always">{t("每次访问都提醒", "Every visit", "Cada visita")}</option>
              </select>
            </label>
          </>
        )}
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="text-gray-600">{t("代码注释（输出文件头部说明）", "Code comment (file header note)", "Comentario de código (cabecera)")}</span>
          <input value={comment} onChange={e => setComment(e.target.value)} placeholder={t("请输入JS代码前的注释文本，用于温馨提示。", "Comment text prepended to output", "Texto de comentario antepuesto a la salida")} className="p-2 border rounded-lg text-sm" />
        </label>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button onClick={run} disabled={!input.trim() || busy} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{busy ? t("混淆中...", "Processing...", "Procesando...") : t("开始混淆", "Start Obfuscation", "Iniciar ofuscación")}</button>
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {(output || !error) && (
        <textarea readOnly value={output} placeholder={t("混淆结果将显示在这里", "Result will appear here", "El resultado aparecerá aquí")} className="w-full h-44 p-3 border rounded-xl font-mono text-xs bg-gray-50" />
      )}
      {output && (
        <button onClick={copy} className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{copied ? t("已复制", "Copied", "Copiado") : t("复制结果", "Copy Result", "Copiar resultado")}</button>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
