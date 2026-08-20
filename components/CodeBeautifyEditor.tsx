"use client"
import { useState } from "react"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

import * as jsFormatter from "@/lib/jsFormatter"
import * as htmlFormatter from "@/lib/htmlFormatter"
import * as cssFormatter from "@/lib/cssFormatter"
import * as sqlFormatter from "@/lib/sqlFormatter"
import * as yamlFormatter from "@/lib/yamlFormatter"

const messagesMap: Record<string, any> = { zh, en, es }

type Formatter = {
  beautify: (s: string, indent?: number) => string
  compress: (s: string) => string
  sample?: string
}

const formatterMap: Record<string, Formatter> = {
  "js-formatter": { beautify: jsFormatter.beautify, compress: jsFormatter.compress, sample: jsFormatter.sampleJs },
  "html-formatter": { beautify: htmlFormatter.beautify, compress: htmlFormatter.compress, sample: htmlFormatter.sampleHtml },
  "css-formatter": { beautify: cssFormatter.beautify, compress: cssFormatter.compress, sample: cssFormatter.sampleCss },
  "sql-formatter": { beautify: sqlFormatter.beautify, compress: sqlFormatter.compress, sample: sqlFormatter.sampleSql },
  "sql-format": { beautify: sqlFormatter.beautify, compress: sqlFormatter.compress, sample: sqlFormatter.sampleSql },
  "yaml-formatter": { beautify: yamlFormatter.beautify, compress: yamlFormatter.compress, sample: yamlFormatter.sampleYaml },
  js: { beautify: jsFormatter.beautify, compress: jsFormatter.compress, sample: jsFormatter.sampleJs },
  html: { beautify: htmlFormatter.beautify, compress: htmlFormatter.compress, sample: htmlFormatter.sampleHtml },
  css: { beautify: cssFormatter.beautify, compress: cssFormatter.compress, sample: cssFormatter.sampleCss },
  sql: { beautify: sqlFormatter.beautify, compress: sqlFormatter.compress, sample: sqlFormatter.sampleSql },
  yaml: { beautify: yamlFormatter.beautify, compress: yamlFormatter.compress, sample: yamlFormatter.sampleYaml },
}

export default function CodeBeautifyEditor({
  formatter,
  toolId,
  locale = "zh",
}: {
  formatter?: Formatter | string
  toolId?: string
  locale?: string
}) {
  // resolve formatter
  let fmt: Formatter | undefined
  if (typeof formatter === "string") {
    fmt = formatterMap[formatter]
  } else if (formatter && typeof formatter === "object" && "beautify" in formatter) {
    fmt = formatter as Formatter
  } else if (toolId) {
    fmt = formatterMap[toolId]
  }
  // fallback to js
  if (!fmt) fmt = formatterMap["js-formatter"]

  const dict = (messagesMap[locale] || zh) as any
  // try per-tool namespace, then codeBeautify generic, then editor fallback
  const toolKey = toolId || (typeof formatter === "string" ? formatter : "codeBeautify")
  const perToolMsgs = dict[toolKey] || dict.codeBeautify || dict.jsFormatter || {}
  const generic = dict.codeBeautify || {}
  const editorFallback = dict.editor || {}

  const msgs = {
    beautify: perToolMsgs.beautify || generic.beautify || editorFallback.beautify || (locale === "en" ? "Beautify" : locale === "es" ? "Embellecer" : "美化"),
    compress: perToolMsgs.compress || generic.compress || editorFallback.compress || (locale === "en" ? "Minify" : locale === "es" ? "Comprimir" : "压缩"),
    sample: perToolMsgs.sample || generic.sample || editorFallback.sample || (locale === "en" ? "Load Sample" : locale === "es" ? "Ver Ejemplo" : "查看示例"),
    copy: perToolMsgs.copy || generic.copy || editorFallback.copy || (locale === "en" ? "Copy" : locale === "es" ? "Copiar" : "复制结果"),
    clear: perToolMsgs.clear || generic.clear || editorFallback.clear || (locale === "en" ? "Clear" : locale === "es" ? "Limpiar" : "清空数据"),
    copied: perToolMsgs.copied || generic.copied || editorFallback.copied || (locale === "en" ? "Copied" : locale === "es" ? "Copiado" : "已复制"),
    placeholder:
      perToolMsgs.placeholder ||
      generic.placeholder ||
      editorFallback.placeholder ||
      (locale === "en" ? "Paste code to beautify/minify" : locale === "es" ? "Pegue código para embellecer/comprimir" : "请输入要美化/压缩的代码"),
    localNote: perToolMsgs.localNote || generic.localNote || editorFallback.localNote || (locale === "en" ? "All processing is done locally in your browser, no upload" : locale === "es" ? "Todo se procesa localmente, sin subida" : "所有操作均在浏览器本地完成，不上传数据"),
  }

  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleBeautify = () => {
    try {
      const r = fmt!.beautify(value)
      setValue(r)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }
  const handleCompress = () => {
    try {
      const r = fmt!.compress(value)
      setValue(r)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }
  const handleSample = () => {
    if (fmt!.sample) {
      setValue(fmt!.sample)
      setError(null)
    }
  }
  const handleCopy = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const handleClear = () => {
    setValue("")
    setError(null)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
        <button onClick={handleBeautify} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          {msgs.beautify}
        </button>
        <button onClick={handleCompress} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
          {msgs.compress}
        </button>
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
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          placeholder={msgs.placeholder}
          className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none"
        />
        {error && <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 text-red-600 text-xs px-4 py-2">校验失败: {error}</div>}
      </div>
      <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
    </div>
  )
}

// 额外导出便于 ToolLayout 直接按 toolId 使用
export function CodeBeautifyEditorByTool({ toolId, locale }: { toolId: string; locale?: string }) {
  return <CodeBeautifyEditor toolId={toolId} locale={locale} />
}
