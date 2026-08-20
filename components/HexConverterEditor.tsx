"use client"
import { useState } from "react"
import { convertAll, SUPPORTED_BASES } from "@/lib/hexConverter"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }

const EXPLANATIONS: Record<number, { zh: string; en: string; es: string }> = {
  2: { zh: "二进制是计算机底层表示方式，所有数据最终都以 0 和 1 存储。此值用于位运算、内存操作等低级处理。", en: "Binary is the underlying representation in computers, used for bitwise and low-level operations.", es: "Binario es la representación básica de la computadora." },
  8: { zh: "八进制曾广泛用于 Unix/Linux 权限系统（如 chmod 755），虽然现代使用减少，但仍见于某些遗留系统和嵌入式开发中。", en: "Octal was used in Unix permissions (e.g., chmod 755) and legacy systems.", es: "Octal se usó en permisos Unix y sistemas heredados." },
  10: { zh: "十进制是我们日常使用的数字系统，便于人类阅读和计算，适用于普通用户输入与展示。", en: "Decimal is the everyday number system for human reading and calculation.", es: "Decimal es el sistema cotidiano para lectura humana." },
  16: { zh: "十六进制常用于表示内存地址、颜色值（#FF5733）、哈希码等。它比二进制更紧凑，易于程序员理解和调试。", en: "Hex is used for memory addresses, colors (#FF5733), hashes, more compact than binary.", es: "Hex se usa para direcciones de memoria y colores." },
  32: { zh: "32进制使用字母+数字编码，适合生成短链接、唯一ID等场景，避免混淆字符（如不使用 I、L、O、0 等）。", en: "Base32 is suitable for short links/IDs, avoiding confusing characters.", es: "Base32 es adecuado para ID cortos." },
  36: { zh: "36进制充分利用 0-9 和 A-Z，能将大数压缩成较短字符串，适用于紧凑型 ID 编码、序列号生成等空间敏感场景。", en: "Base36 compresses large numbers into short strings for compact IDs.", es: "Base36 comprime números grandes." },
  52: { zh: "52进制采用大小写字母（A-Z, a-z）构成字符集，不含数字，适合区分类型的标识符生成。", en: "Base52 uses A-Z a-z only, for typed identifiers.", es: "Base52 usa solo letras." },
  58: { zh: "58进制（如 Base58）去除易混淆字符（0、O、I、l），广泛应用于区块链地址（如比特币）。", en: "Base58 removes ambiguous chars (0,O,I,l), used in Bitcoin addresses.", es: "Base58 elimina caracteres ambiguos, usado en Bitcoin." },
  62: { zh: "62进制包含 0-9、A-Z、a-z，最大程度压缩数值为短字符串，非常适合短链接服务。", en: "Base62 compresses to the shortest strings, ideal for URL shorteners.", es: "Base62 comprime al máximo para URLs cortas." },
  64: { zh: "64进制（Base64）用于将二进制数据编码为文本，常见于数据传输（如图片嵌入网页、JWT）。", en: "Base64 encodes binary data as text for transfer (e.g., JWT).", es: "Base64 codifica datos binarios como texto." },
}

const BASE_LABELS: Record<number, string> = { 2: "二进制", 8: "八进制", 10: "十进制", 16: "十六进制", 32: "三十二进制", 36: "三十六进制", 52: "五十二进制", 58: "五十八进制", 62: "六十二进制", 64: "六十四进制" }

export default function HexConverterEditor({ locale = "zh" }: { locale?: string }) {
  const msgs = (messagesMap[locale] || zh).hexConverter || (messagesMap[locale] || zh).editor
  const [fromBase, setFromBase] = useState<number>(10)
  const [input, setInput] = useState("")
  const [results, setResults] = useState<Record<number, string> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = () => {
    try {
      const r = convertAll(input, fromBase)
      setResults(r)
      setError(null)
    } catch (e: any) {
      setError(e.message)
      setResults(null)
    }
  }
  const handleClear = () => { setInput(""); setResults(null); setError(null) }
  const handleCopy = async (v: string) => { await navigator.clipboard.writeText(v) }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="text-sm font-medium mb-3">请选择进制类型、对应的数值：</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SUPPORTED_BASES.slice(0, 6).map(b => (
            <button key={b} onClick={() => setFromBase(b)} className={`px-3 py-1.5 rounded-full text-sm border ${fromBase===b?"bg-blue-600 text-white border-blue-600":"bg-white hover:bg-gray-50"}`}>
              {BASE_LABELS[b] ?? b}
            </button>
          ))}
        </div>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="请输入要转换的数值" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <div className="flex gap-2 mt-3">
          <button onClick={handleConvert} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">进制转换</button>
          <button onClick={handleClear} className="px-5 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">清空数据</button>
        </div>
        {error && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
        <div className="mt-2 text-xs text-gray-400">所有操作均在浏览器本地完成，不上传数据</div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b font-medium text-sm">转换结果：</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr><th className="text-left px-4 py-2 w-16">进制</th><th className="text-left px-4 py-2">结果</th><th className="text-left px-4 py-2 hidden md:table-cell">解释</th></tr>
            </thead>
            <tbody>
              {SUPPORTED_BASES.map(b => (
                <tr key={b} className="border-t">
                  <td className="px-4 py-2 font-mono">{b}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <input readOnly value={results ? results[b] : ""} placeholder="—" className="flex-1 border rounded px-2 py-1 font-mono text-sm bg-gray-50" />
                      <button onClick={()=> results && handleCopy(results[b])} className="px-2 py-1 text-xs border rounded hover:bg-gray-50 shrink-0">复制</button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500 hidden md:table-cell max-w-[320px]">{(EXPLANATIONS[b] as any)?.[locale] || EXPLANATIONS[b]?.zh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
