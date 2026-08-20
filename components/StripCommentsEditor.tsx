"use client"
import { useState } from "react"
import { stripComments } from "@/lib/stripComments"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, { code: string; lang: string }> = {
  zh: {
    lang: "js",
    code: `// 单行注释\nconst a = 1; /* 块注释 */\nlet b = 2; // 行尾注释\n/* 多行\n注释 */\nconst s = "// 不是注释";\n# python 注释示例\n# a = 1`,
  },
  en: {
    lang: "js",
    code: `// single line\nconst a = 1; /* block */\nlet b = 2; // trailing\n/* multi\ncomment */\nconst s = "// not a comment";`,
  },
  es: {
    lang: "js",
    code: `// comentario línea\nconst a = 1; /* bloque */\nlet b = 2; // final\nconst s = "// no es comentario";`,
  },
}

const LANG_OPTIONS = [
  { value: "js", label: "JavaScript / TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "java", label: "Java / C / Go" },
]

export default function StripCommentsEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const sc = dict.stripComments || dict["strip-comments"] || {}
  const editorFallback = dict.editor || {}

  const msgs = {
    strip: sc.strip || sc.action || (locale === "en" ? "Strip Comments" : locale === "es" ? "Eliminar Comentarios" : "移除注释"),
    sample: sc.sample || editorFallback.sample || "查看示例",
    copy: sc.copy || editorFallback.copy || "复制结果",
    clear: sc.clear || editorFallback.clear || "清空数据",
    copied: sc.copied || editorFallback.copied || "已复制",
    inputPlaceholder: sc.inputPlaceholder || sc.placeholder || (locale === "en" ? "Paste code with comments" : locale === "es" ? "Pegue código con comentarios" : "请输入带注释的代码"),
    outputPlaceholder: sc.outputPlaceholder || (locale === "en" ? "Result without comments will appear here" : locale === "es" ? "El resultado sin comentarios aparecerá aquí" : "移除注释后的结果将显示在这里"),
    localNote: sc.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
    inputLabel: sc.inputLabel || (locale === "en" ? "Input" : locale === "es" ? "Entrada" : "输入"),
    outputLabel: sc.outputLabel || (locale === "en" ? "Result" : locale === "es" ? "Resultado" : "结果"),
    langLabel: sc.langLabel || (locale === "en" ? "Language" : locale === "es" ? "Lenguaje" : "语言"),
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [lang, setLang] = useState("js")
  const [copied, setCopied] = useState(false)

  const handleStrip = () => {
    setOutput(stripComments(input, lang))
  }
  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setInput(s.code)
    setLang(s.lang)
    setOutput(stripComments(s.code, s.lang))
  }
  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const handleClear = () => {
    setInput("")
    setOutput("")
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50 items-center">
          <button onClick={handleStrip} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {msgs.strip}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{msgs.langLabel}:</span>
            <select value={lang} onChange={e => setLang(e.target.value)} className="border rounded px-2 py-1 text-sm bg-white">
              {LANG_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {msgs.sample}
          </button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {copied ? msgs.copied : msgs.copy}
          </button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">
            {msgs.clear}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.inputLabel}</div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {output && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{output.length} 字符</span>
              )}
            </div>
            <textarea
              value={output}
              onChange={e => setOutput(e.target.value)}
              placeholder={msgs.outputPlaceholder}
              className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
            />
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
