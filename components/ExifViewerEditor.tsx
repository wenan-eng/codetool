"use client"
import { useState } from "react"

interface ExifTag { name: string; value: string }

const TAG_NAMES: Record<number, string> = {
  0x010f: "相机制造商", 0x0110: "相机型号", 0x0112: "方向", 0x011a: "X分辨率", 0x011b: "Y分辨率",
  0x0128: "分辨率单位", 0x0131: "软件", 0x0132: "修改时间", 0x8769: "EXIF子IFD",
  0x829a: "曝光时间", 0x829d: "光圈值", 0x8827: "ISO感光度", 0x9003: "拍摄时间", 0x9004: "数字化时间",
  0x920a: "焦距", 0xa002: "图像宽度", 0xa003: "图像高度", 0xa405: "焦距(35mm)", 0xa434: "镜头型号",
}

export default function ExifViewerEditor({ locale = "zh" }: { locale?: string }) {
  const [tags, setTags] = useState<ExifTag[]>([])
  const [info, setInfo] = useState<{ type: string; size: string; w?: number; h?: number } | null>(null)
  const [error, setError] = useState("")

  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)
  const fmtSize = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`)

  const loadFile = async (file: File) => {
    setError(""); setTags([]); setInfo({ type: file.type || "unknown", size: fmtSize(file.size) })
    if (!/jpe?g/i.test(file.type)) {
      setError(t("本工具解析 JPEG 的 EXIF；PNG/WebP 等格式通常不含 EXIF。已显示基础信息。", "This tool reads JPEG EXIF; PNG/WebP usually have none. Basic info shown.", "Esta herramienta lee EXIF de JPEG; PNG/WebP no suelen tener. Info básica mostrada."))
      return
    }
    try {
      const buf = new DataView(await file.arrayBuffer())
      if (buf.getUint16(0) !== 0xffd8) throw new Error(t("不是标准 JPEG 文件", "Not a standard JPEG", "No es un JPEG estándar"))
      let offset = 2
      while (offset < buf.byteLength - 4) {
        if (buf.getUint8(offset) !== 0xff) { offset++; continue }
        const marker = buf.getUint8(offset + 1)
        const len = buf.getUint16(offset + 2)
        if (marker === 0xc0 || marker === 0xc2) {
          setInfo(prev => prev ? ({ ...prev, h: buf.getUint16(offset + 5), w: buf.getUint16(offset + 7) }) : prev)
        }
        if (marker === 0xe1 && offset + 10 < buf.byteLength &&
            buf.getUint32(offset + 4) === 0x45786966) {
          parseExif(buf, offset + 10)
          return
        }
        offset += 2 + len
      }
      setError(t("未找到 EXIF 数据（可能被社交平台剥离）", "No EXIF data found (may be stripped by platforms)", "Sin datos EXIF"))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const parseExif = (buf: DataView, start: number) => {
    const little = buf.getUint16(start) === 0x4949
    const get16 = (o: number) => buf.getUint16(o, little)
    const get32 = (o: number) => buf.getUint32(o, little)
    const ifdOffset = start + get32(start + 4)
    const out: ExifTag[] = []
    const readIfd = (ifd: number, depth: number) => {
      if (ifd <= 0 || ifd > buf.byteLength || depth > 2) return
      const count = get16(ifd)
      for (let i = 0; i < count && i < 200; i++) {
        const entry = ifd + 2 + i * 12
        const tag = get16(entry)
        const type = get16(entry + 2)
        const num = get32(entry + 4)
        if (tag === 0x8769) { readIfd(start + get32(entry + 8), depth + 1); continue }
        const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }
        const size = (sizes[type] ?? 1) * num
        const valOff = size > 4 ? start + get32(entry + 8) : entry + 8
        let value = ""
        if (type === 2) {
          let s = ""
          for (let j = 0; j < num - 1; j++) s += String.fromCharCode(get16(valOff + j))
          value = s.trim()
        } else if (type === 5 && num >= 1) {
          const n = get32(valOff), d = get32(valOff + 4)
          value = d ? `${n / d}` : "-"
        } else if (type === 10 && num >= 1) {
          value = `${buf.getInt32(valOff, little) / buf.getInt32(valOff + 4, little)}`
        } else if (type === 3) {
          value = String(get16(valOff))
        } else if (type === 4) {
          value = String(get32(valOff))
        } else continue
        const name = TAG_NAMES[tag] ?? `Tag 0x${tag.toString(16)}`
        if (value) out.push({ name, value })
      }
      const next = get32(ifd + 2 + count * 12)
      if (next) readIfd(start + next, depth + 1)
    }
    readIfd(ifdOffset, 0)
    setTags(out)
    if (!out.length) setError(t("EXIF 段存在但无可读标签", "EXIF segment present but no readable tags", "Segmento EXIF sin etiquetas legibles"))
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition text-sm text-gray-500 block">
        🔍 {t("上传照片查看 EXIF 元数据（本地解析，不上传）", "Upload a photo to inspect its EXIF (parsed locally)", "Suba una foto para ver su EXIF (local)")}
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
      </label>
      {error && <div className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-xl p-3">{error}</div>}
      {info && (
        <div className="bg-white border rounded-xl p-4 text-sm flex gap-6 text-gray-500">
          <span>{t("类型", "Type", "Tipo")}: {info.type}</span>
          <span>{t("大小", "Size", "Tamaño")}: {info.size}</span>
          {info.w && <span>{t("尺寸", "Dimensions", "Dimensiones")}: {info.w}×{info.h}</span>}
        </div>
      )}
      {tags.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {tags.map((tg, i) => (
                <tr key={`${tg.name}-${i}`} className="border-b last:border-0">
                  <td className="p-3 text-gray-500 w-44">{tg.name}</td>
                  <td className="p-3 font-mono text-xs break-all">{tg.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
