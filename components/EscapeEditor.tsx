"use client"
import { useState } from "react"
import { transformEscape } from "@/lib/escapeCodec"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: `你好世界\nHello World 123 @*_+-./\n特殊字符：<a href="?q=测试">链接 & 符号</a>\n😀 Emoji 表情`,
  en: `Hello World\n你好世界 123 @*_+-./\nSpecial chars: <a href="?q=test">link & symbol</a>\n😀 Emoji`,
  es: `Hola Mundo\n你好世界 123 @*_+-./\nCaracteres especiales: <a href="?q=prueba">enlace y símbolo</a>\n😀 Emoji`,
}

export default function EscapeEditor({ locale = "zh" }: { locale?: string }) {
  const toolMsgs = (messagesMap[locale] || zh).escapeCodec
  const editorFallback = (messagesMap[locale] || zh).editor
  const msgs = {
    encode: toolMsgs?.encode || editorFallback?.encode || "Escape编码",
    decode: toolMsgs?.decode || editorFallback?.decode || "Escape解码",
    sample: toolMsgs?.sample || editorFallback?.sample || "查看示例",
    copy: toolMsgs?.copy || editorFallback?.copy || "复制结果",
    clear: toolMsgs?.clear || editorFallback?.clear || "清空数据",
    copied: toolMsgs?.copied || editorFallback?.copied || "已复制",
    inputPlaceholder: toolMsgs?.inputPlaceholder || "请输入要进行 Escape 编码/解码的文本内容...",
    outputPlaceholder: toolMsgs?.outputPlaceholder || "转换结果将显示在这里",
    localNote: toolMsgs?.localNote || editorFallback?.localNote || "所有操作均在浏览器本地完成，不上传数据",
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const handleEncode = () => {
    setOutput(transformEscape(input, "encode"))
  }
  const handleDecode = () => {
    setOutput(transformEscape(input, "decode"))
  }
  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setInput(s)
    setOutput("")
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
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleEncode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {msgs.encode}
          </button>
          <button
            onClick={handleDecode}
            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {msgs.decode}
          </button>
          <button
            onClick={handleSample}
            className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          >
            {msgs.sample}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          >
            {copied ? msgs.copied : msgs.copy}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm text-gray-600 hover:text-red-600"
          >
            {msgs.clear}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">输入</div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={msgs.inputPlaceholder}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>结果</span>
              {output && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {output.split("\n").length} 行
                </span>
              )}
            </div>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={msgs.outputPlaceholder}
              className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
              readOnly={false}
            />
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
