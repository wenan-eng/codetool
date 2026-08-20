import "../globals.css"
import Script from "next/script"
import { locales } from "@/i18n"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
export function generateStaticParams(){ return locales.map(locale=>({locale})) }
export function generateMetadata({ params:{locale} }: { params:{locale:string} }){
  return {
    alternates: {
      languages: {
        zh: 'https://codetool.site/zh',
        en: 'https://codetool.site/en',
        es: 'https://codetool.site/es',
        'x-default': 'https://codetool.site/zh',
      }
    }
  }
}
export default function LocaleLayout({children, params:{locale}}:{children:React.ReactNode, params:{locale:string}}){
  return (
    <html lang={locale}>
      <body className="bg-[#f8fafc] text-gray-900">
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4188363142718866" crossOrigin="anonymous" strategy="afterInteractive" />
        <Header locale={locale} />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
