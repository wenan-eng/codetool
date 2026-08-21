"use client"
import TextRadixEditor from "./TextRadixEditor"

export default function TextHexEditor({ locale = "zh" }: { locale?: string }) {
  return <TextRadixEditor radix={16} locale={locale} />
}
