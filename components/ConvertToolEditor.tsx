"use client"
import { useState } from "react"
import { toTraditional, toSimplified, toMars, fromMars, circleLetters, generateRandomStrings, generateSequence, formatText } from "@/lib/textTools3"
import { pinyin } from "pinyin-pro"

type ToolId = "chinese-converter" | "mars-converter" | "letter-circle" | "string-random" | "sequence-generator" | "text-formatter" | "pinyin-converter"

export default function ConvertToolEditor({ toolId, locale = "zh" }: { toolId: ToolId; locale?: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [minLen, setMinLen] = useState(6)
  const [maxLen, setMaxLen] = useState(12)
  const [count, setCount] = useState(10)
  const [charset, setCharset] = useState("")
  const [start, setStart] = useState(1)
  const [step, setStep] = useState(1)
  const [seqCount, setSeqCount] = useState(10)
  const [padWidth, setPadWidth] = useState(0)
  const [prefix, setPrefix] = useState("")
  const [suffix, setSuffix] = useState("")
  const [fmtIndent, setFmtIndent] = useState(true)
  const [fmtTrim, setFmtTrim] = useState(true)
  const [fmtEmoji, setFmtEmoji] = useState(false)
  const [fmtHtml, setFmtHtml] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = (fn: () => string) => {
    setError("")
    try {
      setOutput(fn())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const inputPlaceholder: Record<ToolId, string> = {
    "chinese-converter": t("请输入要转换简体/繁体的文本内容", "Enter text to convert Simplified/Traditional", "Introduzca texto para convertir"),
    "mars-converter": t("请输入要转换的文本内容，例如：我爱懒人工具火星文！", "Enter text, e.g. I love this tool!", "Introduzca el texto:"),
    "letter-circle": t("请输入要转换的文本：", "Enter text:", "Introduzca el texto:"),
    "string-random": "",
    "sequence-generator": "",
    "text-formatter": t("在此粘贴您的文本内容...", "Paste your text here...", "Pegue su texto aquí..."),
    "pinyin-converter": t("请输入汉字，例如：我爱懒人工具汉字拼音转换器！", "Enter Chinese, e.g. 你好世界", "Introduzca caracteres chinos:"),
  }

  return (
    <div className="flex flex-col gap-4">
      {toolId === "string-random" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("最小长度", "Min length", "Long. mínima")}</span><input type="number" value={minLen} onChange={e => setMinLen(Number(e.target.value) || 1)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("最大长度", "Max length", "Long. máxima")}</span><input type="number" value={maxLen} onChange={e => setMaxLen(Number(e.target.value) || 1)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("生成数量", "Count", "Cantidad")}</span><input type="number" value={count} onChange={e => setCount(Number(e.target.value) || 1)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("自定义字符集(可选)", "Charset (optional)", "Conjunto (opcional)")}</span><input value={charset} onChange={e => setCharset(e.target.value)} placeholder={t("留空使用默认", "Empty for default", "Vacío por defecto")} className="p-2 border rounded-lg" /></label>
        </div>
      )}
      {toolId === "sequence-generator" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("开始数字", "Start", "Inicio")}</span><input type="number" value={start} onChange={e => setStart(Number(e.target.value) || 0)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("每步差值", "Step", "Paso")}</span><input type="number" value={step} onChange={e => setStep(Number(e.target.value) || 1)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("生成数量", "Count", "Cantidad")}</span><input type="number" value={seqCount} onChange={e => setSeqCount(Number(e.target.value) || 1)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("前置补零位数(0不补)", "Pad width (0=off)", "Ceros (0=no)")}</span><input type="number" value={padWidth} onChange={e => setPadWidth(Number(e.target.value) || 0)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("数字前缀", "Prefix", "Prefijo")}</span><input value={prefix} onChange={e => setPrefix(e.target.value)} className="p-2 border rounded-lg" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("数字后缀", "Suffix", "Sufijo")}</span><input value={suffix} onChange={e => setSuffix(e.target.value)} className="p-2 border rounded-lg" /></label>
        </div>
      )}
      {inputPlaceholder[toolId] && (
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={inputPlaceholder[toolId]}
          className="w-full h-40 p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-400"
        />
      )}
      {toolId === "text-formatter" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {([
            [fmtIndent, setFmtIndent, t("段落首行缩进", "First-line indent", "Sangría")],
            [fmtTrim, setFmtTrim, t("去除多余空格", "Trim spaces", "Quitar espacios")],
            [fmtEmoji, setFmtEmoji, t("去掉Emoji表情", "Remove emoji", "Quitar emojis")],
            [fmtHtml, setFmtHtml, t("去除HTML标签", "Strip HTML tags", "Quitar HTML")],
          ] as [boolean, (v: boolean) => void, string][]).map(([v, set, label]) => (
            <label key={label} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={v} onChange={e => set(e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex flex-wrap gap-3">
        {toolId === "chinese-converter" && (
          <>
            <button onClick={() => run(() => toTraditional(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成繁体", "To Traditional", "A Tradicional")}</button>
            <button onClick={() => run(() => toSimplified(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成简体", "To Simplified", "A Simplificado")}</button>
          </>
        )}
        {toolId === "mars-converter" && (
          <>
            <button onClick={() => run(() => toMars(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成火星文", "To Mars text", "A texto Marte")}</button>
            <button onClick={() => run(() => fromMars(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成简体汉字", "To Chinese", "A chino")}</button>
          </>
        )}
        {toolId === "letter-circle" && (
          <button onClick={() => run(() => circleLetters(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("字母加圆圈", "Circle letters", "Circlear letras")}</button>
        )}
        {toolId === "string-random" && (
          <button onClick={() => run(() => generateRandomStrings({ minLength: minLen, maxLength: maxLen, count, charset }).join("\n"))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("开始生成", "Generate", "Generar")}</button>
        )}
        {toolId === "sequence-generator" && (
          <button onClick={() => run(() => generateSequence({ start, step, count: seqCount, padWidth, prefix, suffix }).join("\n"))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("开始生成", "Generate", "Generar")}</button>
        )}
        {toolId === "text-formatter" && (
          <button onClick={() => run(() => formatText(input, { indent: fmtIndent, trimSpaces: fmtTrim, removeEmoji: fmtEmoji, removeHtml: fmtHtml }))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("开始排版", "Format", "Formatear")}</button>
        )}
        {toolId === "pinyin-converter" && (
          <>
            <button onClick={() => run(() => pinyin(input, { toneType: "none" }))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成拼音", "To Pinyin", "A Pinyin")}</button>
            <button onClick={() => run(() => pinyin(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成拼音-带声调", "With tones", "Con tonos")}</button>
          </>
        )}
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {(output || !["string-random", "sequence-generator"].includes(toolId)) && (
        <textarea readOnly value={output} placeholder={t("输出的结果...", "Result...", "Resultado...")} className="w-full h-36 p-3 border rounded-xl font-mono text-xs bg-gray-50" />
      )}
      <div className="flex gap-3">
        <button onClick={copy} disabled={!output} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{copied ? t("已复制", "Copied", "Copiado") : t("复制结果", "Copy Result", "Copiar resultado")}</button>
        <button onClick={() => { const blob = new Blob([output], { type: "text/plain;charset=utf-8" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "result.txt"; a.click() }} disabled={!output} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{t("下载TXT", "Download TXT", "Descargar TXT")}</button>
      </div>
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
