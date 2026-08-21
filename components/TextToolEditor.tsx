"use client"
import { useMemo, useState } from "react"
import { toUpperCase, toLowerCase, convertSymbols, removeEmoji, countWords, literalNewlinesToReal, realNewlinesToLiteral, replaceAll, splitText, type WordCountResult } from "@/lib/textTools"

type ToolId = "letter-converter" | "symbol-converter" | "remove-emoji" | "word-count" | "line-text" | "text-line" | "text-replace" | "text-split"

export default function TextToolEditor({ toolId, locale = "zh" }: { toolId: ToolId; locale?: string }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [direction, setDirection] = useState<"zh2en" | "en2zh">("zh2en")
  const [search, setSearch] = useState("")
  const [replacement, setReplacement] = useState("")
  const [useRegex, setUseRegex] = useState(false)
  const [replaceCount, setReplaceCount] = useState<number | null>(null)
  const [delimiter, setDelimiter] = useState("")
  const [joiner, setJoiner] = useState(", ")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const stats: WordCountResult | null = useMemo(() => (toolId === "word-count" && input ? countWords(input) : null), [toolId, input])

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

  const downloadTxt = () => {
    const blob = new Blob([output || input], { type: "text/plain;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "result.txt"
    a.click()
  }

  const inputPlaceholder: Record<ToolId, string> = {
    "letter-converter": t("请输入要转换带有英文字母的文本：", "Enter text with English letters:", "Introduzca texto con letras inglesas:"),
    "symbol-converter": t("请输入要转换英文符号/中文符号的文本内容", "Enter text to convert symbols", "Introduzca texto para convertir símbolos"),
    "remove-emoji": t("请粘贴要去除Emoji表情的文本：", "Paste text to strip emoji:", "Pegue el texto para quitar emojis:"),
    "word-count": t("请输入要统计的文本内容...", "Enter text to analyze...", "Introduzca el texto a analizar..."),
    "line-text": t("请输入需要处理的数据...", "Enter data with literal \\n...", "Introduzca datos con \\n literales..."),
    "text-line": t("请输入需要处理的数据...", "Enter multi-line data...", "Introduzca datos multilínea..."),
    "text-replace": t("请输入要替换的文本内容...", "Enter text to replace in...", "Introduzca el texto..."),
    "text-split": t("请输入或粘贴要拆分的文本内容...", "Enter text to split...", "Introduzca el texto a dividir..."),
  }

  return (
    <div className="flex flex-col gap-4">
      {toolId === "symbol-converter" && (
        <div className="flex gap-2">
          <button onClick={() => setDirection("zh2en")} className={`px-3 py-1.5 rounded-lg text-sm ${direction === "zh2en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t("中文符号 → 英文符号", "Chinese → English", "Chino → Inglés")}</button>
          <button onClick={() => setDirection("en2zh")} className={`px-3 py-1.5 rounded-lg text-sm ${direction === "en2zh" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t("英文符号 → 中文符号", "English → Chinese", "Inglés → Chino")}</button>
        </div>
      )}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={inputPlaceholder[toolId]}
        className="w-full h-40 p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-400"
      />
      {toolId === "text-replace" && (
        <div className="flex flex-col md:flex-row gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("请输入查找目标...", "Search for...", "Buscar...")} className="flex-1 p-2.5 border rounded-lg text-sm" />
          <input value={replacement} onChange={e => setReplacement(e.target.value)} placeholder={t("请输入替换内容...", "Replace with...", "Reemplazar con...")} className="flex-1 p-2.5 border rounded-lg text-sm" />
          <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
            <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} />
            {t("正则模式", "Regex", "Regex")}
          </label>
        </div>
      )}
      {toolId === "text-split" && (
        <div className="flex flex-col md:flex-row gap-3">
          <input value={delimiter} onChange={e => setDelimiter(e.target.value)} placeholder={t("请输入要拆分的分隔符，默认为换行分隔符", "Delimiter (default: newline)", "Delimitador (predeterminado: salto de línea)")} className="flex-1 p-2.5 border rounded-lg text-sm" />
          <input value={joiner} onChange={e => setJoiner(e.target.value)} placeholder={t("合并连接符，默认逗号", "Joiner (default comma)", "Unión (por defecto coma)")} className="md:w-64 p-2.5 border rounded-lg text-sm" />
        </div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex flex-wrap gap-3">
        {toolId === "letter-converter" && (
          <>
            <button onClick={() => run(() => toUpperCase(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成大写", "UPPERCASE", "MAYÚSCULAS")}</button>
            <button onClick={() => run(() => toLowerCase(input))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("转成小写", "lowercase", "minúsculas")}</button>
          </>
        )}
        {toolId === "symbol-converter" && (
          <button onClick={() => run(() => convertSymbols(input, direction))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("开始转换", "Convert", "Convertir")}</button>
        )}
        {(toolId === "remove-emoji" || toolId === "line-text" || toolId === "text-line") && (
          <button
            onClick={() => run(() => toolId === "remove-emoji" ? removeEmoji(input) : toolId === "line-text" ? literalNewlinesToReal(input) : realNewlinesToLiteral(input))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >{t("开始处理", "Process", "Procesar")}</button>
        )}
        {toolId === "text-replace" && (
          <button
            onClick={() => { try { const r = replaceAll(input, search, replacement, useRegex); setOutput(r.result); setReplaceCount(r.count); setError("") } catch (e) { setError(e instanceof Error ? e.message : String(e)) } }}
            disabled={!search}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >{t("立即替换", "Replace All", "Reemplazar todo")}</button>
        )}
        {toolId === "text-split" && (
          <button onClick={() => run(() => splitText(input, delimiter, joiner))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("拆分处理", "Split", "Dividir")}</button>
        )}
        <button onClick={() => { setInput(""); setOutput(""); setError(""); setReplaceCount(null) }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {replaceCount !== null && toolId === "text-replace" && (
        <div className="text-sm text-green-600">{t(`替换完成，共替换 ${replaceCount} 处`, `Done, ${replaceCount} replacement(s)`, `Listo, ${replaceCount} reemplazo(s)`)}</div>
      )}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            [t("总字符数", "Total characters", "Caracteres totales"), stats.totalChars],
            [t("不含空格", "No spaces", "Sin espacios"), stats.charsNoSpaces],
            [t("汉字数", "Chinese chars", "Caracteres chinos"), stats.chineseChars],
            [t("英文单词", "English words", "Palabras inglesas"), stats.englishWords],
            [t("数字组", "Numbers", "Números"), stats.numbers],
            [t("标点符号", "Punctuation", "Puntuación"), stats.punctuation],
            [t("行数", "Lines", "Líneas"), stats.lines],
            [t("UTF-8 字节", "UTF-8 bytes", "Bytes UTF-8"), stats.bytesUtf8],
          ] as [string, number][]).map(([label, v]) => (
            <div key={label} className="bg-white border rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{v}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
      {(output || !["word-count"].includes(toolId)) && !stats && (
        <textarea readOnly value={output} placeholder={t("转换结果...", "Result...", "Resultado...")} className="w-full h-36 p-3 border rounded-xl text-sm bg-gray-50" />
      )}
      <div className="flex gap-3">
        <button onClick={copy} disabled={!output} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{copied ? t("已复制", "Copied", "Copiado") : t("复制结果", "Copy Result", "Copiar resultado")}</button>
        <button onClick={downloadTxt} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("下载TXT", "Download TXT", "Descargar TXT")}</button>
      </div>
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
