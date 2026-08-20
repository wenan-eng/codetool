"use client"
import { useState } from "react"
import {
  jsonToSql,
  sqlToJson,
  jsonToCookie,
  cookieToJson,
  jsonToBase64,
  base64ToJson,
  xmlToBase64,
  base64ToXml,
  jsonToExcel,
  excelToJson,
} from "@/lib/dataConvert2"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

type ToolId =
  | "json-sql"
  | "sql-json"
  | "json-cookie"
  | "cookie-json"
  | "json-base64"
  | "xml-base64"
  | "json-excel"
  | "excel-json"

const SAMPLES: Record<string, Record<string, string>> = {
  "json-sql": {
    zh: JSON.stringify([{ id: 1, name: "Alice", age: 30 }, { id: 2, name: "Bob", age: 25 }], null, 2),
    en: JSON.stringify([{ id: 1, name: "Alice", age: 30 }, { id: 2, name: "Bob", age: 25 }], null, 2),
    es: JSON.stringify([{ id: 1, name: "Alice", age: 30 }, { id: 2, name: "Bob", age: 25 }], null, 2),
  },
  "sql-json": {
    zh: "INSERT INTO `users` (`id`, `name`, `age`) VALUES (1, 'Alice', 30), (2, 'Bob', 25);",
    en: "INSERT INTO `users` (`id`, `name`, `age`) VALUES (1, 'Alice', 30), (2, 'Bob', 25);",
    es: "INSERT INTO `users` (`id`, `name`, `age`) VALUES (1, 'Alice', 30), (2, 'Bob', 25);",
  },
  "json-cookie": {
    zh: JSON.stringify({ sessionId: "abc123", theme: "dark", lang: "zh-CN" }, null, 2),
    en: JSON.stringify({ sessionId: "abc123", theme: "dark", lang: "en" }, null, 2),
    es: JSON.stringify({ sessionId: "abc123", theme: "oscuro", lang: "es" }, null, 2),
  },
  "cookie-json": {
    zh: "sessionId=abc123; theme=dark; lang=zh-CN",
    en: "sessionId=abc123; theme=dark; lang=en",
    es: "sessionId=abc123; theme=oscuro; lang=es",
  },
  "json-base64": {
    zh: JSON.stringify({ name: "张三", city: "北京", hello: "world" }, null, 2),
    en: JSON.stringify({ name: "Alice", city: "New York", hello: "world" }, null, 2),
    es: JSON.stringify({ name: "Alicia", city: "Madrid", hello: "mundo" }, null, 2),
  },
  "xml-base64": {
    zh: `<root>\n  <name>张三</name>\n  <city>北京</city>\n</root>`,
    en: `<root>\n  <name>Alice</name>\n  <city>New York</city>\n</root>`,
    es: `<root>\n  <name>Alicia</name>\n  <city>Madrid</city>\n</root>`,
  },
  "json-excel": {
    zh: JSON.stringify([{ name: "Alice", age: 30, city: "北京" }, { name: "Bob", age: 25, city: "上海" }], null, 2),
    en: JSON.stringify([{ name: "Alice", age: 30, city: "New York" }, { name: "Bob", age: 25, city: "London" }], null, 2),
    es: JSON.stringify([{ name: "Alicia", age: 30, city: "Madrid" }, { name: "Bob", age: 25, city: "Barcelona" }], null, 2),
  },
  "excel-json": {
    zh: "name,age,city\nAlice,30,北京\nBob,25,上海",
    en: "name,age,city\nAlice,30,New York\nBob,25,London",
    es: "name,age,city\nAlicia,30,Madrid\nBob,25,Barcelona",
  },
}

