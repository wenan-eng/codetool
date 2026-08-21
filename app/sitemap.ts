import tools from "@/config/tools.json"
import { locales } from "@/i18n"
export default function sitemap(){
  const base='https://codetool.site'
  const now = new Date()
  const entries: any[] = []
  for(const locale of locales){
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      alternates: { languages: Object.fromEntries(locales.map(l=>[l, `${base}/${l}`])) }
    })
    for(const c of ['code','encode','text','unit','image']){
      entries.push({
        url: `${base}/${locale}/${c}`,
        lastModified: now,
        alternates: { languages: Object.fromEntries(locales.map(l=>[l, `${base}/${l}/${c}`])) }
      })
    }
    for(const t of tools){
      entries.push({
        url: `${base}/${locale}/${t.id}`,
        lastModified: now,
        alternates: { languages: Object.fromEntries(locales.map(l=>[l, `${base}/${l}/${t.id}`])) }
      })
    }
    // static pages: privacy, about, contact, terms
    for(const p of ['privacy','about','contact','terms']){
      entries.push({
        url: `${base}/${locale}/${p}`,
        lastModified: now,
        alternates: { languages: Object.fromEntries(locales.map(l=>[l, `${base}/${l}/${p}`])) }
      })
    }
  }
  return entries
}
