"use client"
import { useState } from "react"

export default function SitemapExtractorEditor({ locale = "zh" }: { locale?: string }) {
  const [input, setInput] = useState("")
  const [urls, setUrls] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : es)

  const extract = () => {
    const matches = input.match(/<loc>\s*([^<\s]+)\s*<\/loc>/gi) || []
    setUrls(matches.map(m => m.replace(/<\/?loc>/gi, "").trim()))
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("粘贴 sitemap.xml 的完整内容，自动提取全部 <loc> 链接...", "Paste your sitemap.xml content to extract all <loc> URLs...", "Pegue el contenido de sitemap.xml...")}
        className="w-full h-44 p-3 border rounded-xl font-mono text-xs"
      />
      <button onClick={extract} disabled={!input.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{t("提取链接", "Extract URLs", "Extraer URLs")}</button>
      {urls.length > 0 && (
        <>
          <div className="text-sm text-gray-500">{t("共提取", "Extracted", "Extraídas")} <span className="font-bold text-blue-600">{urls.length}</span> {t("个链接", "URLs", "URLs")}</div>
          <textarea readOnly value={urls.join("\n")} className="w-full h-48 p-3 border rounded-xl font-mono text-xs bg-gray-50" onFocus={e => e.currentTarget.select()} />
          <div className="flex gap-3">
            <button onClick={async () => { await navigator.clipboard.writeText(urls.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1500) }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{copied ? t("已复制", "Copied", "Copiado") : t("复制全部", "Copy All", "Copiar todo")}</button>
            <button onClick={() => { const blob = new Blob([urls.join("\n")], { type: "text/plain;charset=utf-8" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sitemap-urls.txt"; a.click() }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{t("下载 TXT", "Download TXT", "Descargar TXT")}</button>
          </div>
        </>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成", "All processing is local.", "Todo local.")}</p>
    </div>
  )
}
