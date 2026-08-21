"use client"
import { useState } from "react"
import { extractMobiles, extractEmails, extractUrls, extractBirthdays, parseIdcard, parseUrl, extractByKind, type ExtractKind } from "@/lib/textTools2"

type ToolId = "mobile-extractor" | "email-extractor" | "url-extractor" | "idcard-date" | "text-extract"

const EXTRACT_KINDS: { id: ExtractKind; zh: string; en: string; es: string }[] = [
  { id: "mobile", zh: "电话号码", en: "Phone numbers", es: "Teléfonos" },
  { id: "email", zh: "邮箱地址", en: "Emails", es: "Correos" },
  { id: "url", zh: "URL链接", en: "URLs", es: "URLs" },
  { id: "number", zh: "数字", en: "Numbers", es: "Números" },
  { id: "chinese", zh: "中文词语", en: "Chinese phrases", es: "Frases chinas" },
  { id: "english", zh: "英文单词", en: "English words", es: "Palabras inglesas" },
]

export default function ExtractToolEditor({ toolId, locale = "zh" }: { toolId: ToolId; locale?: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [kind, setKind] = useState<ExtractKind>("mobile")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError("")
    try {
      let rows: string[] = []
      if (toolId === "mobile-extractor") rows = extractMobiles(input)
      else if (toolId === "email-extractor") rows = extractEmails(input)
      else if (toolId === "url-extractor") rows = extractUrls(input)
      else if (toolId === "idcard-date") rows = extractBirthdays(input).map(r => `${r.id} → ${r.birthday}`)
      else rows = extractByKind(input, kind)
      setOutput(rows.join("\n"))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadTxt = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "result.txt"
    a.click()
  }

  const placeholders: Record<ToolId, string> = {
    "mobile-extractor": t("请输入文本内容，智能自动提取所有手机号码（不包含座机号码、国际号码），并智能去重。", "Paste text to extract and dedupe all mobile numbers.", "Pegue texto para extraer y deduplicar móviles."),
    "email-extractor": t("请输入或粘贴文本内容，本工具自动提取其中的所有邮箱地址，并智能去重。", "Paste text to extract and dedupe all email addresses.", "Pegue texto para extraer y deduplicar correos."),
    "url-extractor": t("请输入/粘贴要提取URL的文本...", "Paste text to extract URLs...", "Pegue texto para extraer URLs..."),
    "idcard-date": t("请输入或粘贴身份证号码，每行一个或混在文本中均可，自动提取生日。", "Paste ID numbers to extract birthdays.", "Pegue números de DNI para extraer cumpleaños."),
    "text-extract": t("请输入要处理的文本内容...", "Enter text to extract from...", "Introduzca el texto..."),
  }

  return (
    <div className="flex flex-col gap-4">
      {toolId === "text-extract" && (
        <div className="flex flex-wrap gap-2">
          {EXTRACT_KINDS.map(k => (
            <button key={k.id} onClick={() => setKind(k.id)} className={`px-3 py-1.5 rounded-lg text-sm ${kind === k.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              {t(k.zh, k.en, k.es)}
            </button>
          ))}
        </div>
      )}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholders[toolId]}
        className="w-full h-40 p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-400"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex flex-wrap gap-3">
        <button onClick={run} disabled={!input.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          {toolId === "url-extractor" ? t("提取URL", "Extract URLs", "Extraer URLs") : toolId === "idcard-date" ? t("开始生成", "Generate", "Generar") : t("智能提取", "Smart Extract", "Extracción inteligente")}
        </button>
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      <textarea readOnly value={output} placeholder={t("提取结果...", "Results...", "Resultados...")} className="w-full h-36 p-3 border rounded-xl font-mono text-xs bg-gray-50" />
      <div className="flex gap-3">
        <button onClick={copy} disabled={!output} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{copied ? t("已复制", "Copied", "Copiado") : t("复制结果", "Copy Result", "Copiar resultado")}</button>
        <button onClick={downloadTxt} disabled={!output} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{t("下载TXT", "Download TXT", "Descargar TXT")}</button>
      </div>
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
