"use client"
import { useState } from "react"
import { jsonToCsv, csvToJson, jsonToYaml, yamlToJson, jsonToXml, xmlToJson } from "@/lib/dataConvert"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

type Mode = "json-csv" | "csv-json" | "json-yaml" | "yaml-json" | "json-xml" | "xml-json"

const SAMPLES: Record<Mode, Record<string, string>> = {
  "json-csv": {
    zh: JSON.stringify([{ name: "Alice", age: 30, city: "北京" }, { name: "Bob", age: 25, city: "上海" }], null, 2),
    en: JSON.stringify([{ name: "Alice", age: 30, city: "NY" }, { name: "Bob", age: 25, city: "LA" }], null, 2),
    es: JSON.stringify([{ name: "Alice", age: 30, city: "Madrid" }, { name: "Bob", age: 25, city: "Barcelona" }], null, 2),
  },
  "csv-json": {
    zh: "name,age,city\nAlice,30,北京\nBob,25,上海",
    en: "name,age,city\nAlice,30,NY\nBob,25,LA",
    es: "name,age,city\nAlice,30,Madrid\nBob,25,Barcelona",
  },
  "json-yaml": {
    zh: JSON.stringify({ name: "Alice", age: 30, skills: ["js", "python"], meta: { active: true, count: 42 } }, null, 2),
    en: JSON.stringify({ name: "Alice", age: 30, skills: ["js", "python"], meta: { active: true, count: 42 } }, null, 2),
    es: JSON.stringify({ name: "Alice", age: 30, skills: ["js", "python"], meta: { active: true, count: 42 } }, null, 2),
  },
  "yaml-json": {
    zh: "name: Alice\nage: 30\nskills:\n  - js\n  - python\nmeta:\n  active: true\n  count: 42",
    en: "name: Alice\nage: 30\nskills:\n  - js\n  - python\nmeta:\n  active: true\n  count: 42",
    es: "name: Alice\nage: 30\nskills:\n  - js\n  - python\nmeta:\n  active: true\n  count: 42",
  },
  "json-xml": {
    zh: JSON.stringify({ name: "Alice", age: 30, active: true, scores: [90, 85], address: { city: "北京", zip: "100000" } }, null, 2),
    en: JSON.stringify({ name: "Alice", age: 30, active: true, scores: [90, 85], address: { city: "NY", zip: "10001" } }, null, 2),
    es: JSON.stringify({ name: "Alice", age: 30, active: true, scores: [90, 85], address: { city: "Madrid", zip: "28001" } }, null, 2),
  },
  "xml-json": {
    zh: `<?xml version="1.0" encoding="UTF-8"?>\n<root><name>Alice</name><age>30</age><active>true</active><scores><item>90</item><item>85</item></scores><address><city>北京</city><zip>100000</zip></address></root>`,
    en: `<?xml version="1.0" encoding="UTF-8"?>\n<root><name>Alice</name><age>30</age><active>true</active><scores><item>90</item><item>85</item></scores><address><city>NY</city><zip>10001</zip></address></root>`,
    es: `<?xml version="1.0" encoding="UTF-8"?>\n<root><name>Alice</name><age>30</age><active>true</active><scores><item>90</item><item>85</item></scores><address><city>Madrid</city><zip>28001</zip></address></root>`,
  },
}

const MODE_META: Record<Mode, { convertKey: string; inputLabel: string; outputLabel: string; placeholderInput: string; placeholderOutput: string }> = {
  "json-csv": { convertKey: "json-csv", inputLabel: "JSON", outputLabel: "CSV", placeholderInput: '请输入 JSON 数组，例如 [{"a":1}]', placeholderOutput: "CSV 结果将显示在这里" },
  "csv-json": { convertKey: "csv-json", inputLabel: "CSV", outputLabel: "JSON", placeholderInput: "请输入 CSV，例如 a,b\\n1,2", placeholderOutput: "JSON 结果将显示在这里" },
  "json-yaml": { convertKey: "json-yaml", inputLabel: "JSON", outputLabel: "YAML", placeholderInput: '请输入 JSON，例如 {"a":1}', placeholderOutput: "YAML 结果将显示在这里" },
  "yaml-json": { convertKey: "yaml-json", inputLabel: "YAML", outputLabel: "JSON", placeholderInput: "请输入 YAML，例如 a: 1", placeholderOutput: "JSON 结果将显示在这里" },
  "json-xml": { convertKey: "json-xml", inputLabel: "JSON", outputLabel: "XML", placeholderInput: '请输入 JSON，例如 {"a":1}', placeholderOutput: "XML 结果将显示在这里" },
  "xml-json": { convertKey: "xml-json", inputLabel: "XML", outputLabel: "JSON", placeholderInput: "请输入 XML，例如 <root><a>1</a></root>", placeholderOutput: "JSON 结果将显示在这里" },
}

