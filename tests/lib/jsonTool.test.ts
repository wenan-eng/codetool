import { describe, it, expect } from 'vitest'
import { beautify, compress, validate } from '@/lib/jsonTool'
describe('jsonTool', () => {
  it('beautify', () => { expect(beautify('{"a":1,"b":[2,3]}')).toContain('\n') })
  it('compress', () => { expect(compress('{\n  "a": 1\n}')).toBe('{"a":1}') })
  it('validate ok', () => { expect(validate('{"a":1}').ok).toBe(true) })
  it('validate fail', () => { expect(validate('{"a":}').ok).toBe(false); expect(validate('{"a":}').error).toContain('Unexpected') })
  it('beautify throws on invalid', () => { expect(() => beautify('invalid')).toThrow() })
})
