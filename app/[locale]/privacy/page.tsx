import { locales } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }

export function generateStaticParams(){ return locales.map(locale=>({locale})) }

export function generateMetadata({params}:{params:{locale:string}}){
  const msgs = messagesMap[params.locale] || zh
  return { title: msgs.pages.privacy.title }
}

export default function Page({params}:{params:{locale:string}}){
  const msgs = (messagesMap[params.locale] || zh).pages.privacy
  return <article className="bg-white rounded-xl border p-6 prose prose-sm max-w-none"><h1>{msgs.h1}</h1><p>{msgs.p1}</p><p>{msgs.date}</p></article>
}
