"use client"
import { useState, useMemo } from "react"
import { generateManifest, stringifyManifest, parseManifest, validateManifest, defaultManifest, type PwaManifest, type ManifestIcon } from "@/lib/pwaManifest"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

export default function PwaManifestEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const pm = dict.pwaManifest || {}
  const isEn = locale === "en"
  const isEs = locale === "es"
  const msgs = {
    title: pm.title || (isEn ? "PWA Manifest Generator" : isEs ? "Generador de Manifest PWA" : "PWA Manifest 可视化配置"),
    generate: pm.generate || (isEn ? "Generate JSON" : isEs ? "Generar JSON" : "生成 JSON"),
    copy: pm.copy || (isEn ? "Copy JSON" : isEs ? "Copiar JSON" : "复制 JSON"),
    download: pm.download || (isEn ? "Download manifest.json" : isEs ? "Descargar manifest.json" : "下载 manifest.json"),
    clear: pm.clear || (isEn ? "Reset" : isEs ? "Restablecer" : "重置"),
    copied: pm.copied || (isEn ? "Copied" : isEs ? "Copiado" : "已复制"),
    preview: pm.preview || (isEn ? "Preview & Output" : isEs ? "Vista previa y salida" : "预览与输出"),
    importJson: pm.importJson || (isEn ? "Import JSON → Form" : isEs ? "Importar JSON → Formulario" : "导入 JSON 到表单"),
    localNote: pm.localNote || (isEn ? "All processing is done locally, no upload" : isEs ? "Todo se procesa localmente, sin subida" : "所有操作均在浏览器本地完成，不上传数据"),
    labels: {
      name: isEn ? "App Name" : isEs ? "Nombre" : "应用名称",
      short_name: isEn ? "Short Name" : isEs ? "Nombre corto" : "短名称",
      description: isEn ? "Description" : isEs ? "Descripción" : "描述",
      start_url: isEn ? "Start URL" : isEs ? "URL inicio" : "启动地址",
      scope: isEn ? "Scope" : isEs ? "Alcance" : "作用域",
      display: isEn ? "Display" : isEs ? "Modo" : "显示模式",
      orientation: isEn ? "Orientation" : isEs ? "Orientación" : "方向",
      theme_color: isEn ? "Theme Color" : isEs ? "Color tema" : "主题色",
      background_color: isEn ? "Background Color" : isEs ? "Color fondo" : "背景色",
      lang: isEn ? "Language" : isEs ? "Idioma" : "语言",
      icons: isEn ? "Icons" : isEs ? "Iconos" : "图标",
    }
  }

  const [form, setForm] = useState<PwaManifest>({ ...defaultManifest })
  const [jsonOutput, setJsonOutput] = useState<string>(stringifyManifest(defaultManifest))
  const [importJson, setImportJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const validation = useMemo(()=> validateManifest(form), [form])

  const handleGenerate = () => {
    const m = generateManifest(form)
    const v = validateManifest(m)
    if (!v.valid) { setError(v.errors.join("; ")); return }
    setJsonOutput(stringifyManifest(m))
    setError(null)
  }

  const handleImport = () => {
    if (!importJson.trim()) { setError(isEn ? "Please paste manifest JSON" : isEs ? "Pegue JSON del manifest" : "请输入 manifest JSON"); return }
    try {
      const parsed = parseManifest(importJson)
      setForm({ ...defaultManifest, ...parsed, icons: parsed.icons || defaultManifest.icons })
      setJsonOutput(stringifyManifest(parsed))
      setError(null)
    } catch (e:any){ setError(e.message) }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput)
    setCopied(true); setTimeout(()=>setCopied(false),1500)
  }
  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "manifest.json"; a.click()
    URL.revokeObjectURL(url)
  }
  const handleReset = () => { setForm({ ...defaultManifest }); setJsonOutput(stringifyManifest(defaultManifest)); setError(null); setImportJson("") }

  const update = (key: keyof PwaManifest, val: any) => setForm(prev => ({ ...prev, [key]: val }))
  const updateIcon = (idx: number, field: keyof ManifestIcon, val: string) => {
    const next = [...form.icons]
    next[idx] = { ...next[idx], [field]: val }
    setForm(prev => ({ ...prev, icons: next }))
  }
  const addIcon = () => setForm(prev => ({ ...prev, icons: [...prev.icons, { src: "/icon-192.png", sizes: "192x192", type: "image/png" }] }))
  const removeIcon = (idx: number) => setForm(prev => ({ ...prev, icons: prev.icons.filter((_,i)=>i!==idx) }))

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">{msgs.title}</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <button onClick={handleGenerate} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{msgs.generate}</button>
            <button onClick={handleCopy} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 bg-white">{copied?msgs.copied:msgs.copy}</button>
            <button onClick={handleDownload} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 bg-white">{msgs.download}</button>
            <button onClick={handleReset} className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600">{msgs.clear}</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Form */}
          <div className="p-4 space-y-4 border-r">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.name} *</span>
                <input value={form.name} onChange={e=>update("name", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.short_name} *</span>
                <input value={form.short_name} onChange={e=>update("short_name", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </label>
            </div>
            <label className="text-xs space-y-1 block">
              <span className="text-gray-600">{msgs.labels.description}</span>
              <input value={form.description || ""} onChange={e=>update("description", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.start_url} *</span>
                <input value={form.start_url || ""} onChange={e=>update("start_url", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.scope}</span>
                <input value={form.scope || ""} onChange={e=>update("scope", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.display}</span>
                <select value={form.display || "standalone"} onChange={e=>update("display", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm bg-white">
                  <option value="standalone">standalone</option><option value="fullscreen">fullscreen</option><option value="minimal-ui">minimal-ui</option><option value="browser">browser</option>
                </select>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.orientation}</span>
                <select value={form.orientation || "any"} onChange={e=>update("orientation", e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm bg-white">
                  <option value="any">any</option><option value="natural">natural</option><option value="portrait">portrait</option><option value="landscape">landscape</option><option value="portrait-primary">portrait-primary</option><option value="landscape-primary">landscape-primary</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.theme_color}</span>
                <div className="flex gap-2">
                  <input type="color" value={form.theme_color || "#0ea5e9"} onChange={e=>update("theme_color", e.target.value)} className="w-8 h-8 p-0 border rounded" />
                  <input value={form.theme_color || ""} onChange={e=>update("theme_color", e.target.value)} className="flex-1 border rounded-lg px-2 py-1.5 text-sm" />
                </div>
              </label>
              <label className="text-xs space-y-1">
                <span className="text-gray-600">{msgs.labels.background_color}</span>
                <div className="flex gap-2">
                  <input type="color" value={form.background_color || "#ffffff"} onChange={e=>update("background_color", e.target.value)} className="w-8 h-8 p-0 border rounded" />
                  <input value={form.background_color || ""} onChange={e=>update("background_color", e.target.value)} className="flex-1 border rounded-lg px-2 py-1.5 text-sm" />
                </div>
              </label>
            </div>
            <label className="text-xs space-y-1 block">
              <span className="text-gray-600">{msgs.labels.lang}</span>
              <input value={form.lang || ""} onChange={e=>update("lang", e.target.value)} placeholder="zh-CN" className="w-full border rounded-lg px-2 py-1.5 text-sm" />
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{msgs.labels.icons}</span>
                <button onClick={addIcon} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">+ {isEn?"Add":isEs?"Añadir":"添加图标"}</button>
              </div>
              {form.icons.map((ic, idx)=>(
                <div key={idx} className="grid grid-cols-[1fr_90px_110px_auto] gap-2 items-end bg-gray-50 p-2 rounded-lg">
                  <label className="text-[11px] space-y-1">
                    <span className="text-gray-500">src</span>
                    <input value={ic.src} onChange={e=>updateIcon(idx,"src",e.target.value)} className="w-full border rounded px-1.5 py-1 text-xs bg-white" placeholder="/icon-192.png" />
                  </label>
                  <label className="text-[11px] space-y-1">
                    <span className="text-gray-500">sizes</span>
                    <input value={ic.sizes} onChange={e=>updateIcon(idx,"sizes",e.target.value)} className="w-full border rounded px-1.5 py-1 text-xs bg-white" placeholder="192x192" />
                  </label>
                  <label className="text-[11px] space-y-1">
                    <span className="text-gray-500">type</span>
                    <input value={ic.type || ""} onChange={e=>updateIcon(idx,"type",e.target.value)} className="w-full border rounded px-1.5 py-1 text-xs bg-white" placeholder="image/png" />
                  </label>
                  <button onClick={()=>removeIcon(idx)} className="text-xs text-red-500 hover:text-red-700 px-1">✕</button>
                </div>
              ))}
            </div>

            {!validation.valid && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {validation.errors.map((e,i)=><div key={i}>• {e}</div>)}
              </div>
            )}
            {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          </div>

          {/* JSON Output + import */}
          <div className="flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between items-center">
              <span>{msgs.preview} — manifest.json</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{jsonOutput.split("\n").length} 行</span>
            </div>
            <textarea value={jsonOutput} onChange={e=>setJsonOutput(e.target.value)} className="w-full flex-1 min-h-[280px] p-4 font-mono text-xs resize-none focus:outline-none bg-gray-50/50" />
            <div className="border-t p-3 space-y-2 bg-white">
              <div className="text-xs text-gray-500">{msgs.importJson}</div>
              <div className="flex gap-2">
                <textarea value={importJson} onChange={e=>setImportJson(e.target.value)} placeholder='{"name":"..."}' className="flex-1 border rounded-lg px-2 py-1.5 text-xs font-mono h-[60px] resize-none focus:outline-none" />
                <button onClick={handleImport} className="px-3 py-1.5 bg-white border rounded-lg text-xs hover:bg-gray-50 self-start">→</button>
              </div>
            </div>
            <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
