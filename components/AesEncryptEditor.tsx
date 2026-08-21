"use client"
import { useState } from "react"
import {
  aesEncrypt,
  aesDecrypt,
  generateRandomIv,
  type AesMode,
} from "@/lib/aesCipher"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const SAMPLES: Record<string, { plaintext: string; key: string }> = {
  zh: { plaintext: "你好，这是一段需要加密的机密信息。", key: "1234567890abcdef" },
  en: { plaintext: "Hello, this is a secret message to encrypt.", key: "1234567890abcdef" },
  es: { plaintext: "Hola, este es un mensaje secreto para cifrar.", key: "1234567890abcdef" },
}

const DEFAULT_TEXTS: Record<string, Record<string, string>> = {
  zh: {
    encryptTitle: "加密",
    decryptTitle: "解密",
    keyLabel: "密钥",
    keyPlaceholder: "请输入16/24/32字符的密钥",
    modeLabel: "模式",
    modeCbc: "CBC模式（推荐）",
    modeCtr: "CTR模式",
    modeGcm: "GCM模式",
    ivLabel: "初始化向量（IV）",
    ivPlaceholder: "初始化向量（IV/Nonce），留空则自动生成随机IV",
    randomIv: "生成随机IV",
    encryptAction: "生成密文",
    decryptAction: "解密",
    plainInputPlaceholder: "请输入需要AES加密的明文信息",
    cipherInputPlaceholder: "请输入需要AES解密的密文信息",
    cipherOutputLabel: "密文结果（Base64）",
    plainOutputLabel: "明文结果",
    sample: "查看示例",
    copy: "复制",
    clear: "清空数据",
    copied: "已复制",
    localNote: "所有操作均在浏览器本地完成，不上传数据",
  },
  en: {
    encryptTitle: "Encrypt",
    decryptTitle: "Decrypt",
    keyLabel: "Key",
    keyPlaceholder: "Enter a 16/24/32 character key",
    modeLabel: "Mode",
    modeCbc: "CBC Mode (Recommended)",
    modeCtr: "CTR Mode",
    modeGcm: "GCM Mode",
    ivLabel: "Initialization Vector (IV)",
    ivPlaceholder: "IV/Nonce, leave empty to auto-generate a random IV",
    randomIv: "Random IV",
    encryptAction: "Encrypt",
    decryptAction: "Decrypt",
    plainInputPlaceholder: "Enter the plaintext to encrypt with AES...",
    cipherInputPlaceholder: "Enter the ciphertext to decrypt with AES...",
    cipherOutputLabel: "Ciphertext Result (Base64)",
    plainOutputLabel: "Plaintext Result",
    sample: "Sample",
    copy: "Copy",
    clear: "Clear",
    copied: "Copied",
    localNote: "All operations are completed locally in your browser, no data is uploaded",
  },
  es: {
    encryptTitle: "Cifrar",
    decryptTitle: "Descifrar",
    keyLabel: "Clave",
    keyPlaceholder: "Introduzca una clave de 16/24/32 caracteres",
    modeLabel: "Modo",
    modeCbc: "Modo CBC (Recomendado)",
    modeCtr: "Modo CTR",
    modeGcm: "Modo GCM",
    ivLabel: "Vector de Inicialización (IV)",
    ivPlaceholder: "IV/Nonce, déjelo vacío para generar un IV aleatorio",
    randomIv: "IV aleatorio",
    encryptAction: "Cifrar",
    decryptAction: "Descifrar",
    plainInputPlaceholder: "Introduzca el texto plano a cifrar con AES...",
    cipherInputPlaceholder: "Introduzca el texto cifrado a descifrar con AES...",
    cipherOutputLabel: "Resultado Cifrado (Base64)",
    plainOutputLabel: "Resultado en Texto Plano",
    sample: "Ejemplo",
    copy: "Copiar",
    clear: "Limpiar",
    copied: "Copiado",
    localNote: "Todas las operaciones se completan localmente en su navegador, no se suben datos",
  },
}

