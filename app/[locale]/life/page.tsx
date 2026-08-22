import tools from "@/config/tools.json"
import { locales } from "@/i18n"
import { buildPageMetadata } from "@/lib/meta"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }
export function generateStaticParams(){ return locales.map(locale=>({locale})) }
export function generateMetadata({params}:{params:{locale:string}}){
  const title = params.locale==='en' ? 'Life Tools' : params.locale==='es' ? 'Herramientas de Vida' : '生活计算工具'
  const desc = params.locale==='en' ? 'All image tools: adjust, convert, compress and more — all local.' : params.locale==='es' ? 'Todas las herramientas de imagen.' : '涵盖调色、裁剪、格式转换、水印等图片工具，本地处理不上传。'
  return buildPageMetadata({ locale: params.locale, path: "life", title, description: desc })
}
export default function ImageCategory({params}:{params:{locale:string}}){
  const locale = params.locale
  const filtered = (tools as any[]).filter(t=>t.category==="生活计算")
  const title = locale==='en' ? 'Life' : locale==='es' ? 'Vida' : '生活计算'
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-gray-500 mb-6">{filtered.length} tools • 本地处理 • 无需上传</p>
      {filtered.length===0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500 text-sm">本分类工具正在陆续上线中，敬请期待</div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(t=>{
          const h1 = locale==='en' ? t.h1_en : locale==='es' ? t.h1_es : t.h1
          const desc = locale==='en' ? t.description_en : locale==='es' ? t.description_es : t.description
          const icon = t.icon as string
          return <a key={t.id} href={`/${locale}/${t.id}`} className="bg-white border rounded-xl p-4 hover:shadow-md hover:border-blue-200 flex flex-col gap-2"><div className="flex items-center gap-3"><img src={icon} alt="" width={36} height={36} className="w-9 h-9 rounded-lg bg-blue-50 p-1.5 shrink-0" loading="lazy" /><div className="font-medium text-sm leading-tight">{h1}</div></div><div className="text-xs text-gray-500 line-clamp-2">{desc.slice(0,60)}...</div></a>
        })}
      </div>
      )}
    </div>
  )
}
