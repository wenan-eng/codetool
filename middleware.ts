import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, isValidLocale } from './i18n'
export function middleware(req: NextRequest){
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.match(/\.(.*)$/)) return
  const hasLocale = locales.some(l=> pathname===`/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return
  if (pathname==='/' || pathname==='') {
    const accept = req.headers.get('accept-language') || ''
    let locale = defaultLocale
    if (accept.includes('es')) locale='es'
    else if (accept.includes('en')) locale='en'
    else locale='zh'
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }
}
export const config = { matcher: ['/((?!_next|api|.*\\.).*)'] }
