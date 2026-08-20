import "../globals.css"
import { locales } from "@/i18n"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
export function generateStaticParams(){ return locales.map(locale=>({locale})) }
export default function LocaleLayout({children, params:{locale}}:{children:React.ReactNode, params:{locale:string}}){
  return (
    <html lang={locale}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4188363142718866" crossOrigin="anonymous"></script>
        {locales.map(l=><link key={l} rel="alternate" hrefLang={l} href={`https://codetool.site/${l}`} />)}
        <link rel="alternate" hrefLang="x-default" href="https://codetool.site/zh" />
      </head>
      <body className="bg-[#f8fafc] text-gray-900">
        <Header locale={locale} />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
