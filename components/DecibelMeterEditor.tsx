"use client"
import { useRef, useState, useEffect } from "react"

export default function DecibelMeterEditor({ locale = "zh" }: { locale?: string }) {
  const [running, setRunning] = useState(false)
  const [db, setDb] = useState(0)
  const [maxDb, setMaxDb] = useState(0)
  const [error, setError] = useState("")
  const rafRef = useRef(0)
  const ctxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const label = db < 30 ? t("安静", "Quiet", "Silencio") : db < 60 ? t("正常交谈", "Normal", "Normal") : db < 85 ? t("嘈杂", "Noisy", "Ruidoso") : t("有害音量!", "Harmful!", "¡Dañino!")

  const stop = () => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(tr => tr.stop())
    ctxRef.current?.close()
    setRunning(false)
  }

  const start = async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      source.connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      const loop = () => {
        analyser.getFloatTimeDomainData(buf)
        let sum = 0
        for (const v of buf) sum += v * v
        const rms = Math.sqrt(sum / buf.length)
        const dB = Math.max(0, Math.min(120, Math.round(20 * Math.log10(rms || 1e-8) + 90)))
        setDb(dB)
        setMaxDb(m => Math.max(m, dB))
        rafRef.current = requestAnimationFrame(loop)
      }
      setRunning(true)
      loop()
    } catch {
      setError(t("无法访问麦克风，请检查浏览器权限设置", "Cannot access microphone; check permissions", "No se puede acceder al micrófono"))
    }
  }

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); streamRef.current?.getTracks().forEach(tr => tr.stop()) }, [])

  return (
    <div className="flex flex-col gap-4">
      {!running ? (
        <button onClick={start} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">🎤 {t("开始测量（需麦克风权限）", "Start measuring (mic permission)", "Iniciar medición")}</button>
      ) : (
        <>
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className={`text-6xl font-bold font-mono ${db > 85 ? "text-red-500" : db > 60 ? "text-yellow-500" : "text-green-600"}`}>{db}</div>
            <div className="text-sm text-gray-500 mt-1">dB SPL · {label}</div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${db > 85 ? "bg-red-500" : db > 60 ? "bg-yellow-400" : "bg-green-500"}`} style={{ width: `${Math.min(100, (db / 120) * 100)}%` }} />
          </div>
          <div className="text-xs text-gray-500">{t("本次峰值", "Peak", "Pico")}: {maxDb} dB</div>
          <button onClick={stop} className="self-start px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">⏹️ {t("停止测量", "Stop", "Detener")}</button>
        </>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <p className="text-xs text-gray-400">{t("数值由浏览器音频接口估算仅供参考，非专业计量；音频数据不离开设备。", "Values are browser estimates for reference only; audio never leaves your device.", "Valores de referencia del navegador; el audio nunca sale del dispositivo.")}</p>
    </div>
  )
}
