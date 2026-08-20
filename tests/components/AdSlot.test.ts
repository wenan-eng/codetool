import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
describe('AdSlot', () => {
  it('has 3 slots', () => {
    const s = readFileSync('components/AdSlot.tsx','utf-8')
    expect(s).toContain('top'); expect(s).toContain('editor-bottom'); expect(s).toContain('faq-middle')
    expect(s).toContain('adsbygoogle')
  })
})
