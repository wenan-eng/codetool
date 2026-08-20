import tools from "@/config/tools.json"
import { locales } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }
export function generateStaticParams(){ return locales.map(locale=>({locale})) }
export function generateMetadata({params}:{params:{locale:string}}){
  const msgs = messagesMap[params.locale] || zh
  const title = params.locale==='en' ? 'Development Tools' : params.locale==='es' ? 'Herramientas Desarrollo' : '编程开发工具'
  const desc = params.locale==='en' ? 'All coding tools: formatter, converter, charts and helpers.' : params.locale==='es' ? 'Todas las herramientas de programación.' : '涵盖代码美化、数据转换、图表工具、开发辅助共 50 款。'
  return { title, description: desc }
}
export default function CodeCategory({params}:{params:{locale:string}}){
  const locale = params.locale
  const filtered = (tools as any[]).filter(t=>t.category==="编程开发")
  const title = locale==='en' ? 'Development' : locale==='es' ? 'Desarrollo' : '编程开发'
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-gray-500 mb-6">{filtered.length} tools • 本地处理 • 无需上传</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(t=>{
          const h1 = locale==='en' ? t.h1_en : locale==='es' ? t.h1_es : t.h1
          const desc = locale==='en' ? t.description_en : locale==='es' ? t.description_es : t.description
          return <a key={t.id} href={`/${locale}/${t.id}`} className="bg-white border rounded-xl p-4 hover:shadow-md hover:border-blue-200"><div className="font-medium text-sm">{h1}</div><div className="text-xs text-gray-500 mt-1 line-clamp-2">{desc.slice(0,60)}...</div></a>
        })}
      </div>
    </div>
  )
}
