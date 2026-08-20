export const locales = ['zh','en','es'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'zh'
export const localeNames: Record<Locale,string> = { zh: '中文', en: 'English', es: 'Español' }
export function isValidLocale(l: string): l is Locale { return (locales as readonly string[]).includes(l) }
