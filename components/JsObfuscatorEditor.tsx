"use client"
import { useState } from "react"

const SAMPLE = `// 示例代码
function calculatePrice(quantity, unitPrice) {
  const discount = quantity > 100 ? 0.8 : 0.95;
  return Math.round(quantity * unitPrice * discount * 100) / 100;
}
console.log(calculatePrice(150, 9.99));`

export default function JsObfuscatorEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = async () => {
    setError("")
    setBusy(true)
    try {
      const { obfuscateJs } = await import("@/lib/jsObfuscator")
      setOutput(obfuscateJs({ code: input }))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
    setBusy(false)
  }

  const download = () => {
    const blob = new Blob([output], { type: "text/javascript;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "obfuscated.js"
    a.click()
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
        placeholder={t("请输入需要混淆的 JavaScript 代码，或点击下方按钮加载示例代码", "Paste JavaScript code to obfuscate, or load the sample below", "Pegue el código JavaScript a ofuscar, o cargue el ejemplo")}
        className="w-full h-44 p-3 border rounded-xl font-mono text-xs focus:outline-none focus:border-blue-400"
      />
      <button onClick={() => setInput(SAMPLE)} className="self-start text-xs text-blue-600 hover:underline">{t("加载示例代码", "Load sample", "Cargar ejemplo")}</button>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button onClick={run} disabled={!input.trim() || busy} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{busy ? t("混淆中...", "Processing...", "Procesando...") : t("混淆加密", "Obfuscate", "Ofuscar")}</button>
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {(output || !error) && (
        <textarea readOnly value={output} placeholder={t("点击【开始混淆】后，混淆加密结果将显示在这里。", "The obfuscated result will appear here.", "El resultado ofuscado aparecerá aquí.")} className="w-full h-44 p-3 border rounded-xl font-mono text-xs bg-gray-50" />
      )}
      {output && (
        <div className="flex gap-3">
          <button onClick={copy} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{copied ? t("已复制", "Copied", "Copiado") : t("复制结果", "Copy Result", "Copiar resultado")}</button>
          <button onClick={download} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("下载文件", "Download File", "Descargar archivo")}</button>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
