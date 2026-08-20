"use client"
import { locales, localeNames } from "@/i18n"
import { usePathname, useParams } from "next/navigation"
export default function LanguageSwitcher(){
  const pathname = usePathname(); const params = useParams()
  const current = params.locale as string
  return (
    <div className="flex gap-1 text-xs">
      {locales.map(l=>{
        const href = pathname.replace(`/${current}`, `/${l}`)
        return <a key={l} href={href} className={`px-2 py-1 rounded ${l===current?'bg-blue-600 text-white':'bg-gray-100'}`}>{localeNames[l as keyof typeof localeNames]}</a>
      })}
    </div>
  )
}
