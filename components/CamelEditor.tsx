"use client"
import { useState } from "react"
import { transform } from "@/lib/camelTool"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, string> = {
  zh: `const myVariableName = 'helloWorld';\nlet userAccountId = getUserInfo(myUserId);\nfunction parseMyVariable(myVariableName) {\n  return myVariableName + userAccountId;\n}\n// 下划线示例: my_variable_name, hello_world, foo_bar_baz`,
  en: `const myVariableName = 'helloWorld';\nlet userAccountId = getUserInfo(myUserId);\nfunction parseMyVariable(myVariableName) {\n  return myVariableName + userAccountId;\n}\n// snake_case examples: my_variable_name, hello_world, foo_bar_baz`,
  es: `const myVariableName = 'helloWorld';\nlet userAccountId = getUserInfo(myUserId);\nfunction parseMyVariable(myVariableName) {\n  return myVariableName + userAccountId;\n}\n// ejemplos snake_case: my_variable_name, hello_world, foo_bar_baz`,
}

export default function CamelEditor({ locale = "zh" }: { locale?: string }) {
  const camelMsgs = (messagesMap[locale] || zh).camel
  const editorFallback = (messagesMap[locale] || zh).editor
  // 兼容复用：若 camel 键缺失则回退到 editor/hexConverter 部分键
  const msgs = {
    toSnake: camelMsgs?.toSnake || "驼峰转下划线",
    toCamel: camelMsgs?.toCamel || "下划线转驼峰",
    sample: camelMsgs?.sample || editorFallback?.sample || "查看示例",
    copy: camelMsgs?.copy || editorFallback?.copy || "复制结果",
    clear: camelMsgs?.clear || editorFallback?.clear || "清空数据",
    inputPlaceholder:
      camelMsgs?.inputPlaceholder || "请输入要转换的文本，支持多行代码，如：myVariableName 或 my_variable_name",
    outputPlaceholder: camelMsgs?.outputPlaceholder || "转换结果将显示在这里",
    copied: camelMsgs?.copied || editorFallback?.copied || "已复制",
    localNote: camelMsgs?.localNote || editorFallback?.localNote || "所有操作均在浏览器本地完成，不上传数据",
  }

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const handleToSnake = () => {
    setOutput(transform(input, "toSnake"))
  }
  const handleToCamel = () => {
    setOutput(transform(input, "toCamel"))
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
            onClick={handleToSnake}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {msgs.toSnake}
          </button>
          <button
            onClick={handleToCamel}
            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            {msgs.toCamel}
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
