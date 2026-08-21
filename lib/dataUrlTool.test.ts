import { describe, expect, it } from "vitest"
import { parseDataUrl, formatFileSize, sniffMime, extFromMime } from "./dataUrlTool"

describe("parseDataUrl", () => {
  it("解析标准图片 dataURL", () => {
    const png1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    const r = parseDataUrl(`data:image/png;base64,${png1x1}`)
    expect(r.mime).toBe("image/png")
    expect(r.size).toBeGreaterThan(0)
    expect(r.bytes[0]).toBe(0x89)
  })

  it("解析裸 base64 并嗅探 PNG 类型", () => {
    const png1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    const r = parseDataUrl(png1x1)
    expect(r.mime).toBe("image/png")
  })

  it("容忍 URL-Safe 字符与空白", () => {
    const r = parseDataUrl("data:text/plain;base64,aGVs\nbG8=")
    expect(new TextDecoder().decode(r.bytes)).toBe("hello")
  })

  it("空输入报错", () => {
    expect(() => parseDataUrl("")).toThrow("输入为空")
  })

  it("非法 base64 报错", () => {
    expect(() => parseDataUrl("data:image/png;base64,@@@")).toThrow()
    expect(() => parseDataUrl("不是base64!!!")).toThrow(/无法识别/)
  })

  it("非 base64 的 dataURL 报错", () => {
    expect(() => parseDataUrl("data:text/html,<h1>hi</h1>")).toThrow(/仅支持 base64/)
  })
})

describe("sniffMime / formatFileSize / extFromMime", () => {
  it("JPEG 魔数", () => {
    expect(sniffMime(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg")
  })
  it("未知字节回退 octet-stream", () => {
    expect(sniffMime(new Uint8Array([1, 2, 3, 4]))).toBe("application/octet-stream")
  })
  it("文件大小格式化边界", () => {
    expect(formatFileSize(0)).toBe("0 B")
    expect(formatFileSize(1023)).toBe("1023 B")
    expect(formatFileSize(1024)).toBe("1.00 KB")
    expect(formatFileSize(1024 * 1024)).toBe("1.00 MB")
    expect(formatFileSize(-1)).toBe("-")
  })
  it("扩展名映射", () => {
    expect(extFromMime("image/png")).toBe(".png")
    expect(extFromMime("foo/bar")).toBe("")
  })
})
