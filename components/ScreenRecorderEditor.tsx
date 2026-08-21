"use client"
import { useRef, useState } from "react"

export default function ScreenRecorderEditor({ locale = "zh" }: { locale?: string }) {
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [error, setError] = useState("")
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : es)

  const start = async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      streamRef.current = stream
      const rec = new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = e => chunksRef.current.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        setVideoUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(tr => tr.stop())
      }
      rec.start()
      recorderRef.current = rec
      setRecording(true)
      stream.getVideoTracks()[0].addEventListener("ended", () => { if (recorderRef.current?.state === "recording") { recorderRef.current.stop(); setRecording(false) } })
    } catch {
      setError(t("屏幕共享被取消或浏览器不支持", "Screen sharing cancelled or unsupported", "Compartir pantalla cancelado"))
    }
  }

  const stop = () => {
    recorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {!recording ? (
        <button onClick={start} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">🖥️ {t("开始录屏（选择要分享的窗口）", "Start screen recording", "Iniciar grabación de pantalla")}</button>
      ) : (
        <button onClick={stop} className="self-start px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 animate-pulse">⏹️ {t("停止录制", "Stop recording", "Detener")}</button>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      {videoUrl && (
        <>
          <div className="bg-black rounded-xl overflow-hidden"><video src={videoUrl} controls className="w-full max-h-[420px]" /></div>
          <a href={videoUrl} download="screen-recording.webm" className="self-start px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t("下载 WebM 录像", "Download WebM", "Descargar WebM")}</a>
        </>
      )}
      <p className="text-xs text-gray-400">{t("录制内容仅在本地处理与保存，不上传任何数据；格式为浏览器原生 WebM。", "Recorded and saved locally only; native WebM format.", "Grabado y guardado localmente; formato WebM nativo.")}</p>
    </div>
  )
}
