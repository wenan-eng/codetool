"use client"
import { useRef, useState } from "react"

export default function NineGridEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [tiles, setTiles] = useState<string[]>([])
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const loadFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => { imgRef.current = img; setImgUrl(String(reader.result || "")) }
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  }

  const generate = () => {
    const img = imgRef.current
    if (!img) return
    const size = Math.min(img.naturalWidth, img.naturalHeight)
    const sx = (img.naturalWidth - size) / 2
    const sy = (img.naturalHeight - size) / 2
    const urls: string[] = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const canvas = document.createElement("canvas")
        canvas.width = size / 3
        canvas.height = size / 3
        canvas.getContext("2d")?.drawImage(img, sx + (col * size) / 3, sy + (row * size) / 3, size / 3, size / 3, 0, 0, canvas.width, canvas.height)
        urls.push(canvas.toDataURL("image/png"))
      }
    }
    setTiles(urls)
  }

  const downloadAll = () => {
    tiles.forEach((url, i) => setTimeout(() => {
      const a = document.createElement("a")
      a.href = url
      a.download = `grid-${i + 1}.png`
      a.click()
    }, i * 200))
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        #️⃣ {t("上传正方形效果最佳的图片，自动居中裁切九宫格（本地处理）", "Upload an image (square works best) to slice into 9 pieces", "Suba una imagen para dividir en 9 piezas")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {imgUrl && (
        <>
          <button onClick={generate} className="self-start px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">#️⃣ {t("生成九宫格", "Generate Grid", "Generar cuadrícula")}</button>
          <div className="bg-white border rounded-xl p-2"><img src={imgUrl} alt="" className="max-h-48 mx-auto object-contain" /></div>
        </>
      )}
      {tiles.length === 9 && (
        <>
          <div className="inline-grid grid-cols-3 gap-1 self-center bg-white border rounded-xl p-1">
            {tiles.map((url, i) => <img key={i} src={url} alt="" className="w-24 h-24 object-cover" />)}
          </div>
          <div className="flex gap-3 self-center flex-wrap justify-center">
            {tiles.map((url, i) => (
              <a key={i} href={url} download={`nine-grid-${i + 1}.png`} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">{t("下载", "Download", "Descargar")} #{i + 1}</a>
            ))}
            <button onClick={downloadAll} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">⬇️ {t("依次下载全部", "Download All", "Descargar todo")}</button>
          </div>
          <p className="text-xs text-gray-400 text-center">{t("按顺序发布到朋友圈/微博即可拼出九宫格效果", "Post them in order to compose the grid on social media.", "Publíquelas en orden para componer la cuadrícula.")}</p>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
