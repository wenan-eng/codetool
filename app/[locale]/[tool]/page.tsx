import tools from "@/config/tools.json"
import ToolLayout from "@/components/ToolLayout"
import { notFound } from "next/navigation"
import { locales } from "@/i18n"

export function generateStaticParams(){
  return locales.flatMap(locale=> tools.map(t=>({locale, tool: t.id})))
}

export function generateMetadata({params}:{params:{locale:string, tool:string}}){
  const t = tools.find(x=>x.id===params.tool); if(!t) return {}
  const locale = params.locale
  const title = locale==='en' ? (t as any).title_en : locale==='es' ? (t as any).title_es : t.title
  const desc = locale==='en' ? (t as any).description_en : locale==='es' ? (t as any).description_es : t.description
  return { title, description: desc }
}

export default function Page({params}:{params:{locale:string, tool:string}}){
  const tool = tools.find(t=>t.id===params.tool); if(!tool) notFound()
  return <ToolLayout tool={tool} locale={params.locale} />
}
