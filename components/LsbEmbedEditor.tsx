"use client"
import { useRef, useState } from "react"
import { embedLsb, lsbCapacity } from "@/lib/lsbCodec"

export default function LsbEmbedEditor({ locale = "zh" }: { locale?: string }) {
  const [imgUrl, setImgUrl] = useState("")
  const [capacity, setCapacity] = useState(0)
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const handleFile = (file: File) => {
    setError("")
    setDone(false)
    if (!file.type.startsWith("image/")) { setError(t("请选择图片文件", "Please select an image file", "Seleccione una imagen")); return }
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result || "")
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setImgUrl(url)
        setCapacity(lsbCapacity(new Uint8Array(data.data)))
      }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  const generate = () => {
    setError("")
    setDone(false)
    if (!imgUrl) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      try {
        const stego = embedLsb(new Uint8Array(imageData.data), text)
        ctx.putImageData(new ImageData(new Uint8ClampedArray(stego), canvas.width, canvas.height), 0, 0)
        const a = document.createElement("a")
        a.href = canvas.toDataURL("image/png")
        a.download = "stego.png"
        a.click()
        setDone(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    }
    img.src = imgUrl
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500"
      >
        🖼️ {t("点击上传或拖拽图片文件（支持 PNG、JPG、GIF、WebP、BMP 等格式）", "Click or drag an image (PNG, JPG, GIF, WebP, BMP...)", "Haga clic o arrastre una imagen (PNG, JPG, GIF, WebP, BMP...)")}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {imgUrl && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded-xl p-4"><img src={imgUrl} alt="" className="max-h-48 object-contain rounded" /></div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={t(`请输入要隐藏在图片中的文字，当前图片可以隐藏${Math.max(capacity, 0)}个文字`, `Text to hide; this image can hold ${Math.max(capacity, 0)} characters`, `Texto a ocultar; esta imagen admite ${Math.max(capacity, 0)} caracteres`)}
            className="w-full h-28 p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
          {done && <div className="text-sm text-green-600">{t("隐写图片已生成并开始下载（PNG 无损保存）", "Stego image generated and downloading (lossless PNG)", "Imagen estego generada y descargando (PNG sin pérdida)")}</div>}
          <div className="flex gap-3">
            <button onClick={generate} disabled={!text.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">⬇️ {t("下载隐写图片", "Download Stego Image", "Descargar imagen estego")}</button>
            <button onClick={() => { setImgUrl(""); setText(""); setCapacity(0); setDone(false); setError("") }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("清空数据", "Clear", "Limpiar")}</button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{t("所有操作均在浏览器本地完成，不上传数据", "All processing is done locally in your browser. No data is uploaded.", "Todo el procesamiento se realiza localmente en su navegador.")}</p>
    </div>
  )
}
