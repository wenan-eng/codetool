"use client"
import { useEffect, useRef, useState } from "react"

export default function TtsEditor({ locale = "zh" }: { locale?: string }) {
  const [text, setText] = useState("")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceIdx, setVoiceIdx] = useState(0)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : es)

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices() ?? [])
    load()
    window.speechSynthesis?.addEventListener("voiceschanged", load)
    return () => { window.speechSynthesis?.removeEventListener("voiceschanged", load); window.speechSynthesis?.cancel() }
  }, [])

  const speak = () => {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (voices[voiceIdx]) u.voice = voices[voiceIdx]
    u.rate = rate
    u.pitch = pitch
    u.onend = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(u)
  }

  const supported = typeof window !== "undefined" && "speechSynthesis" in window

  return (
    <div className="flex flex-col gap-4">
      {!supported && <div className="text-sm text-red-500">{t("当前浏览器不支持语音合成", "Speech synthesis not supported", "Síntesis de voz no soportada")}</div>}
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t("输入要朗读的文字内容...", "Enter text to read aloud...", "Introduzca el texto a leer...")} className="w-full h-32 p-3 border rounded-xl text-sm" />
      {voices.length > 0 && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">{t("发音人", "Voice", "Voz")}</span>
          <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))} className="p-2.5 border rounded-lg bg-white">
            {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
      )}
      <label className="flex items-center gap-3 text-sm">
        <span className="text-gray-600 w-16">{t("语速", "Rate", "Velocidad")}</span>
        <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="flex-1" />
        <span className="w-10 font-mono text-xs">{rate}x</span>
      </label>
      <label className="flex items-center gap-3 text-sm">
        <span className="text-gray-600 w-16">{t("音调", "Pitch", "Tono")}</span>
        <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} className="flex-1" />
        <span className="w-10 font-mono text-xs">{pitch}</span>
      </label>
      <div className="flex gap-3">
        <button onClick={speak} disabled={!text.trim() || !supported} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">🔊 {speaking ? t("朗读中... (可重复点击覆盖)", "Reading...", "Leyendo...") : t("开始朗读", "Read aloud", "Leer en voz alta")}</button>
        <button onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false) }} className="self-start px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">⏹️ {t("停止", "Stop", "Detener")}</button>
      </div>
      <p className="text-xs text-gray-400">{t("由浏览器内置语音引擎本地合成，文本不上传；受系统已安装语音包限制。", "Synthesized locally by the browser; nothing is uploaded. Depends on installed system voices.", "Sintetizado localmente; nada se sube.")}</p>
    </div>
  )
}
