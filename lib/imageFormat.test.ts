import { describe, expect, it } from "vitest"
import { canvasToBmpBlob } from "./imageFormat"

describe("canvasToBmpBlob", () => {
  it("生成合法 BMP 文件头与像素", async () => {
    const data = new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 255])
    const fakeCanvas = {
      width: 2,
      height: 1,
      getContext: () => ({ getImageData: () => ({ data }) }),
    } as unknown as HTMLCanvasElement
    const blob = await canvasToBmpBlob(fakeCanvas)
    expect(blob.type).toBe("image/bmp")
    const buf = new Uint8Array(await blob.arrayBuffer())
    expect(buf[0]).toBe(0x42)
    expect(buf[1]).toBe(0x4d)
    expect(buf[26]).toBe(1)
    expect(buf[28]).toBe(24)
    expect(buf[54]).toBe(0)
    expect(buf[55]).toBe(0)
    expect(buf[56]).toBe(255)
    expect(buf[57]).toBe(255)
  })
})
