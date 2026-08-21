"use client"
import { useState } from "react"

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255, gg = g / 255, bb = b / 255
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
  const l = Math.round(((max + min) / 2) * 100)
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = Math.round((l > 50 ? d / (2 - max - min) : d / (max + min)) * 100)
  let h: number
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60
  else if (max === gg) h = ((bb - rr) / d + 2) * 60
  else h = ((rr - gg) / d + 4) * 60
  return [Math.round(h), s, l]
}

export default function ColorConverterEditor({ locale = "zh" }: { locale?: string }) {
  const [color, setColor] = useState("#3B82F6")
  const rgb = hexToRgb(color) ?? [59, 130, 246]
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2])

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : es)

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.join(", ")})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
  ]

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">{t("选择颜色", "Pick color", "Elegir color")}</span>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-12 border rounded-lg cursor-pointer" />
        <input value={color} onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value) || e.target.value.startsWith("#")) setColor(e.target.value) }} className="flex-1 p-3 border rounded-xl font-mono text-sm" />
      </label>
      <div className="rounded-xl h-28 border" style={{ backgroundColor: color }} />
      <div className="bg-white border rounded-xl overflow-hidden">
        {formats.map(f => (
          <button key={f.label} onClick={() => navigator.clipboard.writeText(f.value)} className="w-full flex items-center justify-between p-3 border-b last:border-0 hover:bg-blue-50">
            <span className="text-sm text-gray-500">{f.label}</span>
            <span className="font-mono text-sm">{f.value} ⧉</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400">{t("点击任意格式行即可复制；所有操作均在浏览器本地完成", "Click a row to copy. All processing is local.", "Clic para copiar. Todo local.")}</p>
    </div>
  )
}