const CONVERT_FUNCS: Record<Mode, (s: string) => string> = {
  "json-csv": jsonToCsv,
  "csv-json": csvToJson,
  "json-yaml": jsonToYaml,
  "yaml-json": yamlToJson,
  "json-xml": jsonToXml,
  "xml-json": xmlToJson,
}

export default function DataConvertEditor({ mode, locale = "zh" }: { mode: Mode; locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const dc = dict.dataConvert || {}
  const editorFallback = dict.editor || {}

  const meta = MODE_META[mode]

  const localeConvertLabel =
    mode === "json-csv" ? (locale === "en" ? "JSON → CSV" : locale === "es" ? "JSON → CSV" : "JSON 转 CSV") :
    mode === "csv-json" ? (locale === "en" ? "CSV → JSON" : locale === "es" ? "CSV → JSON" : "CSV 转 JSON") :
    mode === "json-yaml" ? (locale === "en" ? "JSON → YAML" : locale === "es" ? "JSON → YAML" : "JSON 转 YAML") :
    mode === "yaml-json" ? (locale === "en" ? "YAML → JSON" : locale === "es" ? "YAML → JSON" : "YAML 转 JSON") :
    mode === "json-xml" ? (locale === "en" ? "JSON → XML" : locale === "es" ? "JSON → XML" : "JSON 转 XML") :
    (locale === "en" ? "XML → JSON" : locale === "es" ? "XML → JSON" : "XML 转 JSON")

  const msgs = {
    convert: dc.convert || localeConvertLabel,
    sample: dc.sample || editorFallback.sample || "查看示例",
    copy: dc.copy || editorFallback.copy || "复制结果",
    clear: dc.clear || editorFallback.clear || "清空数据",
    copied: dc.copied || editorFallback.copied || "已复制",
    inputLabel: dc.inputLabel ? `${dc.inputLabel} ${meta.inputLabel}` : meta.inputLabel,
    outputLabel: dc.outputLabel ? `${dc.outputLabel} ${meta.outputLabel}` : meta.outputLabel,
    inputPlaceholder: meta.placeholderInput,
    outputPlaceholder: meta.placeholderOutput,
    localNote: dc.localNote || editorFallback.localNote || "所有操作均在浏览器本地完成，不上传数据",
  }

  // Override placeholders if locale specific provided in dict
  if (dc.placeholderInput) msgs.inputPlaceholder = dc.placeholderInput
  // mode-specific placeholder from messages if exists
  const modeKey = mode.replace("-", "")
  if (dc[modeKey]?.inputPlaceholder) msgs.inputPlaceholder = dc[modeKey].inputPlaceholder
  if (dc[modeKey]?.outputPlaceholder) msgs.outputPlaceholder = dc[modeKey].outputPlaceholder
  if (dc[mode]?.inputPlaceholder) msgs.inputPlaceholder = dc[mode].inputPlaceholder

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    if (!input.trim()) {
      setError(locale === "en" ? "Please enter content" : locale === "es" ? "Ingrese contenido" : "请输入内容")
      return
    }
    try {
      const fn = CONVERT_FUNCS[mode]
      const res = fn(input)
      setOutput(res)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSample = () => {
    const s = SAMPLES[mode][locale] || SAMPLES[mode].zh
    setInput(s)
    setOutput("")
    setError(null)
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
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button onClick={handleConvert} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{msgs.convert}</button>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{msgs.sample}</button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{copied ? msgs.copied : msgs.copy}</button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">{msgs.clear}</button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.inputLabel}</div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={msgs.inputPlaceholder} className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none" />
          </div>
          <div className="relative">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {output && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{output.split("\n").length} 行</span>}
            </div>
            <textarea value={output} onChange={e => setOutput(e.target.value)} placeholder={msgs.outputPlaceholder} className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50" />
          </div>
        </div>
        {error && <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-200">{locale === "en" ? "Error: " : locale === "es" ? "Error: " : "校验失败: "}{error}</div>}
        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
