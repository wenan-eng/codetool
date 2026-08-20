"use client"
import { useState, useEffect } from "react"
import { batchConvert, convertDate, formatDate, SUPPORTED_FORMATS } from "@/lib/datetimeConverter"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }

const FORMAT_OPTIONS = [
  { value: "auto", labelZh: "自动识别", labelEn: "Auto detect", labelEs: "Auto detectar" },
  { value: "YYYY-MM-DD", labelZh: "YYYY-MM-DD", labelEn: "YYYY-MM-DD", labelEs: "YYYY-MM-DD" },
  { value: "YYYY/MM/DD", labelZh: "YYYY/MM/DD", labelEn: "YYYY/MM/DD", labelEs: "YYYY/MM/DD" },
  { value: "YYYY.MM.DD", labelZh: "YYYY.MM.DD", labelEn: "YYYY.MM.DD", labelEs: "YYYY.MM.DD" },
  { value: "YYYY-MM-DD HH:mm:ss", labelZh: "YYYY-MM-DD HH:mm:ss", labelEn: "YYYY-MM-DD HH:mm:ss", labelEs: "YYYY-MM-DD HH:mm:ss" },
  { value: "YYYY/MM/DD HH:mm:ss", labelZh: "YYYY/MM/DD HH:mm:ss", labelEn: "YYYY/MM/DD HH:mm:ss", labelEs: "YYYY/MM/DD HH:mm:ss" },
  { value: "MM-DD-YYYY", labelZh: "MM-DD-YYYY", labelEn: "MM-DD-YYYY", labelEs: "MM-DD-YYYY" },
  { value: "MM/DD/YYYY", labelZh: "MM/DD/YYYY", labelEn: "MM/DD/YYYY", labelEs: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", labelZh: "DD/MM/YYYY", labelEn: "DD/MM/YYYY", labelEs: "DD/MM/YYYY" },
  { value: "DD-MM-YYYY", labelZh: "DD-MM-YYYY", labelEn: "DD-MM-YYYY", labelEs: "DD-MM-YYYY" },
  { value: "YYYYMMDD", labelZh: "YYYYMMDD", labelEn: "YYYYMMDD", labelEs: "YYYYMMDD" },
  { value: "ISO", labelZh: "ISO 8601", labelEn: "ISO 8601", labelEs: "ISO 8601" },
  { value: "timestamp-s", labelZh: "时间戳(秒)", labelEn: "Timestamp (s)", labelEs: "Timestamp (s)" },
  { value: "timestamp-ms", labelZh: "时间戳(毫秒)", labelEn: "Timestamp (ms)", labelEs: "Timestamp (ms)" },
]

const OUTPUT_FORMATS = FORMAT_OPTIONS.filter(f => f.value !== "auto").concat([
  { value: "YYYY年MM月DD日", labelZh: "YYYY年MM月DD日", labelEn: "YYYY年MM月DD日", labelEs: "YYYY年MM月DD日" },
  { value: "YYYY年MM月DD日 HH:mm:ss", labelZh: "YYYY年MM月DD日 HH:mm:ss", labelEn: "YYYY年MM月DD日 HH:mm:ss", labelEs: "YYYY年MM月DD日 HH:mm:ss" },
  { value: "MM/DD/YYYY HH:mm", labelZh: "MM/DD/YYYY HH:mm", labelEn: "MM/DD/YYYY HH:mm", labelEs: "MM/DD/YYYY HH:mm" },
  { value: "DD-MM-YYYY HH:mm:ss", labelZh: "DD-MM-YYYY HH:mm:ss", labelEn: "DD-MM-YYYY HH:mm:ss", labelEs: "DD-MM-YYYY HH:mm:ss" },
])

const SAMPLES: Record<string, string> = {
  zh: `2024-01-15
2024/02/20 10:30:00
2024-03-10 08:05:09
1705276800
20240115`,
  en: `2024-01-15
2024/02/20 10:30:00
2024-03-10 08:05:09
1705276800
20240115`,
  es: `2024-01-15
2024/02/20 10:30:00
2024-03-10 08:05:09
1705276800
20240115`,
}

export default function DatetimeConverterEditor({ locale = "zh" }: { locale?: string }) {
  const msgs = (messagesMap[locale] || zh).datetimeConverter || {}
  const t = (key: string, fallback: string) => msgs[key] || fallback

  const [input, setInput] = useState("")
  const [fromFmt, setFromFmt] = useState("auto")
  const [toFmt, setToFmt] = useState("YYYY/MM/DD")
  const [customToFmt, setCustomToFmt] = useState("")
  const [useCustom, setUseCustom] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [nowStr, setNowStr] = useState("")

  const effectiveToFmt = useCustom && customToFmt.trim() ? customToFmt.trim() : toFmt

  const handleConvert = () => {
    try {
      if (!input.trim()) { setError(t("emptyError", "请输入日期")); setOutput([]); return }
      const lines = batchConvert(input, fromFmt, effectiveToFmt)
      // 检查是否有 ERROR 行
      const hasError = lines.some(l => l.startsWith("ERROR"))
      if (hasError) {
        // 将错误行展示但也提示
        setOutput(lines)
        setError(t("partialError", "部分行解析失败，请检查输入格式"))
      } else {
        setOutput(lines)
        setError(null)
      }
    } catch (e: any) {
      setError(e.message)
      setOutput([])
    }
  }

  const handleClear = () => { setInput(""); setOutput([]); setError(null) }
  const handleSample = () => { setInput(SAMPLES[locale] || SAMPLES.zh); setOutput([]); setError(null) }
  const handleSwap = () => {
    // 交换输入输出及格式（若可交换）
    if (output.length && !output.some(l => l.startsWith("ERROR"))) {
      setInput(output.join("\n"))
      setOutput(input.split("\n").map(l => l.trim() ? "" : ""))
    }
    if (fromFmt !== "auto" && !useCustom) {
      const tmp = fromFmt
      setFromFmt(toFmt)
      setToFmt(tmp)
    }
  }
  const handleCopy = async () => {
    const text = output.join("\n")
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const handleCopyOne = async (v: string) => { await navigator.clipboard.writeText(v) }

  // 当前时间预览
  useEffect(() => {
    try { setNowStr(formatDate(new Date(), effectiveToFmt)) } catch { setNowStr("") }
  }, [effectiveToFmt])

  const getLabel = (opt: any) => locale === "en" ? (opt.labelEn || opt.value) : locale === "es" ? (opt.labelEs || opt.value) : (opt.labelZh || opt.value)

  return (
    <div className="space-y-4">
      {/* 配置区 */}
      <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t("fromLabel", "输入格式")}</label>
            <select value={fromFmt} onChange={e => setFromFmt(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
              {FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{getLabel(o)}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">{t("fromHint", "自动识别可处理多种常见格式与时间戳")}</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("toLabel", "输出格式")}</label>
            <div className="flex gap-2">
              <select value={toFmt} onChange={e => { setToFmt(e.target.value); setUseCustom(false) }} className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white" disabled={useCustom}>
                {OUTPUT_FORMATS.map(o => <option key={o.value} value={o.value}>{getLabel(o)}</option>)}
              </select>
              <button onClick={handleSwap} title={t("swap", "交换")} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 shrink-0">⇄</button>
            </div>
            <label className="flex items-center gap-1.5 mt-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="rounded" />
              {t("customLabel", "自定义输出格式")}
            </label>
            {useCustom && (
              <input value={customToFmt} onChange={e => setCustomToFmt(e.target.value)} placeholder="YYYY-MM-DD HH:mm:ss 或 YYYY年MM月DD日" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-200" />
            )}
            <p className="text-xs text-gray-400 mt-1">{t("toHint", "占位符: YYYY YY MM DD HH mm ss SSS")} · {t("nowPreview", "当前预览")}: <span className="font-mono text-gray-600">{nowStr || "—"}</span></p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleConvert} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("convert", "转换")}</button>
          <button onClick={handleSample} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">{t("sample", "查看示例")}</button>
          <button onClick={handleCopy} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">{copied ? t("copied", "已复制") : t("copy", "复制结果")}</button>
          <button onClick={handleClear} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">{t("clear", "清空数据")}</button>
        </div>
        {error && <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">{error}</div>}
        <div className="text-xs text-gray-400">{t("localNote", "所有操作均在浏览器本地完成，不上传数据")}</div>
      </div>

      {/* 编辑区 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex justify-between items-center">
            <span>{t("inputTitle", "输入（每行一条，批量转换）")}</span>
            {input && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{input.split("\n").filter(l=>l.trim()).length} {t("lines", "条")}</span>}
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t("inputPlaceholder", "请输入日期，例如：\n2024-01-15\n2024/02/20 10:30:00\n1705276800 (时间戳秒)\n20240115")}
            className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none flex-1"
          />
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex justify-between items-center">
            <span>{t("outputTitle", "转换结果")}</span>
            {output.length > 0 && !output.every(l=>l==="") && (
              <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded">{output.filter(l=>l.trim() && !l.startsWith("ERROR")).length} {t("successCount", "成功")}</span>
            )}
          </div>
          <div className="flex-1 h-[300px] overflow-auto">
            {output.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 font-mono">{t("outputPlaceholder", "转换结果将显示在这里")}</div>
            ) : (
              <div className="divide-y">
                {output.map((line, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 text-sm font-mono ${line.startsWith("ERROR") ? "bg-red-50 text-red-600" : "hover:bg-gray-50"}`}>
                    <span className="text-xs text-gray-400 w-6 shrink-0">{i+1}</span>
                    <span className="flex-1 break-all">{line || <span className="text-gray-300">— 空行 —</span>}</span>
                    {line && !line.startsWith("ERROR") && (
                      <button onClick={() => handleCopyOne(line)} className="text-xs px-2 py-1 border rounded hover:bg-white shrink-0">{t("copyOne", "复制")}</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 格式说明 */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-2">{t("formatHelpTitle", "格式占位符说明")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <span className="px-2 py-1 bg-gray-50 rounded"><b>YYYY</b> {t("phYear", "四位年份")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>YY</b> {t("phYearShort", "两位年份")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>MM</b> {t("phMonth", "月份 01-12")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>DD</b> {t("phDay", "日期 01-31")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>HH</b> {t("phHour", "小时 00-23")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>mm</b> {t("phMinute", "分钟 00-59")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>ss</b> {t("phSecond", "秒 00-59")}</span>
          <span className="px-2 py-1 bg-gray-50 rounded"><b>SSS</b> {t("phMs", "毫秒 000-999")}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">{t("formatHelpDesc", "示例：YYYY年MM月DD日 HH:mm:ss → 2024年01月15日 10:30:00；timestamp-s / timestamp-ms / ISO 为特殊格式直接输出对应值。")}</p>
      </div>
    </div>
  )
}
