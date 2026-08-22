"use client"
import { useRef, useState } from "react"

function MediaPickerEditor({ kind, locale }: { kind: "video" | "audio"; locale?: string }) {
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
  const [rate, setRate] = useState(1)
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const loadFile = (file: File) => {
    setUrl(URL.createObjectURL(file))
    setName(file.name)
  }

  const changeRate = (r: number) => {
    setRate(r)
    if (mediaRef.current) mediaRef.current.playbackRate = r
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🎬 {kind === "video" ? t("选择本地视频文件播放（文件不离开设备）", "Pick a local video to play (stays on device)", "Elija un video local") : t("选择本地音频文件播放（文件不离开设备）", "Pick a local audio file to play", "Elija un audio local")}
        <input type="file" accept={kind === "video" ? "video/*" : "audio/*"} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {url && (
        <>
          <div className="bg-black rounded-xl overflow-hidden">
            {kind === "video"
              ? <video ref={mediaRef as any} src={url} controls autoPlay className="w-full max-h-[480px]" />
              : <audio ref={mediaRef as any} src={url} controls autoPlay className="w-full" />}
          </div>
          <div className="text-sm text-gray-500">📁 {name}</div>
          <label className="flex items-center gap-3 text-sm w-64">
            <span className="text-gray-600">{t("倍速", "Speed", "Velocidad")}</span>
            <input type="range" min={0.5} max={3} step={0.25} value={rate} onChange={e => changeRate(Number(e.target.value))} className="flex-1" />
            <span className="font-mono text-xs">{rate}x</span>
          </label>
        </>
      )}
    </div>
  )
}

export function VideoPlayerEditor({ locale = "zh" }: { locale?: string }) {
  return <MediaPickerEditor kind="video" locale={locale} />
}
export function AudioPlayerEditor({ locale = "zh" }: { locale?: string }) {
  return <MediaPickerEditor kind="audio" locale={locale} />
}
