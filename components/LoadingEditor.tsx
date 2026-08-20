"use client"
import { useState } from "react"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

type Loader = {
  id: string
  name: string
  name_en: string
  name_es: string
  html: string
  css: string
}

const LOADERS: Loader[] = [
  {
    id: "spinner",
    name: "旋转圆环",
    name_en: "Spinner",
    name_es: "Spinner",
    html: '<div class="loader-spinner"></div>',
    css: `.loader-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }`,
  },
  {
    id: "dots",
    name: "跳动圆点",
    name_en: "Bouncing Dots",
    name_es: "Puntos saltarines",
    html: '<div class="loader-dots"><span></span><span></span><span></span></div>',
    css: `.loader-dots { display: flex; gap: 6px; }
.loader-dots span {
  width: 10px; height: 10px;
  background: #3b82f6; border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}
.loader-dots span:nth-child(2){ animation-delay: 0.2s; }
.loader-dots span:nth-child(3){ animation-delay: 0.4s; }
@keyframes bounce { to { transform: translateY(-8px); opacity: 0.6; } }`,
  },
  {
    id: "bars",
    name: "跳动条",
    name_en: "Bars",
    name_es: "Barras",
    html: '<div class="loader-bars"><span></span><span></span><span></span><span></span></div>',
    css: `.loader-bars { display: flex; gap: 4px; align-items: flex-end; height: 32px; }
.loader-bars span {
  width: 6px; background: #3b82f6; border-radius: 3px;
  animation: bar 0.8s ease-in-out infinite;
}
.loader-bars span:nth-child(1){ height: 12px; animation-delay: 0s; }
.loader-bars span:nth-child(2){ height: 20px; animation-delay: 0.1s; }
.loader-bars span:nth-child(3){ height: 16px; animation-delay: 0.2s; }
.loader-bars span:nth-child(4){ height: 24px; animation-delay: 0.3s; }
@keyframes bar { 0%,100%{ transform: scaleY(0.6); } 50%{ transform: scaleY(1); } }`,
  },
  {
    id: "pulse",
    name: "脉冲圆",
    name_en: "Pulse",
    name_es: "Pulso",
    html: '<div class="loader-pulse"></div>',
    css: `.loader-pulse {
  width: 40px; height: 40px;
  background: #3b82f6; border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  50% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(0.8); opacity: 1; }
}`,
  },
  {
    id: "ring",
    name: "双环",
    name_en: "Dual Ring",
    name_es: "Doble anillo",
    html: '<div class="loader-ring"></div>',
    css: `.loader-ring {
  width: 40px; height: 40px;
  border: 4px solid transparent;
  border-top-color: #3b82f6;
  border-bottom-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }`,
  },
  {
    id: "skeleton",
    name: "骨架屏",
    name_en: "Skeleton",
    name_es: "Esqueleto",
    html: '<div class="loader-skeleton"><div class="sk-line"></div><div class="sk-line short"></div></div>',
    css: `.loader-skeleton { width: 160px; }
.sk-line {
  height: 12px; background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 6px; margin-bottom: 8px;
  animation: shimmer 1.5s infinite;
}
.sk-line.short { width: 60%; }
@keyframes shimmer { 0%{ background-position: 200% 0; } 100%{ background-position: -200% 0; } }`,
  },
  {
    id: "progress",
    name: "进度条",
    name_en: "Progress Bar",
    name_es: "Barra de progreso",
    html: '<div class="loader-progress"><div class="loader-progress-bar"></div></div>',
    css: `.loader-progress {
  width: 160px; height: 6px;
  background: #e5e7eb; border-radius: 999px; overflow: hidden;
}
.loader-progress-bar {
  height: 100%; width: 40%;
  background: #3b82f6; border-radius: 999px;
  animation: progress 1.2s ease-in-out infinite;
}
@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}`,
  },
  {
    id: "typing",
    name: "输入中",
    name_en: "Typing",
    name_es: "Escribiendo",
    html: '<div class="loader-typing"><span></span><span></span><span></span></div>',
    css: `.loader-typing { display:flex; gap:4px; align-items:center; }
.loader-typing span {
  width:8px; height:8px; background:#9ca3af; border-radius:50%;
  animation: typing 1s infinite;
}
.loader-typing span:nth-child(2){ animation-delay:0.2s; }
.loader-typing span:nth-child(3){ animation-delay:0.4s; }
@keyframes typing { 0%,80%,100%{ opacity:0.3; transform:scale(0.8);} 40%{opacity:1; transform:scale(1);} }`,
  },
]

export default function LoadingEditor({ locale = "zh" }: { locale?: string }) {
  const dict = (messagesMap[locale] || zh) as any
  const lg = dict.loading || {}
  const isEn = locale === "en"
  const isEs = locale === "es"
  const msgs = {
    title: lg.title || (isEn ? "CSS Loading Gallery" : isEs ? "Galería de Loading CSS" : "CSS 加载动画画廊"),
    copyHtml: lg.copyHtml || (isEn ? "Copy HTML" : isEs ? "Copiar HTML" : "复制 HTML"),
    copyCss: lg.copyCss || (isEn ? "Copy CSS" : isEs ? "Copiar CSS" : "复制 CSS"),
    copyAll: lg.copyAll || (isEn ? "Copy All" : isEs ? "Copiar todo" : "复制全部"),
    copied: lg.copied || (isEn ? "Copied" : isEs ? "Copiado" : "已复制"),
    localNote: lg.localNote || (isEn ? "All processing is done locally, no upload" : isEs ? "Todo se procesa localmente, sin subida" : "所有操作均在浏览器本地完成，不上传数据"),
  }

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(()=>setCopiedId(null),1500)
  }

  // collect all CSS for style tag (dedupe keyframes handled by including each)
  const allCss = LOADERS.map(l=>l.css).join("\n\n")

  return (
    <div className="space-y-4">
      <style dangerouslySetInnerHTML={{ __html: allCss }} />
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium">{msgs.title}</span>
          <span className="text-xs text-gray-400">{LOADERS.length} styles</span>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {LOADERS.map(loader => {
            const displayName = locale==="en" ? loader.name_en : locale==="es" ? loader.name_es : loader.name
            return (
              <div key={loader.id} className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="h-[120px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 border-b">
                  <div dangerouslySetInnerHTML={{ __html: loader.html }} />
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-xs font-medium text-gray-700">{displayName}</div>
                  <pre className="text-[10px] leading-3 bg-gray-50 border rounded p-2 overflow-auto max-h-[90px] font-mono text-gray-600">{loader.html + "\n\n" + loader.css.slice(0, 200) + (loader.css.length>200?"…":"")}</pre>
                  <div className="flex gap-1">
                    <button onClick={()=>handleCopy(loader.html, loader.id+"-html")} className="flex-1 px-2 py-1 text-xs border rounded hover:bg-gray-50">
                      {copiedId===loader.id+"-html"?msgs.copied:msgs.copyHtml}
                    </button>
                    <button onClick={()=>handleCopy(loader.css, loader.id+"-css")} className="flex-1 px-2 py-1 text-xs border rounded hover:bg-gray-50">
                      {copiedId===loader.id+"-css"?msgs.copied:msgs.copyCss}
                    </button>
                    <button onClick={()=>handleCopy(loader.html+"\n\n<style>\n"+loader.css+"\n</style>", loader.id+"-all")} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      {copiedId===loader.id+"-all"?msgs.copied:msgs.copyAll}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>
    </div>
  )
}
