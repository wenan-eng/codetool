import { describe, expect, it } from "vitest"
import { embedLsb, extractLsb, lsbCapacity } from "./lsbCodec"

function fakeRgba(pixels: number): Uint8Array {
  const arr = new Uint8Array(pixels * 4)
  for (let i = 0; i < pixels; i++) {
    arr[i * 4] = (i * 37) % 256
    arr[i * 4 + 1] = (i * 91) % 256
    arr[i * 4 + 2] = (i * 53) % 256
    arr[i * 4 + 3] = 255
  }
  return arr
}

describe("lsbCodec", () => {
  it("容量计算为正且符合公式", () => {
    const rgba = fakeRgba(1000)
    expect(lsbCapacity(rgba)).toBe(Math.floor((1000 * 3) / 8) - 8)
  })

  it("中文文本往返一致", () => {
    const rgba = fakeRgba(5000)
    const stego = embedLsb(rgba, "你好，隐写世界 Hello!")
    expect(extractLsb(stego)).toBe("你好，隐写世界 Hello!")
  })

  it("空字符串往返", () => {
    const stego = embedLsb(fakeRgba(100), "")
    expect(extractLsb(stego)).toBe("")
  })

  it("alpha 通道不被修改", () => {
    const rgba = fakeRgba(2000)
    const stego = embedLsb(rgba, "secret")
    for (let i = 3; i < stego.length; i += 4) expect(stego[i]).toBe(255)
  })

  it("文字超容量报错", () => {
    expect(() => embedLsb(fakeRgba(10), "这一段文字远远超过了十个像素图片的容量限制")).toThrow(/容量/)
  })

  it("无隐写数据的图片报错", () => {
    expect(() => extractLsb(fakeRgba(5000))).toThrow(/未检测到/)
  })

  it("长度字段损坏时报错", () => {
    const stego = embedLsb(fakeRgba(5000), "ok")
    stego[40] ^= 0xff
    expect(() => extractLsb(stego)).toThrow()
  })
})
