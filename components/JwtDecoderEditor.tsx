"use client"
import { useState } from "react"
import { decodeJwt, base64UrlEncode, type JwtDecoded } from "@/lib/jwtDecoder"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLE_TOKEN = [
  base64UrlEncode({ alg: "HS256", typ: "JWT" }),
  base64UrlEncode({ sub: "1234567890", name: "张三", admin: true, iat: 1704067200, exp: 1735689600 }),
  "sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
].join(".")

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    decode: "JWT解码",
    inputPlaceholder: "请输入 JWT 令牌，直接粘贴即可",
    headerLabel: "JWT头部",
    payloadLabel: "JWT载荷",
    signatureLabel: "签名（不验证）",
    timesLabel: "时间信息",
    errorPrefix: "解码失败",
    sample: "查看示例",
    copy: "复制结果",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据，不验证签名",
  },
  en: {
    decode: "Decode JWT",
    inputPlaceholder: "Paste your JWT token here",
    headerLabel: "JWT Header",
    payloadLabel: "JWT Payload",
    signatureLabel: "Signature (not verified)",
    timesLabel: "Time Claims",
    errorPrefix: "Decode failed",
    sample: "Sample",
    copy: "Copy Result",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded, signatures are not verified",
  },
  es: {
    decode: "Decodificar JWT",
    inputPlaceholder: "Pegue su token JWT aquí",
    headerLabel: "Cabecera JWT",
    payloadLabel: "Carga útil JWT",
    signatureLabel: "Firma (no verificada)",
    timesLabel: "Información de tiempo",
    errorPrefix: "Error al decodificar",
    sample: "Ejemplo",
    copy: "Copiar Resultado",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos, no se verifica la firma",
  },
}

export default function JwtDecoderEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.jwtDecoder || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    decode: raw.decode || d.decode,
    inputPlaceholder: raw.inputPlaceholder || d.inputPlaceholder,
    headerLabel: raw.headerLabel || d.headerLabel,
    payloadLabel: raw.payloadLabel || d.payloadLabel,
    signatureLabel: raw.signatureLabel || d.signatureLabel,
    timesLabel: raw.timesLabel || d.timesLabel,
    errorPrefix: raw.errorPrefix || d.errorPrefix,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [input, setInput] = useState("")
  const [result, setResult] = useState<JwtDecoded | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleDecode = () => {
    try {
      setResult(decodeJwt(input))
      setError("")
    } catch (e) {
      setResult(null)
      setError(`${msgs.errorPrefix}: ${(e as Error).message}`)
    }
  }
  const handleSample = () => {
    setInput(SAMPLE_TOKEN)
    setResult(null)
    setError("")
  }
  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`${result.headerJson}\n\n${result.payloadJson}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const handleClear = () => {
    setInput("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleDecode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
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

        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">输入</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={msgs.inputPlaceholder}
          className="w-full h-[140px] p-4 font-mono text-sm resize-none focus:outline-none border-b"
        />

        {error && (
          <div className="mx-3 my-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
        )}

        {result && (
          <div className="grid md:grid-cols-2 gap-0">
            <div className="border-r">
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.headerLabel}</div>
              <pre className="p-4 font-mono text-xs whitespace-pre-wrap break-all bg-gray-50/50 min-h-[200px]">
                {result.headerJson}
              </pre>
            </div>
            <div>
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">{msgs.payloadLabel}</div>
              <pre className="p-4 font-mono text-xs whitespace-pre-wrap break-all bg-gray-50/50 min-h-[200px]">
                {result.payloadJson}
              </pre>
            </div>
            <div className="md:col-span-2 border-t px-4 py-2 text-xs text-gray-500 space-y-1">
              <div>
                <span className="text-gray-400">{msgs.signatureLabel}: </span>
                <span className="font-mono break-all">{result.signature || "-"}</span>
              </div>
              {result.times.length > 0 && (
                <div>
                  <span className="text-gray-400">{msgs.timesLabel}: </span>
                  {result.times.map((t) => (
                    <span key={t.label} className="mr-3">
                      {t.label} {t.iso}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
