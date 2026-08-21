"use client"
import { useRef, useState, useEffect } from "react"
import { adjustPixels, sharpen } from "@/lib/imageAdjust"

type ToolId =
  | "image-brightness" | "image-contrast" | "image-saturation" | "image-hsl"
  | "image-temperature" | "image-highlight" | "image-fader" | "image-sharpener"
  | "blur-image" | "image-rotate" | "image-mirror" | "image-size-revise"
  | "image-cropping" | "image-quality"

interface SliderDef { key: string; label: string; min: number; max: number; def: number }

const CONFIG: Record<ToolId, { sliders: SliderDef[]; needsSize?: boolean; needCrop?: boolean }> = {
  "image-brightness": { sliders: [{ key: "brightness", label: "亮度", min: -100, max: 100, def: 0 }] },
  "image-contrast": { sliders: [{ key: "contrast", label: "对比度", min: -100, max: 100, def: 0 }] },
  "image-saturation": { sliders: [{ key: "saturation", label: "饱和度", min: -100, max: 100, def: 0 }] },
  "image-hsl": { sliders: [
    { key: "hue", label: "色相", min: -180, max: 180, def: 0 },
    { key: "saturation", label: "饱和度", min: -100, max: 100, def: 0 },
    { key: "lightness", label: "明度", min: -100, max: 100, def: 0 },
  ] },
  "image-temperature": { sliders: [{ key: "temperature", label: "冷暖（冷←→暖）", min: -100, max: 100, def: 0 }] },
  "image-highlight": { sliders: [{ key: "highlight", label: "高光", min: -100, max: 100, def: 0 }] },
  "image-fader": { sliders: [{ key: "fade", label: "淡化程度", min: 0, max: 100, def: 30 }] },
  "image-sharpener": { sliders: [{ key: "sharpenAmount", label: "锐化强度", min: 1, max: 100, def: 40 }] },
  "blur-image": { sliders: [{ key: "blurRadius", label: "虚化半径(px)", min: 0, max: 20, def: 4 }] },
  "image-rotate": { sliders: [{ key: "angle", label: "旋转角度", min: -180, max: 180, def: 90 }] },
  "image-mirror": { sliders: [] },
  "image-size-revise": { sliders: [], needsSize: true },
  "image-cropping": { sliders: [], needCrop: true },
  "image-quality": { sliders: [{ key: "quality", label: "输出质量%", min: 10, max: 100, def: 75 }] },
}

