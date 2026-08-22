import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const src = readFileSync('components/AdSlot.tsx', 'utf-8')

describe('AdSlot', () => {
  it('has 3 slots', () => {
    expect(src).toContain('top'); expect(src).toContain('editor-bottom'); expect(src).toContain('faq-middle')
    expect(src).toContain('adsbygoogle')
  })

  it('wraps each slot with id-based wrapper for CLS guard', () => {
    expect(src).toContain('id={`ad-wrapper-${slot}`}')
    expect(src).toContain('#ad-wrapper-${slot}')
  })

  it('reserves min-height per slot: top=110, editor-bottom=280, faq-middle=280', () => {
    const cfg = Object.fromEntries(
      [...src.matchAll(/'([a-z-]+)':\s*\{\s*minHeight:\s*(\d+)\s*\}/g)].map(m => [m[1], Number(m[2])])
    )
    expect(cfg['top']).toBe(110)
    expect(cfg['editor-bottom']).toBe(280)
    expect(cfg['faq-middle']).toBe(280)
    expect(src).toMatch(/width:\s*'100%'/)
    expect(src).toMatch(/overflow:\s*'hidden'/)
  })

  it('shows low-contrast placeholder text while ad is empty/loading', () => {
    expect(src).toContain('广告 ADVERTISEMENT')
    expect(src).toContain('bg-gray-50')
    const m = src.match(/fontSize:\s*'?(\d+)px/)
    expect(m && Number(m[1])).toBeLessThan(12)
  })

  it('keeps data-slot / ins.adsbygoogle structure and push logic', () => {
    expect(src).toContain('<ins className="adsbygoogle"')
    expect(src).toContain('data-ad-client="ca-pub-4188363142718866"')
    expect(src).toContain('data-slot={slot}')
    expect(src).toContain('(window.adsbygoogle = window.adsbygoogle || []).push({})')
  })
})
