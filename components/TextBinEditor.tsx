"use client"
import TextRadixEditor from "./TextRadixEditor"

export default function TextBinEditor({ locale = "zh" }: { locale?: string }) {
  return <TextRadixEditor radix={2} locale={locale} />
}
