import { locales } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
import { buildPageMetadata } from "@/lib/meta"
const messagesMap: Record<string, any> = { zh, en, es }

export function generateStaticParams(){ return locales.map(locale=>({locale})) }

export function generateMetadata({params}:{params:{locale:string}}){
  const msgs = messagesMap[params.locale] || zh
  return buildPageMetadata({ locale: params.locale, path: "terms", title: msgs.pages.terms.title, description: msgs.pages.terms.p1 })
}

export default function Page({params}:{params:{locale:string}}){
  const msgs = (messagesMap[params.locale] || zh).pages.terms
  return <article className="bg-white rounded-xl border p-6 prose prose-sm max-w-none"><h1>{msgs.h1}</h1><p>{msgs.intro}</p><p>{msgs.p1}</p><p>{msgs.p2}</p><p>{msgs.p3}</p><p>{msgs.p4}</p><p>{msgs.p5}</p><p>{msgs.date}</p></article>
}