function getToolMessages(locale: string, toolId: string) {
  const dict = (messagesMap[locale] || zh) as any
  const generic = dict.dataConvert2 || {}
  // per-tool specific keys like jsonSql, sqlJson etc, fallback to generic
  const camelKey = toolId.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()) // json-sql -> jsonSql
  const specific = dict[camelKey] || {}
  const isEn = locale === "en"
  const isEs = locale === "es"
  const fallbackMap: Record<string, any> = {
    "json-sql": {
      convert: isEn ? "JSON → SQL" : isEs ? "JSON → SQL" : "JSON转SQL",
      reverse: isEn ? "SQL → JSON" : isEs ? "SQL → JSON" : "SQL转JSON",
      inputLabel: isEn ? "JSON Array" : isEs ? "Arreglo JSON" : "JSON 数组",
      outputLabel: isEn ? "SQL" : isEs ? "SQL" : "SQL 语句",
      placeholderInput: isEn ? 'Paste JSON array, e.g. [{"a":1,"b":2}]' : isEs ? 'Pegue arreglo JSON, ej. [{"a":1,"b":2}]' : '请输入 JSON 数组，如 [{"a":1,"b":2}]',
      placeholderOutput: isEn ? "SQL will appear here" : isEs ? "SQL aparecerá aquí" : "SQL 结果将显示在这里",
    },
    "sql-json": {
      convert: isEn ? "SQL → JSON" : isEs ? "SQL → JSON" : "SQL转JSON",
      reverse: isEn ? "JSON → SQL" : isEs ? "JSON → SQL" : "JSON转SQL",
      inputLabel: isEn ? "SQL INSERT" : isEs ? "SQL INSERT" : "SQL 语句",
      outputLabel: isEn ? "JSON" : isEs ? "JSON" : "JSON 结果",
      placeholderInput: isEn ? "Paste INSERT INTO ... VALUES ..." : isEs ? "Pegue INSERT INTO ... VALUES ..." : "请输入 INSERT 语句，如 INSERT INTO users (a,b) VALUES (1,2)",
      placeholderOutput: isEn ? "JSON will appear here" : isEs ? "JSON aparecerá aquí" : "JSON 结果将显示在这里",
    },
    "json-cookie": {
      convert: isEn ? "JSON → Cookie" : isEs ? "JSON → Cookie" : "JSON转Cookie",
      reverse: isEn ? "Cookie → JSON" : isEs ? "Cookie → JSON" : "Cookie转JSON",
      inputLabel: isEn ? "JSON Object" : isEs ? "Objeto JSON" : "JSON 对象",
      outputLabel: isEn ? "Cookie String" : isEs ? "Cookie" : "Cookie 字符串",
      placeholderInput: isEn ? 'Paste JSON object, e.g. {"a":"1","b":"2"}' : isEs ? 'Pegue objeto JSON, ej. {"a":"1","b":"2"}' : '请输入 JSON 对象，如 {"a":"1","b":"2"}',
      placeholderOutput: isEn ? "Cookie string will appear here" : isEs ? "Cookie aparecerá aquí" : "Cookie 结果将显示在这里",
    },
    "cookie-json": {
      convert: isEn ? "Cookie → JSON" : isEs ? "Cookie → JSON" : "Cookie转JSON",
      reverse: isEn ? "JSON → Cookie" : isEs ? "JSON → Cookie" : "JSON转Cookie",
      inputLabel: isEn ? "Cookie String" : isEs ? "Cookie" : "Cookie 字符串",
      outputLabel: isEn ? "JSON Object" : isEs ? "Objeto JSON" : "JSON 对象",
      placeholderInput: isEn ? "Paste cookie, e.g. a=1; b=2" : isEs ? "Pegue cookie, ej. a=1; b=2" : "请输入 Cookie，如 a=1; b=2",
      placeholderOutput: isEn ? "JSON will appear here" : isEs ? "JSON aparecerá aquí" : "JSON 结果将显示在这里",
    },
    "json-base64": {
      convert: isEn ? "JSON → Base64" : isEs ? "JSON → Base64" : "JSON转Base64",
      reverse: isEn ? "Base64 → JSON" : isEs ? "Base64 → JSON" : "Base64转JSON",
      inputLabel: isEn ? "JSON" : isEs ? "JSON" : "JSON",
      outputLabel: isEn ? "Base64" : isEs ? "Base64" : "Base64",
      placeholderInput: isEn ? "Paste JSON to encode" : isEs ? "Pegue JSON para codificar" : "请输入要编码的 JSON",
      placeholderOutput: isEn ? "Base64 will appear here" : isEs ? "Base64 aparecerá aquí" : "Base64 结果将显示在这里",
    },
    "xml-base64": {
      convert: isEn ? "XML → Base64" : isEs ? "XML → Base64" : "XML转Base64",
      reverse: isEn ? "Base64 → XML" : isEs ? "Base64 → XML" : "Base64转XML",
      inputLabel: isEn ? "XML" : isEs ? "XML" : "XML",
      outputLabel: isEn ? "Base64" : isEs ? "Base64" : "Base64",
      placeholderInput: isEn ? "Paste XML to encode" : isEs ? "Pegue XML para codificar" : "请输入要编码的 XML",
      placeholderOutput: isEn ? "Base64 will appear here" : isEs ? "Base64 aparecerá aquí" : "Base64 结果将显示在这里",
    },
    "json-excel": {
      convert: isEn ? "JSON → Excel (CSV)" : isEs ? "JSON → Excel (CSV)" : "JSON转Excel",
      reverse: isEn ? "Excel → JSON" : isEs ? "Excel → JSON" : "Excel转JSON",
      inputLabel: isEn ? "JSON Array" : isEs ? "Arreglo JSON" : "JSON 数组",
      outputLabel: isEn ? "CSV / Excel" : isEs ? "CSV / Excel" : "CSV 表格",
      placeholderInput: isEn ? 'Paste JSON array, e.g. [{"name":"Alice","age":30}]' : isEs ? 'Pegue arreglo JSON' : '请输入 JSON 数组，如 [{"name":"Alice","age":30}]',
      placeholderOutput: isEn ? "CSV will appear here" : isEs ? "CSV aparecerá aquí" : "CSV 结果将显示在这里",
    },
    "excel-json": {
      convert: isEn ? "Excel → JSON" : isEs ? "Excel → JSON" : "Excel转JSON",
      reverse: isEn ? "JSON → Excel" : isEs ? "JSON → Excel" : "JSON转Excel",
      inputLabel: isEn ? "CSV / Excel" : isEs ? "CSV / Excel" : "CSV 表格",
      outputLabel: isEn ? "JSON Array" : isEs ? "Arreglo JSON" : "JSON 数组",
      placeholderInput: isEn ? "Paste CSV, e.g. name,age\nAlice,30" : isEs ? "Pegue CSV, ej. name,age\nAlicia,30" : "请输入 CSV，如 name,age\\nAlice,30",
      placeholderOutput: isEn ? "JSON will appear here" : isEs ? "JSON aparecerá aquí" : "JSON 结果将显示在这里",
    },
  }
  const fb = fallbackMap[toolId] || fallbackMap["json-sql"]
  return {
    convert: specific.convert || generic.convert || fb.convert,
    reverse: specific.reverse || generic.reverse || fb.reverse,
    sample: specific.sample || generic.sample || (isEn ? "Load Sample" : isEs ? "Ver Ejemplo" : "查看示例"),
    copy: specific.copy || generic.copy || (isEn ? "Copy Result" : isEs ? "Copiar Resultado" : "复制结果"),
    clear: specific.clear || generic.clear || (isEn ? "Clear" : isEs ? "Limpiar" : "清空数据"),
    copied: specific.copied || generic.copied || (isEn ? "Copied" : isEs ? "Copiado" : "已复制"),
    inputLabel: specific.inputLabel || generic.inputLabel || fb.inputLabel,
    outputLabel: specific.outputLabel || generic.outputLabel || fb.outputLabel,
    placeholderInput: specific.placeholderInput || generic.placeholderInput || fb.placeholderInput,
    placeholderOutput: specific.placeholderOutput || generic.placeholderOutput || fb.placeholderOutput,
    localNote: specific.localNote || generic.localNote || (isEn ? "All processing is done locally, no upload" : isEs ? "Todo se procesa localmente, sin subida" : "所有操作均在浏览器本地完成，不上传数据"),
    tableNameLabel: isEn ? "Table Name" : isEs ? "Nombre de tabla" : "表名",
    tablePlaceholder: isEn ? "e.g. users" : isEs ? "ej. usuarios" : "如 users",
  }
}

