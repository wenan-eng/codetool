"use client"
import { useRef, useState } from "react"
import { md5Bytes } from "@/lib/md5"

export default function Md5VerifyEditor({ locale = "zh" }: { locale?: string }) {
  const [fileHash, setFileHash] = useState("")
  const [fileName, setFileName] = useState("")
  const [compare, setCompare] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const match = fileHash && compare.trim() ? fileHash.toLowerCase() === compare.trim().toLowerCase() : null

  const handleFile = (file: File) => {
    setError("")
    setFileHash("")
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const buf = new Uint8Array(reader.result as ArrayBuffer)
        setFileHash(md5Bytes(Array.from(buf)))
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    }
    reader.onerror = () => setError(t("文件读取失败", "Failed to read file", "Error al leer el archivo"))
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500"
      >
        {t("点击或拖拽文件至此区域上传，支持任意格式文件", "Click or drag a file here (any format)", "Haga clic o arrastre un archivo aquí (cualquier formato)")}
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {fileHash && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded-xl p-4 text-sm flex flex-col gap-1">
            <div className="font-medium">{fileName}</div>
            <div className="text-gray-500">{t("文件MD5值", "File MD5", "MD5 del archivo")}</div>
            <div className="font-mono text-xs break-all">{fileHash}</div>
            <button onClick={() => navigator.clipboard.writeText(fileHash)} className="self-start mt-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100">{t("复制MD5值", "Copy MD5", "Copiar MD5")}</button>
          </div>
          <input
            value={compare}
            onChange={e => setCompare(e.target.value)}
            placeholder={t("输入待比对的MD5值", "Enter the MD5 to compare", "Introduzca el MD5 a comparar")}
            className="w-full p-3 border rounded-xl font-mono text-sm focus:outline-none focus:border-blue-400"
          />
          {match !== null && (
            <div className={`text-sm font-medium ${match ? "text-green-600" : "text-red-500"}`}>
              {match ? t("✅ 校验一致：文件完整", "✅ Match: file is intact", "✅ Coincide: el archivo está intacto") : t("❌ 校验不一致：文件可能被篡改或损坏", "❌ Mismatch: file may be corrupted or tampered", "❌ No coincide: el archivo puede estar dañado")}
            </div>
          )}
          <button onClick={() => { setFileHash(""); setFileName(""); setCompare("") }} className="self-start px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
