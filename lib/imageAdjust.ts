export interface AdjustParams {
  brightness?: number
  contrast?: number
  saturation?: number
  hue?: number
  lightness?: number
  temperature?: number
  highlight?: number
  fade?: number
  sharpenAmount?: number
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255, gg = g / 255, bb = b / 255
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
  else if (max === gg) h = ((bb - rr) / d + 2) / 6
  else h = ((rr - gg) / d + 4) / 6
  return [h * 360, s, l]
}

function hueToRgb(p: number, q: number, t: number): number {
  let tt = t
  if (tt < 0) tt += 1
  if (tt > 1) tt -= 1
  if (tt < 1 / 6) return p + (q - p) * 6 * tt
  if (tt < 1 / 2) return q
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
  return p
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l * 255, l * 255, l * 255]
  const hh = (((h % 360) + 360) % 360) / 360
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [hueToRgb(p, q, hh + 1 / 3) * 255, hueToRgb(p, q, hh) * 255, hueToRgb(p, q, hh - 1 / 3) * 255]
}

export function adjustPixels(src: Uint8ClampedArray, params: AdjustParams): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src)
  const {
    brightness = 0, contrast = 0, saturation = 0, hue = 0,
    lightness = 0, temperature = 0, highlight = 0, fade = 0,
  } = params
  const bFactor = 1 + brightness / 100
  const cFactor = (100 + contrast) / 100
  const sFactor = 1 + saturation / 100
  const tShift = (temperature / 100) * 40
  const hiBoost = highlight / 200
  const fadeMix = fade / 100
  for (let i = 0; i < out.length; i += 4) {
    let r = out[i], g = out[i + 1], b = out[i + 2]
    r *= bFactor; g *= bFactor; b *= bFactor
    r = (r - 128) * cFactor + 128
    g = (g - 128) * cFactor + 128
    b = (b - 128) * cFactor + 128
    if (saturation !== 0 || hue !== 0 || lightness !== 0) {
      const [h, s, l] = rgbToHsl(clamp(r), clamp(g), clamp(b))
      const ns = Math.max(0, Math.min(1, s * sFactor))
      const nl = Math.max(0, Math.min(1, l + lightness / 100))
      const nh = h + hue
      ;[r, g, b] = hslToRgb(nh, ns, nl)
    }
    if (temperature !== 0) {
      r += tShift
      b -= tShift
    }
    if (highlight !== 0) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      if (lum > 128) {
        const f = 1 + hiBoost * ((lum - 128) / 127)
        r *= f; g *= f; b *= f
      }
    }
    if (fadeMix > 0) {
      r += (255 - r) * fadeMix
      g += (255 - g) * fadeMix
      b += (255 - b) * fadeMix
    }
    out[i] = clamp(r); out[i + 1] = clamp(g); out[i + 2] = clamp(b)
  }
  return out
}

export function sharpen(src: Uint8ClampedArray, width: number, height: number, amount: number): Uint8ClampedArray {
  const k = amount / 100
  const out = new Uint8ClampedArray(src)
  const kernel = [0, -k, 0, -k, 1 + 4 * k, -k, 0, -k, 0]
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let ch = 0; ch < 3; ch++) {
        let sum = 0
        let ki = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            sum += src[((y + ky) * width + (x + kx)) * 4 + ch] * kernel[ki++]
          }
        }
        out[(y * width + x) * 4 + ch] = clamp(sum)
      }
    }
  }
  return out
}

export function boxBlur(src: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src)
  const r = Math.max(0, Math.round(radius))
  if (r === 0) return out
  const win = r * 2 + 1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sr = 0, sg = 0, sb = 0, sa = 0, count = 0
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= height) continue
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= width) continue
          const idx = (yy * width + xx) * 4
          sr += src[idx]; sg += src[idx + 1]; sb += src[idx + 2]; sa += src[idx + 3]
          count++
        }
      }
      const idx = (y * width + x) * 4
      out[idx] = sr / count; out[idx + 1] = sg / count; out[idx + 2] = sb / count; out[idx + 3] = sa / count
    }
  }
  return out
}
