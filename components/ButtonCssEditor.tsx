"use client"
import { useState, useMemo } from "react"
import { generateButtonCss, generateButtonInlineStyle, defaultButtonOptions, type ButtonOptions } from "@/lib/buttonCss"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

export default function ButtonCssEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const bc = dict.buttonCss || {}
  const isEn = locale === "en"
  const isEs = locale === "es"
  const msgs = {
    title: bc.title || (isEn ? "Button CSS Generator" : isEs ? "Generador CSS de Botón" : "按钮 CSS 生成器"),
    preview: bc.preview || (isEn ? "Preview" : isEs ? "Vista previa" : "实时预览"),
    cssOutput: bc.cssOutput || (isEn ? "CSS Output" : isEs ? "Salida CSS" : "CSS 输出"),
    copy: bc.copy || (isEn ? "Copy CSS" : isEs ? "Copiar CSS" : "复制 CSS"),
    copied: bc.copied || (isEn ? "Copied" : isEs ? "Copiado" : "已复制"),
    copyHtml: bc.copyHtml || (isEn ? "Copy HTML" : isEs ? "Copiar HTML" : "复制 HTML"),
    reset: bc.reset || (isEn ? "Reset" : isEs ? "Restablecer" : "重置"),
    localNote: bc.localNote || (isEn ? "All processing is done locally, no upload" : isEs ? "Todo se procesa localmente, sin subida" : "所有操作均在浏览器本地完成，不上传数据"),
    labels: {
      text: isEn ? "Button Text" : isEs ? "Texto" : "按钮文字",
      bgColor: isEn ? "Background" : isEs ? "Fondo" : "背景色",
      textColor: isEn ? "Text Color" : isEs ? "Color texto" : "文字颜色",
      borderColor: isEn ? "Border Color" : isEs ? "Color borde" : "边框颜色",
      borderWidth: isEn ? "Border Width" : isEs ? "Ancho borde" : "边框宽度",
      borderRadius: isEn ? "Radius" : isEs ? "Radio" : "圆角",
      paddingY: isEn ? "Padding Y" : isEs ? "Padding Y" : "纵向内边距",
      paddingX: isEn ? "Padding X" : isEs ? "Padding X" : "横向内边距",
      fontSize: isEn ? "Font Size" : isEs ? "Tamaño fuente" : "字号",
      fontWeight: isEn ? "Font Weight" : isEs ? "Peso fuente" : "字重",
      boxShadow: isEn ? "Box Shadow" : isEs ? "Sombra" : "阴影",
      hoverBg: isEn ? "Hover BG" : isEs ? "Hover fondo" : "悬停背景",
    }
  }

  const [opts, setOpts] = useState<ButtonOptions>({ ...defaultButtonOptions })
  const [copied, setCopied] = useState<"css"|"html"|null>(null)

  const css = useMemo(()=> generateButtonCss(opts), [opts])
  const inlineStyle = useMemo(()=> generateButtonInlineStyle(opts), [opts])
  const html = `<button class="btn">${opts.text || "Button"}</button>`

  const update = (k: keyof ButtonOptions, v: any) => setOpts(prev => ({ ...prev, [k]: v }))

  const handleCopy = async (text: string, which: "css"|"html") => {
    await navigator.clipboard.writeText(text)
    setCopied(which); setTimeout(()=>setCopied(null),1500)
  }
  const handleReset = () => setOpts({ ...defaultButtonOptions })

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <span className="text-sm font-medium">{msgs.title}</span>
          <button onClick={handleReset} className="ml-auto text-xs px-3 py-1.5 border rounded-lg hover:bg-white bg-gray-50">{msgs.reset}</button>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-0">
          {/* Controls */}
          <div className="p-4 space-y-4 border-r bg-gray-50/30">
            <label className="text-xs space-y-1 block">
              <span className="text-gray-600">{msgs.labels.text}</span>
              <input value={opts.text || ""} onChange={e=>update("text", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.bgColor}</span>
                <div className="flex gap-1">
                  <input type="color" value={opts.bgColor} onChange={e=>update("bgColor", e.target.value)} className="w-7 h-7 p-0 border rounded" />
                  <input value={opts.bgColor} onChange={e=>update("bgColor", e.target.value)} className="flex-1 border rounded px-1.5 py-1 text-xs bg-white" />
                </div>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.textColor}</span>
                <div className="flex gap-1">
                  <input type="color" value={opts.textColor} onChange={e=>update("textColor", e.target.value)} className="w-7 h-7 p-0 border rounded" />
                  <input value={opts.textColor} onChange={e=>update("textColor", e.target.value)} className="flex-1 border rounded px-1.5 py-1 text-xs bg-white" />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.borderColor}</span>
                <div className="flex gap-1">
                  <input type="color" value={opts.borderColor || "#3b82f6"} onChange={e=>update("borderColor", e.target.value)} className="w-7 h-7 p-0 border rounded" />
                  <input value={opts.borderColor || ""} onChange={e=>update("borderColor", e.target.value)} className="flex-1 border rounded px-1.5 py-1 text-xs bg-white" />
                </div>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.hoverBg}</span>
                <div className="flex gap-1">
                  <input type="color" value={opts.hoverBgColor || "#2563eb"} onChange={e=>update("hoverBgColor", e.target.value)} className="w-7 h-7 p-0 border rounded" />
                  <input value={opts.hoverBgColor || ""} onChange={e=>update("hoverBgColor", e.target.value)} className="flex-1 border rounded px-1.5 py-1 text-xs bg-white" />
                </div>
              </label>
            </div>

            {[
              { key: "borderRadius", label: msgs.labels.borderRadius, min: 0, max: 40 },
              { key: "paddingY", label: msgs.labels.paddingY, min: 0, max: 32 },
              { key: "paddingX", label: msgs.labels.paddingX, min: 0, max: 48 },
              { key: "fontSize", label: msgs.labels.fontSize, min: 10, max: 28 },
            ].map((c)=>(
              <label key={c.key} className="text-xs space-y-1 block">
                <div className="flex justify-between"><span className="text-gray-600">{c.label}</span><span className="text-gray-400">{(opts as any)[c.key]}px</span></div>
                <input type="range" min={c.min} max={c.max} value={(opts as any)[c.key]} onChange={e=>update(c.key as any, Number(e.target.value))} className="w-full" />
              </label>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.borderWidth} (px)</span>
                <input type="number" min={0} max={8} value={opts.borderWidth} onChange={e=>update("borderWidth", Number(e.target.value))} className="w-full border rounded px-2 py-1 text-sm bg-white" />
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.fontWeight}</span>
                <select value={opts.fontWeight as any} onChange={e=>update("fontWeight", Number(e.target.value)||e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white">
                  <option value={400}>400</option><option value={500}>500</option><option value={600}>600</option><option value={700}>700</option>
                </select>
              </label>
            </div>

            <label className="text-xs space-y-1 block">
              <span className="text-gray-600">{msgs.labels.boxShadow}</span>
              <input value={opts.boxShadow || ""} onChange={e=>update("boxShadow", e.target.value)} placeholder="0 2px 8px rgba(0,0,0,0.15)" className="w-full border rounded px-2 py-1 text-xs bg-white" />
            </label>
          </div>

          {/* Preview + CSS */}
          <div className="flex flex-col">
            <div className="p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 border-b min-h-[140px]">
              <button style={inlineStyle as any} onMouseEnter={e=>{ if(opts.hoverBgColor) (e.currentTarget as HTMLButtonElement).style.backgroundColor = opts.hoverBgColor }} onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.backgroundColor = opts.bgColor }}>
                {opts.text || "Button"}
              </button>
            </div>

            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.cssOutput}</span>
              <div className="flex gap-2">
                <button onClick={()=>handleCopy(css,"css")} className="px-2 py-1 border rounded bg-white hover:bg-gray-50 text-xs">{copied==="css"?msgs.copied:msgs.copy}</button>
                <button onClick={()=>handleCopy(css + "\n\n" + html,"html")} className="px-2 py-1 border rounded bg-white hover:bg-gray-50 text-xs">{copied==="html"?msgs.copied:msgs.copyHtml}</button>
              </div>
            </div>
            <textarea value={css + "\n\n" + html} readOnly className="w-full flex-1 min-h-[220px] p-4 font-mono text-xs resize-none focus:outline-none bg-gray-50/50" />
            <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
