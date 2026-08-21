"use client"
import { useState } from "react"
import { generateRobots, checkRobots, type RobotIssue } from "@/lib/webmasterTools"

export default function RobotsEditor({ toolId, locale = "zh" }: { toolId: "robots" | "robots-check"; locale?: string }) {
  const [ua, setUa] = useState("*")
  const [disallow, setDisallow] = useState("/admin\n/wp-admin/")
  const [allow, setAllow] = useState("")
  const [delay, setDelay] = useState("")
  const [sitemap, setSitemap] = useState("")
  const [text, setText] = useState("")
  const [output, setOutput] = useState("")
  const [issues, setIssues] = useState<RobotIssue[]>([])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const generate = () => {
    setOutput(generateRobots({
      userAgent: ua,
      allow: allow.split(/\n/),
      disallow: disallow.split(/\n/),
      crawlDelay: Number(delay) || undefined,
      sitemap,
    }))
  }

  const check = () => {
    setIssues(checkRobots(text))
  }

  return (
    <div className="flex flex-col gap-4">
      {toolId === "robots" ? (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">User-agent</span><input value={ua} onChange={e => setUa(e.target.value)} placeholder="*" className="p-2.5 border rounded-lg" /></label>
            <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("抓取延迟秒(可选)", "Crawl-delay (optional)", "Crawl-delay")}</span><input value={delay} onChange={e => setDelay(e.target.value)} inputMode="numeric" className="p-2.5 border rounded-lg" /></label>
          </div>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("禁止目录（每行一个）", "Disallow (one per line)", "Disallow (uno por línea)")}</span><textarea value={disallow} onChange={e => setDisallow(e.target.value)} className="h-24 p-3 border rounded-xl font-mono text-xs" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("允许目录（每行一个，可选）", "Allow (one per line, optional)", "Allow (opcional)")}</span><textarea value={allow} onChange={e => setAllow(e.target.value)} className="h-16 p-3 border rounded-xl font-mono text-xs" /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">Sitemap</span><input value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://codetool.site/sitemap.xml" className="p-2.5 border rounded-lg font-mono text-xs" /></label>
          <button onClick={generate} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{t("生成 robots.txt", "Generate robots.txt", "Generar robots.txt")}</button>
          {output && (
            <>
              <textarea readOnly value={output} className="w-full h-40 p-3 border rounded-xl font-mono text-xs bg-gray-50" />
              <button onClick={() => navigator.clipboard.writeText(output)} className="self-start px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100">⧉ {t("复制内容", "Copy", "Copiar")}</button>
            </>
          )}
        </>
      ) : (
        <>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t("粘贴 robots.txt 内容进行语法检测...", "Paste robots.txt content to validate...", "Pegue el contenido de robots.txt...")} className="w-full h-48 p-3 border rounded-xl font-mono text-xs" />
          <button onClick={check} disabled={!text.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{t("开始检测", "Validate", "Validar")}</button>
          {issues.length > 0 && (
            <div className="bg-white border rounded-xl overflow-hidden">
              {issues.map((i, idx) => (
                <div key={idx} className={`p-3 text-sm border-b last:border-0 ${i.line === 0 ? "bg-yellow-50 text-yellow-700" : "text-gray-600"}`}>
                  {i.line > 0 && <span className="font-mono text-xs mr-2">{t("第", "Line", "Línea")} {i.line}</span>}{i.message}
                </div>
              ))}
            </div>
          )}
          {issues.length === 0 && text.trim() && <div className="text-sm text-green-600">✅ {t("未发现问题", "No issues found", "Sin problemas")}</div>}
        </>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally.", "Todo local.")}</p>
    </div>
  )
}
