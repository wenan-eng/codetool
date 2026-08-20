"use client"
import { useState, useEffect } from "react"
import { toTimestamp, fromTimestamp, formatDate, TIMEZONES } from "@/lib/timestampTool"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

export default function TimestampEditor({ locale = "zh" }: { locale?: string }) {
  const msgs = (messagesMap[locale] || zh).timestamp || {}
  const fallback = (messagesMap[locale] || zh).editor

  const t = {
    currentTitle: msgs.currentTitle || (locale === "en" ? "Current Timestamp" : locale === "es" ? "Timestamp actual" : "当前时间戳"),
    seconds: msgs.seconds || (locale === "en" ? "Seconds (10 digits)" : locale === "es" ? "Segundos (10 dígitos)" : "秒级 (10位)"),
    milliseconds: msgs.milliseconds || (locale === "en" ? "Milliseconds (13 digits)" : locale === "es" ? "Milisegundos (13 dígitos)" : "毫秒级 (13位)"),
    switchUnit: msgs.switchUnit || (locale === "en" ? "Switch Unit" : locale === "es" ? "Cambiar unidad" : "切换单位"),
    copy: msgs.copy || fallback?.copy || "复制",
    copied: msgs.copied || fallback?.copied || "已复制",
    stop: msgs.stop || (locale === "en" ? "Stop" : locale === "es" ? "Detener" : "停止"),
    start: msgs.start || (locale === "en" ? "Start" : locale === "es" ? "Iniciar" : "开始"),
    tsToDate: msgs.tsToDate || (locale === "en" ? "Timestamp → Date" : locale === "es" ? "Timestamp → Fecha" : "时间戳转日期"),
    dateToTs: msgs.dateToTs || (locale === "en" ? "Date → Timestamp" : locale === "es" ? "Fecha → Timestamp" : "日期转时间戳"),
    tsPlaceholder: msgs.tsPlaceholder || "请输入时间戳，支持10位秒或13位毫秒，如 1700000000",
    datePlaceholder: msgs.datePlaceholder || "请输入日期时间，如 2023-11-14 22:13:20",
    timezone: msgs.timezone || (locale === "en" ? "Timezone" : locale === "es" ? "Zona horaria" : "时区"),
    convertToDate: msgs.convertToDate || (locale === "en" ? "Convert to Date" : locale === "es" ? "Convertir a fecha" : "转成日期时间"),
    convertToTs: msgs.convertToTs || (locale === "en" ? "Convert to Timestamp" : locale === "es" ? "Convertir a timestamp" : "转成时间戳"),
    clear: msgs.clear || fallback?.clear || "清空数据",
    localNote: msgs.localNote || fallback?.localNote || "所有操作均在浏览器本地完成，不上传数据",
    year: msgs.year || (locale === "en" ? "Year" : locale === "es" ? "Año" : "年"),
    month: msgs.month || (locale === "en" ? "Month" : locale === "es" ? "Mes" : "月"),
    day: msgs.day || (locale === "en" ? "Day" : locale === "es" ? "Día" : "日"),
    hour: msgs.hour || (locale === "en" ? "Hour" : locale === "es" ? "Hora" : "时"),
    minute: msgs.minute || (locale === "en" ? "Minute" : locale === "es" ? "Minuto" : "分"),
    second: msgs.second || (locale === "en" ? "Second" : locale === "es" ? "Segundo" : "秒"),
    tsResult: msgs.tsResult || (locale === "en" ? "Timestamp Result" : locale === "es" ? "Resultado timestamp" : "时间戳结果"),
    dateResult: msgs.dateResult || (locale === "en" ? "Date Result" : locale === "es" ? "Resultado fecha" : "日期结果"),
  }

  // live timestamp
  const [unit, setUnit] = useState<"s" | "ms">("s")
  const [now, setNow] = useState<string>("")
  const [running, setRunning] = useState(true)
  const [copiedNow, setCopiedNow] = useState(false)

  useEffect(() => {
    const tick = () => {
      const v = unit === "s" ? String(Math.floor(Date.now() / 1000)) : String(Date.now())
      setNow(v)
    }
    tick()
    if (!running) return
    const id = setInterval(tick, unit === "s" ? 1000 : 100)
    return () => clearInterval(id)
  }, [unit, running])

  const handleCopyNow = async () => {
    await navigator.clipboard.writeText(now)
    setCopiedNow(true)
    setTimeout(() => setCopiedNow(false), 1500)
  }

  // ts -> date
  const [tsInput, setTsInput] = useState("")
  const [tsTz, setTsTz] = useState<number>(8)
  const [dateOutput, setDateOutput] = useState("")
  const [tsToDateError, setTsToDateError] = useState<string | null>(null)

  const handleTsToDate = () => {
    setTsToDateError(null)
    const raw = tsInput.trim()
    if (!raw) {
      setTsToDateError(locale === "en" ? "Please enter timestamp" : locale === "es" ? "Ingrese timestamp" : "请输入时间戳")
      return
    }
    // auto detect unit by length
    const digits = raw.replace(/^-/, "")
    const detectedUnit: "s" | "ms" = digits.length >= 13 ? "ms" : digits.length === 10 ? "s" : digits.length > 10 ? "ms" : "s"
    try {
      const res = fromTimestamp(raw, detectedUnit, tsTz)
      setDateOutput(res)
    } catch (e: any) {
      setTsToDateError(e.message)
    }
  }

  // date -> ts
  const [dateInput, setDateInput] = useState("")
  const [dateTz, setDateTz] = useState<number>(8)
  const [tsOutputS, setTsOutputS] = useState("")
  const [tsOutputMs, setTsOutputMs] = useState("")
  const [dateToTsError, setDateToTsError] = useState<string | null>(null)

  // detailed Y M D H m s
  const nowD = new Date()
  const [y, setY] = useState(String(nowD.getFullYear()))
  const [mo, setMo] = useState(String(nowD.getMonth() + 1).padStart(2, "0"))
  const [d, setD] = useState(String(nowD.getDate()).padStart(2, "0"))
  const [h, setH] = useState(String(nowD.getHours()).padStart(2, "0"))
  const [mi, setMi] = useState(String(nowD.getMinutes()).padStart(2, "0"))
  const [s, setS] = useState(String(nowD.getSeconds()).padStart(2, "0"))

  const handleDateToTs = () => {
    setDateToTsError(null)
    try {
      let dateStr = dateInput.trim()
      // 若输入为空，则用 Y/M/D H:m:s 组合
      if (!dateStr) {
        dateStr = `${y}-${mo}-${d} ${h}:${mi}:${s}`
      }
      const tsS = toTimestamp(dateStr, "s", dateTz)
      const tsMs = toTimestamp(dateStr, "ms", dateTz)
      setTsOutputS(String(tsS))
      setTsOutputMs(String(tsMs))
    } catch (e: any) {
      setDateToTsError(e.message)
    }
  }

  const handleCopy = async (v: string, setter: (b: boolean) => void) => {
    if (!v) return
    await navigator.clipboard.writeText(v)
    setter(true)
    setTimeout(() => setter(false), 1500)
  }
  const [copiedDate, setCopiedDate] = useState(false)
  const [copiedTsS, setCopiedTsS] = useState(false)
  const [copiedTsMs, setCopiedTsMs] = useState(false)

  const [currentDateDisplay, setCurrentDateDisplay] = useState("")
  useEffect(() => {
    const ms = unit === "s" ? Number(now) * 1000 : Number(now)
    if (!isNaN(ms) && now) {
      try {
        // show current date in selected tz for preview; use tsTz as preview tz?
        // use Beijing as default display for current timestamp
        setCurrentDateDisplay(formatDate(new Date(ms), "YYYY-MM-DD HH:mm:ss", 8))
      } catch {}
    }
  }, [now, unit])

  return (
    <div className="space-y-4">
      {/* 当前时间戳 */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="text-sm font-medium">{t.currentTitle}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit(unit === "s" ? "ms" : "s")}
              className="px-3 py-1.5 text-xs border rounded-full hover:bg-gray-50"
            >
              {t.switchUnit} ({unit === "s" ? "→ ms" : "→ s"})
            </button>
            <button
              onClick={() => setRunning(!running)}
              className={`px-3 py-1.5 text-xs rounded-full border ${running ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}
            >
              {running ? t.stop : t.start}
            </button>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg font-mono text-sm flex items-center justify-between">
              <span>{now || "—"}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded ml-2">{unit === "s" ? "秒" : "毫秒"}</span>
            </div>
            <button onClick={handleCopyNow} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shrink-0">
              {copiedNow ? t.copied : t.copy}
            </button>
          </div>
        </div>
        {currentDateDisplay && <div className="mt-2 text-xs text-gray-500">北京时间: {currentDateDisplay} (UTC+8)</div>}
        <div className="mt-2 text-xs text-gray-400">{t.localNote}</div>
      </div>

      {/* 时间戳 -> 日期 */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="font-medium text-sm mb-3">{t.tsToDate}</div>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <input
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder={t.tsPlaceholder}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono"
          />
          <select
            value={tsTz}
            onChange={(e) => setTsTz(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 md:w-48"
          >
            {TIMEZONES.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mb-3">
          <button onClick={handleTsToDate} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {t.convertToDate}
          </button>
          <button
            onClick={() => {
              setTsInput("")
              setDateOutput("")
              setTsToDateError(null)
            }}
            className="px-5 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {t.clear}
          </button>
        </div>
        {tsToDateError && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{tsToDateError}</div>}
        <div className="flex gap-2">
          <input readOnly value={dateOutput} placeholder={t.dateResult} className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 font-mono" />
          <button
            onClick={() => handleCopy(dateOutput, setCopiedDate)}
            className="px-3 py-2 text-xs border rounded hover:bg-gray-50 shrink-0"
          >
            {copiedDate ? t.copied : t.copy}
          </button>
        </div>
      </div>

      {/* 日期 -> 时间戳 */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="font-medium text-sm mb-3">{t.dateToTs}</div>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <input
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder={t.datePlaceholder}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono"
          />
          <select
            value={dateTz}
            onChange={(e) => setDateTz(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 md:w-48"
          >
            {TIMEZONES.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </div>

        {/* 年月日时分秒分别输入 */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-2">{locale === "en" ? "Or fill fields (UTC+8 by default when using fields):" : locale === "es" ? "O complete los campos:" : "或分别输入年月日时分秒（留空日期框时生效）："} </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">{t.year}</span>
              <input value={y} onChange={(e) => setY(e.target.value)} className="border rounded px-2 py-1.5 text-sm font-mono" placeholder="2023" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">{t.month}</span>
              <input value={mo} onChange={(e) => setMo(e.target.value)} className="border rounded px-2 py-1.5 text-sm font-mono" placeholder="11" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">{t.day}</span>
              <input value={d} onChange={(e) => setD(e.target.value)} className="border rounded px-2 py-1.5 text-sm font-mono" placeholder="14" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">{t.hour}</span>
              <input value={h} onChange={(e) => setH(e.target.value)} className="border rounded px-2 py-1.5 text-sm font-mono" placeholder="22" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">{t.minute}</span>
              <input value={mi} onChange={(e) => setMi(e.target.value)} className="border rounded px-2 py-1.5 text-sm font-mono" placeholder="13" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-500">{t.second}</span>
              <input value={s} onChange={(e) => setS(e.target.value)} className="border rounded px-2 py-1.5 text-sm font-mono" placeholder="20" />
            </label>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button onClick={handleDateToTs} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {t.convertToTs}
          </button>
          <button
            onClick={() => {
              setDateInput("")
              setTsOutputS("")
              setTsOutputMs("")
              setDateToTsError(null)
            }}
            className="px-5 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {t.clear}
          </button>
        </div>
        {dateToTsError && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{dateToTsError}</div>}
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="w-20 text-xs text-gray-500 flex items-center">秒 (10位)</span>
            <input readOnly value={tsOutputS} placeholder="—" className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50 font-mono" />
            <button onClick={() => handleCopy(tsOutputS, setCopiedTsS)} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">
              {copiedTsS ? t.copied : t.copy}
            </button>
          </div>
          <div className="flex gap-2">
            <span className="w-20 text-xs text-gray-500 flex items-center">毫秒 (13位)</span>
            <input readOnly value={tsOutputMs} placeholder="—" className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50 font-mono" />
            <button onClick={() => handleCopy(tsOutputMs, setCopiedTsMs)} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">
              {copiedTsMs ? t.copied : t.copy}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
