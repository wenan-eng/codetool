"use client"
import { useRef, useState } from "react"
import { md5Bytes } from "@/lib/md5"
import { formatFileSize } from "@/lib/dataUrlTool"

interface Row { name: string; size: number; hash: string }

export default function Md5BatchVerifyEditor({ locale = "zh" }: { locale?: string }) {
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const handleFiles = async (files: FileList) => {
    setBusy(true)
    for (const file of Array.from(files)) {
      const hash = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(md5Bytes(Array.from(new Uint8Array(reader.result as ArrayBuffer))))
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
      setRows(prev => [...prev, { name: file.name, size: file.size, hash }])
    }
    setBusy(false)
  }

  const exportCsv = () => {
    const csv = "name,size,md5\n" + rows.map(r => `${r.name},${r.size},${r.hash}`).join("\n")
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "md5-batch.csv"
    a.click()
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500"
      >
        📁 {t("点击或拖拽文件至此区域上传，支持批量上传任意格式文件", "Click or drag files here (batch supported)", "Haga clic o arrastre archivos aquí (lotes admitidos)")}
      </div>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files?.length) handleFiles(e.target.files) }} />
      {busy && <div className="text-sm text-blue-500">{t("计算中...", "Computing...", "Calculando...")}</div>}
      {rows.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b"><th className="p-3">{t("文件名", "Name", "Nombre")}</th><th className="p-3">{t("大小", "Size", "Tamaño")}</th><th className="p-3">MD5</th><th className="p-3"></th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.name}-${i}`} className="border-b last:border-0">
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-gray-500">{formatFileSize(r.size)}</td>
                    <td className="p-3 font-mono text-xs break-all">{r.hash}</td>
                    <td className="p-3"><button onClick={() => navigator.clipboard.writeText(r.hash)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100">{t("复制", "Copy", "Copiar")}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCsv} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("导出Excel(CSV)", "Export CSV", "Exportar CSV")}</button>
            <button onClick={() => setRows([])} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
