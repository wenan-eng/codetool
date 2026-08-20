import { readFileSync } from 'fs'
import { describe, it, expect } from 'vitest'
describe('layout adsense', () => {
  it('contains ca-pub-4188363142718866', () => {
    const html = readFileSync('app/layout.tsx','utf-8')
    expect(html).toContain('ca-pub-4188363142718866')
    expect(html).toContain('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
    expect(html).toContain('crossorigin="anonymous"')
  })
})
