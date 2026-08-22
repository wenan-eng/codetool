"use client"
import { useEffect } from "react"
type Props = { slot: 'top' | 'editor-bottom' | 'faq-middle', className?: string }
const slotConfig = {
  'top': { minHeight: 110 },
  'editor-bottom': { minHeight: 280 },
  'faq-middle': { minHeight: 280 },
}
export default function AdSlot({ slot, className }: Props) {
  const minHeight = slotConfig[slot].minHeight
  useEffect(() => {
    try { // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div id={`ad-wrapper-${slot}`} className={className} style={{ width: '100%', overflow: 'hidden', position: 'relative', minHeight }}>
      <style dangerouslySetInnerHTML={{ __html: `#ad-wrapper-${slot}{min-height:${minHeight}px !important;width:100% !important;overflow:hidden;}` }} />
      <span aria-hidden="true" className="bg-gray-50" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#9ca3af', letterSpacing: '0.08em', pointerEvents: 'none' }}>广告 ADVERTISEMENT</span>
      <div data-slot={slot} style={{ position: 'relative', zIndex: 1, minHeight }}>
        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-4188363142718866" data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"></ins>
      </div>
    </div>
  )
}
