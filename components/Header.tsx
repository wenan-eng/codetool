import LanguageSwitcher from "./LanguageSwitcher"
import type { Locale } from "@/i18n"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }
export default function Header({ locale = "zh" }: { locale?: Locale | string }) {
  const msgs = messagesMap[locale as string] || zh
  const h = msgs.header
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <a href={`/${locale}`} className="font-bold text-blue-600">{h.title}</a>
        <nav className="hidden md:flex gap-4 text-sm text-gray-600">
          <a href={`/${locale}/code`} className="hover:text-blue-600">{h.code}</a><a href={`/${locale}/text`} className="hover:text-blue-600">{h.text}</a><a href={`/${locale}/encode`} className="hover:text-blue-600">{h.encode}</a><a href={`/${locale}/unit`} className="hover:text-blue-600">{h.unit}</a><a href={`/${locale}/image`} className="hover:text-blue-600">{h.image}</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-sm text-gray-400">{h.search}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
