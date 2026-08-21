export type ImageFormat = "jpeg" | "png" | "webp" | "bmp"

export const MIME_MAP: Record<ImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  bmp: "image/bmp",
}

export function canvasToBmpBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const ctx = canvas.getContext("2d")
  if (!ctx) return Promise.reject(new Error("canvas unavailable"))
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  const rowSize = Math.ceil((width * 3) / 4) * 4
  const pixelArraySize = rowSize * height
  const fileSize = 54 + pixelArraySize
  const buf = new ArrayBuffer(fileSize)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)
  bytes[0] = 0x42; bytes[1] = 0x4d
  view.setUint32(2, fileSize, true)
  view.setUint32(10, 54, true)
  view.setUint32(14, 40, true)
  view.setInt32(18, width, true)
  view.setInt32(22, height, true)
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  view.setUint32(34, pixelArraySize, true)
  for (let y = 0; y < height; y++) {
    let off = 54 + (height - 1 - y) * rowSize
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      bytes[off++] = data[i + 2]
      bytes[off++] = data[i + 1]
      bytes[off++] = data[i]
    }
  }
  return Promise.resolve(new Blob([buf], { type: "image/bmp" }))
}

export async function convertImageCanvas(canvas: HTMLCanvasElement, format: ImageFormat, quality = 0.92): Promise<Blob> {
  if (format === "bmp") return canvasToBmpBlob(canvas)
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error(`当前浏览器不支持导出 ${format} 格式`))
    }, MIME_MAP[format], quality)
  })
}
