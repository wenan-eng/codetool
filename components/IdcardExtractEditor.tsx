"use client"
import { useState } from "react"
import { parseIdcard, type IdcardInfo } from "@/lib/textTools2"

export default function IdcardExtractEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [rows, setRows] = useState<IdcardInfo[]>([])
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const run = () => {
    setError("")
    const ids = input.match(/\d{15}|\d{17}[\dXx]/g) || []
    if (!ids.length) { setError(t("未识别到身份证号码", "No ID numbers detected", "No se detectaron números de DNI")); setRows([]); return }
    setRows(ids.map(parseIdcard))
  }

  const exportCsv = () => {
    const csv = "id,birthday,gender,age,valid\n" + rows.map(r => `${r.id},${r.birthday},${r.gender},${r.age},${r.valid ? "Y" : "N"}`).join("\n")
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "idcard-info.csv"
    a.click()
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("请输入要提取的身份证号码，每行一个...", "Enter ID numbers, one per line...", "Introduzca números de DNI, uno por línea...")}
        className="w-full h-36 p-3 border rounded-xl font-mono text-sm focus:outline-none focus:border-blue-400"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex gap-3">
        <button onClick={run} disabled={!input.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{t("数据提取", "Extract", "Extraer")}</button>
        <button onClick={() => { setInput(""); setRows([]); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
      </div>
      {rows.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b"><th className="p-3">ID</th><th className="p-3">{t("生日", "Birthday", "Cumpleaños")}</th><th className="p-3">{t("性别", "Gender", "Género")}</th><th className="p-3">{t("年龄", "Age", "Edad")}</th><th className="p-3">{t("校验", "Valid", "Válido")}</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.id}-${i}`} className="border-b last:border-0">
                    <td className="p-3 font-mono text-xs">{r.id}</td>
                    <td className="p-3">{r.birthday}</td>
                    <td className="p-3">{r.gender}</td>
                    <td className="p-3">{r.age}</td>
                    <td className={`p-3 ${r.valid ? "text-green-600" : "text-red-500"}`}>{r.valid ? t("有效", "Valid", "Válido") : t("无效", "Invalid", "Inválido")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCsv} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("下载EXCEL(CSV)", "Export CSV", "Exportar CSV")}</button>
            <button onClick={() => navigator.clipboard.writeText(rows.map(r => `${r.id} ${r.birthday} ${r.gender} ${r.age}`).join("\n"))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("复制结果", "Copy Result", "Copiar resultado")}</button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
