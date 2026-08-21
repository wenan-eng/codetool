"use client"
import { useState } from "react"
import { generateMeta } from "@/lib/webmasterTools"

export default function MetaGeneratorEditor({ locale = "zh" }: { locale?: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [author, setAuthor] = useState("")
  const [viewport, setViewport] = useState(true)
  const [charset, setCharset] = useState(true)
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [og, setOg] = useState(true)
  const [output, setOutput] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const generate = () => {
    setOutput(generateMeta({ title, description, keywords, author, viewport, charset, robotsIndex, ogTitle: og }))
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("页面标题", "Title", "Título")}</span><input value={title} onChange={e => setTitle(e.target.value)} className="p-2.5 border rounded-lg" /></label>
      <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("描述", "Description", "Descripción")}</span><textarea value={description} onChange={e => setDescription(e.target.value)} className="h-20 p-3 border rounded-xl text-sm" /></label>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("关键词（逗号分隔）", "Keywords (comma separated)", "Palabras clave")}</span><input value={keywords} onChange={e => setKeywords(e.target.value)} className="p-2.5 border rounded-lg" /></label>
        <label className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{t("作者", "Author", "Autor")}</span><input value={author} onChange={e => setAuthor(e.target.value)} className="p-2.5 border rounded-lg" /></label>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <label className="flex items-center gap-2"><input type="checkbox" checked={charset} onChange={e => setCharset(e.target.checked)} />{t("包含 charset", "Include charset", "Incluir charset")}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={viewport} onChange={e => setViewport(e.target.checked)} />{t("包含 viewport", "Include viewport", "Incluir viewport")}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={robotsIndex} onChange={e => setRobotsIndex(e.target.checked)} />{t("允许搜索引擎收录", "Allow indexing", "Permitir indexación")}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={og} onChange={e => setOg(e.target.checked)} />{t("Open Graph 标签", "Open Graph tags", "Etiquetas Open Graph")}</label>
      </div>
      <button onClick={generate} disabled={!title.trim() && !description.trim()} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{t("生成 META 标签", "Generate META tags", "Generar etiquetas META")}</button>
      {output && (
        <>
          <textarea readOnly value={output} className="w-full h-48 p-3 border rounded-xl font-mono text-xs bg-gray-50" />
          <button onClick={() => navigator.clipboard.writeText(output)} className="self-start px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100">⧉ {t("复制代码", "Copy code", "Copiar código")}</button>
        </>
      )}
    </div>
  )
}
