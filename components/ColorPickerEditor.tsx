"use client"
import { useRef, useState } from "react"

export default function ColorPickerEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [picked, setPicked] = useState<{ hex: string; rgb: [number, number, number]; x: number; y: number } | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const loadFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setPicked(null)
        setImgUrl(String(reader.result || ""))
        setTimeout(() => {
          const canvas = canvasRef.current
          if (!canvas) return
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          canvas.getContext("2d")?.drawImage(img, 0, 0)
        }, 50)
      }
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  }

  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height)
    const d = canvas.getContext("2d")?.getImageData(x, y, 1, 1).data
    if (!d) return
    const hex = `#${[d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase()
    setPicked({ hex, rgb: [d[0], d[1], d[2]], x, y })
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🎨 {t("上传图片后点击任意位置取色（本地处理）", "Upload an image then click to pick colors (local)", "Suba una imagen y haga clic para tomar colores (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {imgUrl && (
        <>
          <canvas ref={canvasRef} onClick={pick} className={`max-h-96 mx-auto object-contain max-w-full rounded border ${picked ? "cursor-pointer" : "cursor-crosshair"}`} />
          {picked && (
            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg border" style={{ backgroundColor: picked.hex }} />
              <div className="text-sm font-mono flex flex-col gap-1">
                <button onClick={() => navigator.clipboard.writeText(picked.hex)} className="hover:text-blue-600">{picked.hex} ⧉</button>
                <span className="text-gray-500">rgb({picked.rgb.join(", ")})</span>
                <span className="text-xs text-gray-400">@ ({picked.x}, {picked.y})</span>
              </div>
            </div>
          )}
        </>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally.", "Todo local.")}</p>
    </div>
  )
}
