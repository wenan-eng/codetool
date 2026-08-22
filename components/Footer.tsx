import type { Locale } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }
export default function Footer({ locale = "zh" }: { locale?: Locale | string }) {
  const msgs = messagesMap[locale as string] || zh
  const f = msgs.footer
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
        <div><h4 className="font-semibold mb-2">{f.popular}</h4><a href={`/${locale}/json-formatter`}>JSON</a></div>
        <div><h4 className="font-semibold mb-2">{f.tools}</h4><a href={`/${locale}/client-info`}>IP</a></div>
        <div><h4 className="font-semibold mb-2">{f.about}</h4><a href={`/${locale}/about`}>{f.aboutUs}</a><a href={`/${locale}/privacy`} className="block">{f.privacy}</a></div>
        <div><h4 className="font-semibold mb-2">{f.compliance}</h4><a href={`/${locale}/terms`}>{f.terms}</a><a href={`/${locale}/contact`}>{f.contact}</a></div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4">{f.rights}</div>
    </footer>
  )
}
