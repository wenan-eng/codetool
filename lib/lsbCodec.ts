const MAGIC = [0x63, 0x74, 0x6c, 0x31]

export function lsbCapacity(rgba: Uint8Array): number {
  const usableBytes = Math.floor(rgba.length / 4) * 3
  return Math.floor(usableBytes / 8) - MAGIC.length - 4
}

function dataBitAt(payload: Uint8Array, bitIdx: number): number {
  return (payload[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1
}

export function embedLsb(rgba: Uint8Array, text: string): Uint8Array {
  const data = new TextEncoder().encode(text)
  if (data.length > 0xffffffff) throw new Error("文字过长")
  const header = new Uint8Array(MAGIC.length + 4)
  header.set(MAGIC, 0)
  new DataView(header.buffer).setUint32(MAGIC.length, data.length)
  const payload = new Uint8Array(header.length + data.length)
  payload.set(header, 0)
  payload.set(data, header.length)
  const totalBits = payload.length * 8
  const capacityBits = Math.floor(rgba.length / 4) * 3 * 8
  if (totalBits > capacityBits) throw new Error("文字过长，超出图片可隐藏容量")
  const out = rgba.slice()
  let bitIdx = 0
  for (let i = 0; i < out.length && bitIdx < totalBits; i++) {
    if (i % 4 === 3) continue
    out[i] = (out[i] & 0xfe) | dataBitAt(payload, bitIdx)
    bitIdx++
  }
  return out
}

export function extractLsb(rgba: Uint8Array): string {
  const usableBytes = Math.floor(rgba.length / 4) * 3
  const capacityBytes = Math.floor(usableBytes / 8)
  if (capacityBytes < MAGIC.length + 4) throw new Error("图片太小，无法包含隐写数据")
  const bits = new Uint8Array(usableBytes)
  let idx = 0
  for (let i = 0; i < rgba.length && idx < usableBytes; i++) {
    if (i % 4 === 3) continue
    bits[idx++] = rgba[i] & 1
  }
  const readByte = (off: number): number => {
    let b = 0
    for (let k = 0; k < 8; k++) b = (b << 1) | bits[off + k]
    return b
  }
  for (let i = 0; i < MAGIC.length; i++) {
    if (readByte(i * 8) !== MAGIC[i]) throw new Error("未检测到隐写数据：该图片可能未嵌入文字或已损坏")
  }
  const lenBytes = new Uint8Array(4)
  for (let i = 0; i < 4; i++) lenBytes[i] = readByte((MAGIC.length + i) * 8)
  const len = new DataView(lenBytes.buffer).getUint32(0)
  if (len > capacityBytes - MAGIC.length - 4) throw new Error("隐写数据长度非法，图片可能已损坏")
  const body = new Uint8Array(len)
  for (let i = 0; i < len; i++) body[i] = readByte((MAGIC.length + 4 + i) * 8)
  return new TextDecoder().decode(body)
}