export default function ImageAdjustEditor({ toolId, locale = "zh" }: { toolId: ToolId; locale?: string }) {
  const cfg = CONFIG[toolId]
  const [imgUrl, setImgUrl] = useState("")
  const [sliders, setSliders] = useState<Record<string, number>>(Object.fromEntries(cfg.sliders.map(s => [s.key, s.def])))
  const [size, setSize] = useState({ w: "", h: "" })
  const [crop, setCrop] = useState({ x: "0", y: "0", w: "", h: "" })
  const [mirrorH, setMirrorH] = useState(false)
  const [mirrorV, setMirrorV] = useState(false)
  const [error, setError] = useState("")
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError(t("请选择图片文件", "Please select an image", "Seleccione una imagen")); return }
    setError("")
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setImgUrl(String(reader.result || ""))
        setSize({ w: String(img.naturalWidth), h: String(img.naturalHeight) })
        setCrop(c => ({ ...c, w: String(img.naturalWidth), h: String(img.naturalHeight) }))
      }
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    try {
      if (cfg.needCrop || cfg.needsSize || toolId === "image-quality") {
        const sx = cfg.needCrop ? Number(crop.x) || 0 : 0
        const sy = cfg.needCrop ? Number(crop.y) || 0 : 0
        const sw = cfg.needCrop ? Number(crop.w) || img.naturalWidth : img.naturalWidth
        const sh = cfg.needCrop ? Number(crop.h) || img.naturalHeight : img.naturalHeight
        const dw = cfg.needsSize ? Number(size.w) || img.naturalWidth : sw
        const dh = cfg.needsSize ? Number(size.h) || img.naturalHeight : sh
        canvas.width = Math.max(1, dw); canvas.height = Math.max(1, dh)
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
      } else if (toolId === "image-rotate") {
        const rad = ((Number(sliders.angle) || 0) * Math.PI) / 180
        const w = img.naturalWidth, h = img.naturalHeight
        const cw = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad))
        const chh = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))
        canvas.width = Math.round(cw); canvas.height = Math.round(chh)
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(rad)
        ctx.drawImage(img, -w / 2, -h / 2)
      } else if (toolId === "image-mirror") {
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
        ctx.translate(mirrorH ? canvas.width : 0, mirrorV ? canvas.height : 0)
        ctx.scale(mirrorH ? -1 : 1, mirrorV ? -1 : 1)
        ctx.drawImage(img, 0, 0)
      } else {
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        if (toolId === "image-sharpener") {
          data.data.set(sharpen(data.data, canvas.width, canvas.height, Number(sliders.sharpenAmount) || 0))
        } else if (toolId === "blur-image") {
          import("@/lib/imageAdjust").then(m => {
            data.data.set(m.boxBlur(data.data, canvas.width, canvas.height, Number(sliders.blurRadius) || 0))
            ctx.putImageData(data, 0, 0)
          })
          return
        } else {
          const keys = Object.keys(sliders)
          data.data.set(adjustPixels(data.data, Object.fromEntries(keys.map(k => [k, Number(sliders[k])]))))
        }
        ctx.putImageData(data, 0, 0)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [imgUrl, sliders, mirrorH, mirrorV, size, crop])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mime = toolId === "image-quality" ? "image/jpeg" : "image/png"
    const q = toolId === "image-quality" ? Number(sliders.quality) / 100 : undefined
    canvas.toBlob(blob => {
      if (!blob) return
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `result.${mime.split("/")[1]}`
      a.click()
    }, mime, q)
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition text-sm text-gray-500 block">
        🖼️ {t("点击上传或拖拽图片文件（全程本地处理，不上传）", "Click or drop an image (processed locally)", "Haga clic o arrastre una imagen (procesado localmente)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {imgUrl && (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white border rounded-xl p-2"><div className="text-xs text-gray-400 mb-1 text-center">{t("原图", "Original", "Original")}</div><img src={imgUrl} alt="" className="max-h-56 mx-auto object-contain rounded" /></div>
            <div className="bg-white border rounded-xl p-2"><div className="text-xs text-gray-400 mb-1 text-center">{t("处理后预览", "Preview", "Vista previa")}</div><canvas ref={canvasRef} className="max-h-56 mx-auto object-contain rounded max-w-full" /></div>
          </div>
          {cfg.sliders.map(s => (
            <label key={s.key} className="flex items-center gap-3 text-sm">
              <span className="text-gray-600 w-36 shrink-0">{s.label}</span>
              <input type="range" min={s.min} max={s.max} value={sliders[s.key]} onChange={e => setSliders(p => ({ ...p, [s.key]: Number(e.target.value) }))} className="flex-1" />
              <span className="w-12 text-right font-mono text-xs">{sliders[s.key]}</span>
            </label>
          ))}
          {toolId === "image-mirror" && (
            <div className="flex gap-3">
              <button onClick={() => setMirrorH(v => !v)} className={`px-4 py-2 rounded-lg text-sm ${mirrorH ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t("水平镜像", "Flip horizontal", "Espejo horizontal")}</button>
              <button onClick={() => setMirrorV(v => !v)} className={`px-4 py-2 rounded-lg text-sm ${mirrorV ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t("垂直镜像", "Flip vertical", "Espejo vertical")}</button>
            </div>
          )}
          {cfg.needsSize && (
            <div className="flex gap-3">
              <input value={size.w} onChange={e => setSize(p => ({ ...p, w: e.target.value }))} placeholder={t("宽度 px", "Width", "Ancho")} inputMode="numeric" className="w-32 p-2.5 border rounded-lg text-sm" />
              <input value={size.h} onChange={e => setSize(p => ({ ...p, h: e.target.value }))} placeholder={t("高度 px", "Height", "Alto")} inputMode="numeric" className="w-32 p-2.5 border rounded-lg text-sm" />
            </div>
          )}
          {cfg.needCrop && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([["x", "X"], ["y", "Y"], ["w", t("宽 Width", "Width", "Ancho")], ["h", t("高 Height", "Height", "Alto")]] as [keyof typeof crop, string][]).map(([k, label]) => (
                <label key={k} className="flex flex-col gap-1 text-sm"><span className="text-gray-600">{label}</span><input value={crop[k]} onChange={e => setCrop(p => ({ ...p, [k]: e.target.value }))} inputMode="numeric" className="p-2.5 border rounded-lg" /></label>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={download} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">⬇️ {t("下载结果", "Download Result", "Descargar resultado")}</button>
            <button onClick={() => { setImgUrl(""); imgRef.current = null }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">{t("换一张", "Change Image", "Cambiar imagen")}</button>
          </div>
        </>
      )}
    </div>
  )
}
