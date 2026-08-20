import tools from "@/config/tools.json"
import { locales } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }

export function generateStaticParams(){ return locales.map(locale=>({locale})) }

export function generateMetadata({params}:{params:{locale:string}}){
  const msgs = messagesMap[params.locale] || zh
  return { title: msgs.home.title, description: msgs.tool.desc }
}

export default function Home({params}:{params:{locale:string}}){
  const locale = params.locale
  const msgs = messagesMap[locale] || zh
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{msgs.home.title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map(t=>{
          const h1 = locale==='en' ? (t as any).h1_en : locale==='es' ? (t as any).h1_es : t.h1
          const desc = locale==='en' ? (t as any).description_en : locale==='es' ? (t as any).description_es : t.description
          return <a key={t.id} href={`/${locale}/${t.id}`} className="bg-white border rounded-xl p-4 hover:shadow-md"><div className="font-medium text-sm">{h1}</div><div className="text-xs text-gray-500 mt-1">{desc.slice(0,40)}...</div></a>
        })}
      </div>
    </div>
  )
}