export default function DataConvert2Editor({ locale = "zh", toolId = "json-sql" }: { locale?: string; toolId?: string }) {
  const effectiveToolId = (toolId as ToolId) || "json-sql"
  const msgs = getToolMessages(locale, effectiveToolId)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [tableName, setTableName] = useState("users")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    if (!input.trim()) {
      setError(locale === "en" ? "Please enter content" : locale === "es" ? "Ingrese contenido" : "请输入内容")
      return
    }
    try {
      let result = ""
      switch (effectiveToolId) {
        case "json-sql":
          result = jsonToSql(input, tableName || "table_name")
          break
        case "sql-json":
          result = sqlToJson(input)
          break
        case "json-cookie":
          result = jsonToCookie(input)
          break
        case "cookie-json":
          result = cookieToJson(input)
          break
        case "json-base64":
          result = jsonToBase64(input)
          break
        case "xml-base64":
          result = xmlToBase64(input)
          break
        case "json-excel":
          result = jsonToExcel(input)
          break
        case "excel-json":
          result = excelToJson(input)
          break
        default:
          result = input
      }
      setOutput(result)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleReverse = () => {
    // reverse conversion for convenience: use input as if it's output type
    if (!input.trim()) {
      setError(locale === "en" ? "Please enter content" : locale === "es" ? "Ingrese contenido" : "请输入内容")
      return
    }
    try {
      let result = ""
      switch (effectiveToolId) {
        case "json-sql":
          result = sqlToJson(input)
          break
        case "sql-json":
          result = jsonToSql(input, tableName || "table_name")
          break
        case "json-cookie":
          result = cookieToJson(input)
          break
        case "cookie-json":
          result = jsonToCookie(input)
          break
        case "json-base64":
          result = base64ToJson(input)
          break
        case "xml-base64":
          result = base64ToXml(input)
          break
        case "json-excel":
          result = excelToJson(input)
          break
        case "excel-json":
          result = jsonToExcel(input)
          break
        default:
          result = input
      }
      setOutput(result)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSwap = () => {
    if (output) {
      setInput(output)
      setOutput(input)
      setError(null)
    }
  }

  const handleSample = () => {
    const samples = SAMPLES[effectiveToolId] || SAMPLES["json-sql"]
    const s = samples[locale] || samples.zh || samples.en
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

  const showTableInput = effectiveToolId === "json-sql" || effectiveToolId === "sql-json"

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50 items-center">
          <button onClick={handleConvert} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {msgs.convert}
          </button>
          <button onClick={handleReverse} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
            {msgs.reverse}
          </button>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {msgs.sample}
          </button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {copied ? msgs.copied : msgs.copy}
          </button>
          <button onClick={handleSwap} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600" title="Swap">
            ⇄
          </button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">
            {msgs.clear}
          </button>
          {showTableInput && effectiveToolId === "json-sql" && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">{msgs.tableNameLabel}:</span>
              <input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder={msgs.tablePlaceholder}
                className="px-2 py-1.5 border rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.inputLabel}</div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={msgs.placeholderInput}
              className="w-full h-[340px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
          <div className="relative flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.outputLabel}</span>
              {output && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {output.length} 字符
                </span>
              )}
            </div>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={msgs.placeholderOutput}
              className="w-full h-[340px] p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50/50"
            />
          </div>
        </div>

        {error && <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-200">{error}</div>}
        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
