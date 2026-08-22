"use client"
import { useRef, useState } from "react"

export default function VoiceRecorderEditor({ locale = "zh" }: { locale?: string }) {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState("")
  const [error, setError] = useState("")
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const start = async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = e => chunksRef.current.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(tr => tr.stop())
      }
      rec.start()
      recorderRef.current = rec
      setRecording(true)
    } catch {
      setError(t("无法访问麦克风，请检查浏览器权限设置", "Cannot access microphone; check permissions", "No se puede acceder al micrófono"))
    }
  }

  const stop = () => {
    recorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {!recording ? (
        <button onClick={start} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">🎙️ {t("开始录音（需麦克风权限）", "Start recording (mic permission)", "Iniciar grabación")}</button>
      ) : (
        <button onClick={stop} className="self-start px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 animate-pulse">⏹️ {t("停止录音", "Stop recording", "Detener")}</button>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      {audioUrl && (
        <>
          <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
            <div className="text-xs text-gray-400">{t("录音预览", "Preview", "Vista previa")} (WebM)</div>
            <audio src={audioUrl} controls className="w-full" />
          </div>
          <a href={audioUrl} download="recording.webm" className="self-start px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t("下载录音", "Download recording", "Descargar")}</a>
        </>
      )}
      <p className="text-xs text-gray-400">{t("录音全程在本地处理，不上传任何数据；格式为浏览器原生 WebM。", "Recorded locally, never uploaded; native WebM format.", "Grabado localmente; formato WebM nativo.")}</p>
    </div>
  )
}
