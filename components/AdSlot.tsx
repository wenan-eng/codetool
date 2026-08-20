"use client"
import { useEffect } from "react"
type Props = { slot: 'top' | 'editor-bottom' | 'faq-middle', className?: string }
const slotConfig = {
  'top': { style: { minHeight: 90 }, label: '顶部横幅 728x90' },
  'editor-bottom': { style: { minHeight: 280 }, label: '编辑器下方 336x280' },
  'faq-middle': { style: { minHeight: 250 }, label: 'FAQ中间' },
}
export default function AdSlot({ slot, className }: Props) {
  useEffect(() => {
    try { // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div className={`bg-white border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 ${className || ''}`} style={slotConfig[slot].style}>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-4188363142718866" data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"></ins>
      <span className="absolute text-[10px]">{slotConfig[slot].label} - AdSense</span>
    </div>
  )
}
