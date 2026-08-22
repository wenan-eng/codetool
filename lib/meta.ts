import type { Metadata } from "next"

export const SITE_URL = "https://www.codetool.site"
export const SITE_NAME = "CodeTool"
const SITE_LOCALES = ["zh", "en", "es"] as const
const OG_LOCALES: Record<string, string> = { zh: "zh_CN", en: "en_US", es: "es_ES" }
export const OG_IMAGE_PATH = "/og-default.png"
const OG_IMAGE_ALT = "CodeTool — Online Tools, Local & Free"

type PageMetaInput = {
  locale: string
  path?: string
  title: string
  description: string
}

export function buildPageMetadata({ locale, path = "", title, description }: PageMetaInput): Metadata {
  const seg = path ? `/${path}` : ""
  const canonical = `${SITE_URL}/${locale}${seg}`
  const languages: Record<string, string> = {}
  for (const l of SITE_LOCALES) languages[l] = `${SITE_URL}/${l}${seg}`
  languages["x-default"] = `${SITE_URL}/zh${seg}`
  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALES[locale] || locale,
      images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  }
}
