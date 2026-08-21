"use client"
import TextRadixEditor from "./TextRadixEditor"

export default function TextOctalEditor({ locale = "zh" }: { locale?: string }) {
  return <TextRadixEditor radix={8} locale={locale} />
}