export default function AesEncryptEditor({ locale = "zh" }: { locale?: string }) {
  const raw = (messagesMap[locale] || zh)?.aesEncrypt || {}
  const editorFallback = (messagesMap[locale] || zh)?.editor
  const d = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.zh
  const msgs = {
    encryptTitle: raw.encryptTitle || d.encryptTitle,
    decryptTitle: raw.decryptTitle || d.decryptTitle,
    keyLabel: raw.keyLabel || d.keyLabel,
    keyPlaceholder: raw.keyPlaceholder || d.keyPlaceholder,
    modeLabel: raw.modeLabel || d.modeLabel,
    modeCbc: raw.modeCbc || d.modeCbc,
    modeCtr: raw.modeCtr || d.modeCtr,
    modeGcm: raw.modeGcm || d.modeGcm,
    ivLabel: raw.ivLabel || d.ivLabel,
    ivPlaceholder: raw.ivPlaceholder || d.ivPlaceholder,
    randomIv: raw.randomIv || d.randomIv,
    encryptAction: raw.encryptAction || d.encryptAction,
    decryptAction: raw.decryptAction || d.decryptAction,
    plainInputPlaceholder: raw.plainInputPlaceholder || d.plainInputPlaceholder,
    cipherInputPlaceholder: raw.cipherInputPlaceholder || d.cipherInputPlaceholder,
    cipherOutputLabel: raw.cipherOutputLabel || d.cipherOutputLabel,
    plainOutputLabel: raw.plainOutputLabel || d.plainOutputLabel,
    sample: raw.sample || editorFallback?.sample || d.sample,
    copy: raw.copy || editorFallback?.copy || d.copy,
    clear: raw.clear || editorFallback?.clear || d.clear,
    copied: raw.copied || editorFallback?.copied || d.copied,
    localNote: raw.localNote || editorFallback?.localNote || d.localNote,
  }

  const [plaintext, setPlaintext] = useState("")
  const [cipherInput, setCipherInput] = useState("")
  const [key, setKey] = useState("")
  const [mode, setMode] = useState<AesMode>("CBC")
  const [iv, setIv] = useState("")
  const [cipherOutput, setCipherOutput] = useState("")
  const [plainOutput, setPlainOutput] = useState("")
  const [encryptError, setEncryptError] = useState("")
  const [decryptError, setDecryptError] = useState("")
  const [copiedKey, setCopiedKey] = useState("")

  const handleRandomIv = async () => {
    try {
      const randomIv = await generateRandomIv(mode)
      setIv(randomIv)
    } catch (e) {
      setEncryptError(e instanceof Error ? e.message : String(e))
    }
  }
  const handleEncrypt = async () => {
    try {
      const result = await aesEncrypt(plaintext, key, mode, iv.trim() ? iv : undefined)
      setCipherOutput(result.cipher)
      setIv(result.iv)
      setEncryptError("")
    } catch (e) {
      setCipherOutput("")
      setEncryptError(e instanceof Error ? e.message : String(e))
    }
  }
  const handleDecrypt = async () => {
    try {
      const result = await aesDecrypt(cipherInput, key, mode, iv)
      setPlainOutput(result)
      setDecryptError("")
    } catch (e) {
      setPlainOutput("")
      setDecryptError(e instanceof Error ? e.message : String(e))
    }
  }
  const handleSample = () => {
    const s = SAMPLES[locale] || SAMPLES.zh
    setPlaintext(s.plaintext)
    setKey(s.key)
    setCipherInput("")
    setIv("")
    setCipherOutput("")
    setPlainOutput("")
    setEncryptError("")
    setDecryptError("")
  }
  const handleCopy = async (copyKey: string, value: string) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopiedKey(copyKey)
    setTimeout(() => setCopiedKey(""), 1500)
  }
  const handleClear = () => {
    setPlaintext("")
    setCipherInput("")
    setKey("")
    setIv("")
    setCipherOutput("")
    setPlainOutput("")
    setEncryptError("")
    setDecryptError("")
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button
            onClick={handleSample}
            className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          >
            {msgs.sample}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm text-gray-600 hover:text-red-600"
          >
            {msgs.clear}
          </button>
        </div>

        <div className="p-4 grid md:grid-cols-3 gap-4 border-b">
          <div>
            <div className="text-xs text-gray-500 mb-1">{msgs.keyLabel}</div>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={msgs.keyPlaceholder}
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{msgs.modeLabel}</div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as AesMode)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="CBC">{msgs.modeCbc}</option>
              <option value="CTR">{msgs.modeCtr}</option>
              <option value="GCM">{msgs.modeGcm}</option>
            </select>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{msgs.ivLabel}</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                placeholder={msgs.ivPlaceholder}
                className="flex-1 min-w-0 border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
              <button
                onClick={handleRandomIv}
                className="shrink-0 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
              >
                {msgs.randomIv}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="border-r">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
              {msgs.encryptTitle}
            </div>
            <div className="p-3 space-y-3">
              <textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder={msgs.plainInputPlaceholder}
                className="w-full h-[160px] p-3 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleEncrypt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                {msgs.encryptAction}
              </button>
              {encryptError && (
                <div className="text-sm text-red-600">{encryptError}</div>
              )}
              {cipherOutput && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{msgs.cipherOutputLabel}</span>
                    <button
                      onClick={() => handleCopy("cipher", cipherOutput)}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                    >
                      {copiedKey === "cipher" ? msgs.copied : msgs.copy}
                    </button>
                  </div>
                  <textarea
                    value={cipherOutput}
                    readOnly
                    className="w-full h-[120px] p-3 font-mono text-sm border rounded-lg resize-none bg-gray-50/50 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
              {msgs.decryptTitle}
            </div>
            <div className="p-3 space-y-3">
              <textarea
                value={cipherInput}
                onChange={(e) => setCipherInput(e.target.value)}
                placeholder={msgs.cipherInputPlaceholder}
                className="w-full h-[160px] p-3 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleDecrypt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                {msgs.decryptAction}
              </button>
              {decryptError && (
                <div className="text-sm text-red-600">{decryptError}</div>
              )}
              {plainOutput && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{msgs.plainOutputLabel}</span>
                    <button
                      onClick={() => handleCopy("plain", plainOutput)}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                    >
                      {copiedKey === "plain" ? msgs.copied : msgs.copy}
                    </button>
                  </div>
                  <textarea
                    value={plainOutput}
                    readOnly
                    className="w-full h-[120px] p-3 font-mono text-sm border rounded-lg resize-none bg-gray-50/50 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
