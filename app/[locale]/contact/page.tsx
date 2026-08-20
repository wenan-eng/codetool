import { locales } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }

export function generateStaticParams(){ return locales.map(locale=>({locale})) }

export function generateMetadata({params}:{params:{locale:string}}){
  const msgs = messagesMap[params.locale] || zh
  return { title: msgs.pages.contact.title }
}

export default function Page({params}:{params:{locale:string}}){
  const msgs = (messagesMap[params.locale] || zh).pages.contact
  return <article className="bg-white rounded-xl border p-6 prose prose-sm max-w-none"><h1>{msgs.h1}</h1><p>{msgs.p1}</p><p>{msgs.email}<a href="mailto:cirirude15@gmail.com">cirirude15@gmail.com</a></p><form className="not-prose mt-4 grid gap-3 max-w-md"><input placeholder={msgs.namePlaceholder} className="border rounded px-3 py-2 text-sm"/><input placeholder={msgs.emailPlaceholder} className="border rounded px-3 py-2 text-sm"/><textarea placeholder={msgs.messagePlaceholder} rows={4} className="border rounded px-3 py-2 text-sm"></textarea><button type="button" className="bg-gray-900 text-white text-sm rounded px-4 py-2">{msgs.send}</button></form><p className="mt-4">{msgs.privacyNote}</p><p>{msgs.date}</p></article>
}
