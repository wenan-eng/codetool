"use client"
import { useState, useRef, useEffect } from "react"
import { parseData, getChartConfig, getChartSample, type ParsedData, type ChartConfig } from "@/lib/chartTool"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

const messagesMap: Record<string, any> = { zh, en, es }

const CHART_TYPES = [
  "line-chart",
  "bar-chart",
  "pie-chart",
  "horizontal-bar-chart",
  "area-chart",
  "doughnut-chart",
  "scatter-chart",
  "radar-chart",
  "histogram-chart",
  "multi-line-chart",
  "stacked-area-chart",
  "waterfall-chart",
] as const

type Props = {
  chartType?: string
  toolId?: string
  type?: string
  locale?: string
}

const PALETTE = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1","#84cc16"]

function SimpleSvgPreview({ chartType, data }: { chartType: string; data: ParsedData }) {
  const width = 560
  const height = 300
  const pad = { t: 20, r: 20, b: 32, l: 48 }
  const w = width - pad.l - pad.r
  const h = height - pad.t - pad.b

  if (!data.labels.length && !data.points?.length) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed text-sm text-gray-400">
        暂无数据 · 输入后点击生成
      </div>
    )
  }

  // Pie / Doughnut
  if (chartType === "pie-chart" || chartType === "doughnut-chart") {
    const total = data.values.reduce((a, b) => a + b, 0) || 1
    let acc = 0
    const cx = width / 2
    const cy = height / 2
    const r = Math.min(w, h) / 2 - 10
    const innerR = chartType === "doughnut-chart" ? r * 0.55 : 0
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px] bg-white rounded-lg border">
        {data.labels.map((label, i) => {
          const v = data.values[i] ?? 0
          const startAngle = (acc / total) * Math.PI * 2 - Math.PI / 2
          acc += v
          const endAngle = (acc / total) * Math.PI * 2 - Math.PI / 2
          const large = endAngle - startAngle > Math.PI ? 1 : 0
          const x1 = cx + Math.cos(startAngle) * r
          const y1 = cy + Math.sin(startAngle) * r
          const x2 = cx + Math.cos(endAngle) * r
          const y2 = cy + Math.sin(endAngle) * r
          const x3 = cx + Math.cos(endAngle) * innerR
          const y3 = cy + Math.sin(endAngle) * innerR
          const x4 = cx + Math.cos(startAngle) * innerR
          const y4 = cy + Math.sin(startAngle) * innerR
          const d = innerR > 0
            ? `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`
            : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
          return <path key={label} d={d} fill={PALETTE[i % PALETTE.length]} stroke="#fff" strokeWidth={1.5} />
        })}
        {data.labels.map((label, i) => {
          const pct = ((data.values[i] / total) * 100).toFixed(1)
          return (
            <g key={`legend-${label}`}>
              <rect x={10 + (i % 3) * 180} y={height - 18 + Math.floor(i / 3) * 14} width={8} height={8} rx={2} fill={PALETTE[i % PALETTE.length]} />
              <text x={22 + (i % 3) * 180} y={height - 11 + Math.floor(i / 3) * 14} fontSize={10} fill="#374151">
                {label} {pct}%
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  // Scatter
  if (chartType === "scatter-chart") {
    const pts = data.points ?? data.values.map((y, i) => ({ x: i, y }))
    const xs = pts.map((p) => p.x)
    const ys = pts.map((p) => p.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs) || 1
    const minY = Math.min(...ys), maxY = Math.max(...ys) || 1
    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1
    const toX = (x: number) => pad.l + ((x - minX) / rangeX) * w
    const toY = (y: number) => pad.t + h - ((y - minY) / rangeY) * h
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px] bg-white rounded-lg border">
        {/* grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={pad.l} y1={pad.t + (i * h) / 4} x2={pad.l + w} y2={pad.t + (i * h) / 4} stroke="#f3f4f6" strokeWidth={1} />
            <line x1={pad.l + (i * w) / 4} y1={pad.t} x2={pad.l + (i * w) / 4} y2={pad.t + h} stroke="#f3f4f6" strokeWidth={1} />
          </g>
        ))}
        <rect x={pad.l} y={pad.t} width={w} height={h} fill="none" stroke="#e5e7eb" />
        {pts.map((p, i) => (
          <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={5} fill={PALETTE[0]} stroke="#fff" strokeWidth={1.5} />
        ))}
        {/* axes labels */}
        <text x={pad.l} y={height - 6} fontSize={10} fill="#6b7280">X</text>
        <text x={6} y={pad.t + 10} fontSize={10} fill="#6b7280">Y</text>
      </svg>
    )
  }

  // Radar
  if (chartType === "radar-chart") {
    const cx = width / 2
    const cy = height / 2 - 6
    const r = Math.min(w, h) / 2 - 18
    const n = data.labels.length || 5
    const maxV = Math.max(...data.values, 1)
    const angleStep = (Math.PI * 2) / n
    const toPt = (idx: number, val: number, radius = r) => {
      const ratio = maxV === 0 ? 0 : val / maxV
      const ang = angleStep * idx - Math.PI / 2
      return [cx + Math.cos(ang) * radius * ratio, cy + Math.sin(ang) * radius * ratio] as const
    }
    // grid polygons
    const gridLevels = [0.25, 0.5, 0.75, 1]
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px] bg-white rounded-lg border">
        {gridLevels.map((lvl, gi) => (
          <polygon
            key={gi}
            points={Array.from({ length: n }, (_, i) => toPt(i, maxV, r * lvl).join(",")).join(" ")}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = toPt(i, maxV, r)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" />
        })}
        {/* datasets */}
        {(() => {
          const datasets = data.datasets ?? [{ label: "Value", data: data.values }]
          return datasets.map((ds, di) => {
            const pts = ds.data.map((v, i) => toPt(i, v).join(",")).join(" ")
            return <polygon key={di} points={pts} fill={PALETTE[di % PALETTE.length] + "33"} stroke={PALETTE[di % PALETTE.length]} strokeWidth={2} />
          })
        })()}
        {data.labels.map((lab, i) => {
          const [x, y] = toPt(i, maxV, r + 14)
          return (
            <text key={lab} x={x} y={y} fontSize={10} textAnchor="middle" dominantBaseline="middle" fill="#374151">
              {lab}
            </text>
          )
        })}
      </svg>
    )
  }

  // Line / Area / Multi / Stacked / Histogram / Bar / Horizontal / Waterfall
  const isHorizontal = chartType === "horizontal-bar-chart"
  const isLineLike = ["line-chart", "area-chart", "multi-line-chart", "stacked-area-chart"].includes(chartType)
  const isStacked = chartType === "stacked-area-chart"
  const maxVal = Math.max(...(data.datasets ? data.datasets.flatMap((d) => d.data) : data.values), 0) || 1
  // For stacked we need stacked max
  let stackedMax = 0
  if (isStacked && data.datasets) {
    for (let idx = 0; idx < data.labels.length; idx++) {
      let sum = 0
      for (const ds of data.datasets) sum += ds.data[idx] ?? 0
      if (sum > stackedMax) stackedMax = sum
    }
  }
  const effectiveMax = isStacked ? stackedMax || maxVal : maxVal
  const yMax = effectiveMax * 1.15
  const toY = (v: number) => pad.t + h - (v / yMax) * h

  if (isLineLike) {
    const datasets = data.datasets ?? [{ label: "Value", data: data.values }]
    const xStep = w / Math.max(1, data.labels.length - 1)
    const toX = (i: number) => pad.l + i * xStep
    // For stacked area we need to compute stacked baseline per index
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px] bg-white rounded-lg border">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={pad.l} y1={pad.t + (i * h) / 4} x2={pad.l + w} y2={pad.t + (i * h) / 4} stroke="#f3f4f6" />
        ))}
        <rect x={pad.l} y={pad.t} width={w} height={h} fill="none" stroke="#e5e7eb" />
        {datasets.map((ds, di) => {
          // For stacked we compute cumulative per point for area polygon base
          let pathD = ""
          let areaD = ""
          if (isStacked) {
            // build upper and lower paths
            const upper: string[] = []
            const lower: string[] = []
            for (let i = 0; i < data.labels.length; i++) {
              let cumUp = 0, cumLow = 0
              for (let k = 0; k <= di; k++) cumUp += datasets[k].data[i] ?? 0
              for (let k = 0; k < di; k++) cumLow += datasets[k].data[i] ?? 0
              upper.push(`${toX(i)},${toY(cumUp)}`)
              lower.unshift(`${toX(i)},${toY(cumLow)}`)
            }
            const poly = [...upper, ...lower].join(" ")
            return <polygon key={di} points={poly} fill={PALETTE[di % PALETTE.length] + "55"} stroke={PALETTE[di % PALETTE.length]} strokeWidth={2} />
          } else {
            const points = ds.data.map((v, i) => `${toX(i)},${toY(v)}`).join(" ")
            const isArea = chartType === "area-chart"
            if (isArea) {
              const base = `${toX(ds.data.length - 1)},${pad.t + h} ${toX(0)},${pad.t + h}`
              return (
                <g key={di}>
                  <polygon points={`${points} ${base}`} fill={PALETTE[di % PALETTE.length] + "33"} stroke="none" />
                  <polyline points={points} fill="none" stroke={PALETTE[di % PALETTE.length]} strokeWidth={2} strokeLinejoin="round" />
                  {ds.data.map((v, i) => (
                    <circle key={i} cx={toX(i)} cy={toY(v)} r={3.5} fill={PALETTE[di % PALETTE.length]} stroke="#fff" strokeWidth={1.5} />
                  ))}
                </g>
              )
            }
            return (
              <g key={di}>
                <polyline points={points} fill="none" stroke={PALETTE[di % PALETTE.length]} strokeWidth={2} strokeLinejoin="round" />
                {ds.data.map((v, i) => (
                  <circle key={i} cx={toX(i)} cy={toY(v)} r={3.5} fill={PALETTE[di % PALETTE.length]} stroke="#fff" strokeWidth={1.5} />
                ))}
              </g>
            )
          }
        })}
        {/* X labels */}
        {data.labels.map((lb, i) => (
          <text key={lb + i} x={pad.l + i * xStep} y={pad.t + h + 14} fontSize={10} textAnchor="middle" fill="#6b7280">
            {lb}
          </text>
        ))}
        {/* Y ticks */}
        {[0, 1, 2, 3, 4].map((i) => {
          const v = Math.round((yMax * (4 - i)) / 4)
          return (
            <text key={i} x={pad.l - 8} y={pad.t + (i * h) / 4 + 3} fontSize={10} textAnchor="end" fill="#9ca3af">
              {v}
            </text>
          )
        })}
      </svg>
    )
  }

  // Bar-like: bar, histogram, waterfall, horizontal
  if (isHorizontal) {
    const barH = h / Math.max(1, data.labels.length) * 0.62
    const gap = h / Math.max(1, data.labels.length) * 0.38
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px] bg-white rounded-lg border">
        <rect x={pad.l} y={pad.t} width={w} height={h} fill="none" stroke="#e5e7eb" />
        {data.labels.map((lb, i) => {
          const val = data.values[i] ?? 0
          const barW = (val / yMax) * w
          const y = pad.t + i * (barH + gap) + gap / 2
          return (
            <g key={lb + i}>
              <rect x={pad.l} y={y} width={barW} height={barH} rx={3} fill={PALETTE[i % PALETTE.length]} />
              <text x={pad.l + barW + 6} y={y + barH / 2 + 3} fontSize={11} fill="#374151">{val}</text>
              <text x={pad.l - 8} y={y + barH / 2 + 3} fontSize={11} textAnchor="end" fill="#6b7280">{lb}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  // Vertical bar / histogram / waterfall
  const isWaterfall = chartType === "waterfall-chart"
  const n = data.labels.length
  const barW = (w / Math.max(1, n)) * (chartType === "histogram-chart" ? 0.98 : 0.55)
  const gapW = (w / Math.max(1, n)) - barW
  // compute waterfall floating positions
  let cumulative = 0
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px] bg-white rounded-lg border">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={pad.l} y1={pad.t + (i * h) / 4} x2={pad.l + w} y2={pad.t + (i * h) / 4} stroke="#f3f4f6" />
      ))}
      <rect x={pad.l} y={pad.t} width={w} height={h} fill="none" stroke="#e5e7eb" />
      {data.labels.map((lb, i) => {
        const val = data.values[i] ?? 0
        let x = pad.l + i * (barW + gapW) + gapW / 2
        let y: number, bh: number, color: string
        if (isWaterfall) {
          const start = cumulative
          const end = cumulative + val
          const topVal = Math.max(start, end)
          const botVal = Math.min(start, end)
          y = toY(topVal)
          bh = Math.abs(toY(botVal) - toY(topVal))
          color = val >= 0 ? PALETTE[1] : PALETTE[3]
          // handle total bar
          const isTotal = lb.toLowerCase().includes("total")
          if (isTotal) {
            y = toY(Math.max(0, end))
            bh = Math.abs(toY(0) - toY(end))
            color = PALETTE[4]
          }
          cumulative = isTotal ? end : end
        } else {
          y = toY(val)
          bh = pad.t + h - y
          color = PALETTE[i % PALETTE.length]
          if (chartType === "histogram-chart") color = PALETTE[0]
        }
        return (
          <g key={lb + i}>
            <rect x={x} y={y} width={barW} height={Math.max(1, bh)} rx={3} fill={color} stroke={color} />
            <text x={x + barW / 2} y={y - 6} fontSize={10} textAnchor="middle" fill="#374151">{val}</text>
            <text x={x + barW / 2} y={pad.t + h + 14} fontSize={10} textAnchor="middle" fill="#6b7280">{lb}</text>
          </g>
        )
      })}
      {[0, 1, 2, 3, 4].map((i) => {
        const v = Math.round((yMax * (4 - i)) / 4)
        return (
          <text key={i} x={pad.l - 8} y={pad.t + (i * h) / 4 + 3} fontSize={10} textAnchor="end" fill="#9ca3af">
            {v}
          </text>
        )
      })}
    </svg>
  )
}

export default function ChartEditor({ chartType, toolId, type, locale = "zh" }: Props) {
  const resolvedType = chartType ?? toolId ?? type ?? "bar-chart"
  const dict = (messagesMap[locale] || zh) as any
  const generic = dict.chartEditor || dict.chart || {}
  const perTool = dict[resolvedType] || {}
  // fallback messages
  const msgs = {
    generate: perTool.generate || generic.generate || (locale === "en" ? "Generate Chart" : locale === "es" ? "Generar gráfico" : "生成图表"),
    sample: perTool.sample || generic.sample || dict.editor?.sample || (locale === "en" ? "Load Sample" : locale === "es" ? "Ver ejemplo" : "查看示例"),
    copy: perTool.copy || generic.copy || (locale === "en" ? "Copy Config" : locale === "es" ? "Copiar config" : "复制配置"),
    copySvg: locale === "en" ? "Copy SVG" : locale === "es" ? "Copiar SVG" : "复制 SVG",
    clear: perTool.clear || generic.clear || (locale === "en" ? "Clear" : locale === "es" ? "Limpiar" : "清空数据"),
    copied: generic.copied || dict.editor?.copied || (locale === "en" ? "Copied" : locale === "es" ? "Copiado" : "已复制"),
    inputLabel: perTool.inputLabel || generic.inputLabel || (locale === "en" ? "Data Input (label,value per line)" : locale === "es" ? "Datos (etiqueta,valor por línea)" : "数据输入（每行 标签,数值）"),
    configLabel: perTool.configLabel || generic.configLabel || (locale === "en" ? "Chart Config (JSON)" : locale === "es" ? "Config JSON" : "图表配置（JSON）"),
    previewLabel: perTool.previewLabel || generic.previewLabel || (locale === "en" ? "Preview" : locale === "es" ? "Vista previa" : "预览"),
    placeholder: perTool.placeholder || generic.placeholder || getChartSample(resolvedType as any),
    localNote: perTool.localNote || generic.localNote || dict.editor?.localNote || (locale === "en" ? "All processing is done locally, no upload. Chart.js not required; SVG fallback ensures preview always works." : locale === "es" ? "Todo se procesa localmente, sin subida." : "所有操作均在浏览器本地完成，不上传数据。未安装 Chart.js 时使用 SVG 兜底保证预览可用。"),
    download: locale === "en" ? "Download SVG" : locale === "es" ? "Descargar SVG" : "下载 SVG",
    withHeaderHint: locale === "en" ? "Supports header row like: label,value or Month,Sales,Profit for multi-series" : locale === "es" ? "Soporta cabecera como label,value o Month,Sales,Profit" : "支持表头，如 label,value 或 Month,Sales,Profit 多系列",
  }

  const [input, setInput] = useState("")
  const [configStr, setConfigStr] = useState("")
  const [parsed, setParsed] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedSvg, setCopiedSvg] = useState(false)
  const [canvasSupported, setCanvasSupported] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const configRef = useRef<ChartConfig | null>(null)

  // Try to load chart.js dynamically if available; failure is fine (fallback to SVG)
  useEffect(() => {
    let cancelled = false
    if (typeof window !== "undefined") {
      // Use webpackIgnore so build does not fail when chart.js is not installed
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      import(/* webpackIgnore: true */ "chart.js/auto")
        .then((mod: any) => {
          if (!cancelled) setCanvasSupported(true)
        })
        .catch(() => {
          if (!cancelled) setCanvasSupported(false)
        })
    }
    return () => {
      cancelled = true
    }
  }, [])

  // Render canvas if chart.js available and config exists
  useEffect(() => {
    if (!canvasSupported || !canvasRef.current || !configRef.current) return
    let chart: any
    let cancelled = false
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import(/* webpackIgnore: true */ "chart.js/auto")
      .then(({ Chart }: any) => {
        if (cancelled || !canvasRef.current || !configRef.current) return
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return
        const existing = (canvasRef.current as any)._chart
        if (existing) existing.destroy()
        chart = new Chart(ctx, configRef.current as any)
        ;(canvasRef.current as any)._chart = chart
      })
      .catch(() => {})
    return () => {
      cancelled = true
      if (chart) chart.destroy()
    }
  }, [canvasSupported, configStr])

  const handleGenerate = () => {
    if (!input.trim()) {
      setError(locale === "en" ? "Please enter data" : locale === "es" ? "Ingrese datos" : "请输入数据")
      return
    }
    try {
      const data = parseData(input)
      if (!data.labels.length && !data.points?.length) throw new Error(locale === "en" ? "No valid data parsed" : locale === "es" ? "No se pudo analizar" : "未解析到有效数据，请检查格式如：Jan,100")
      const cfg = getChartConfig(resolvedType, data)
      configRef.current = cfg
      setParsed(data)
      setConfigStr(JSON.stringify(cfg, null, 2))
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSample = () => {
    const sample = getChartSample(resolvedType as any)
    setInput(sample)
    setError(null)
    // auto generate after sample
    try {
      const data = parseData(sample)
      const cfg = getChartConfig(resolvedType, data)
      configRef.current = cfg
      setParsed(data)
      setConfigStr(JSON.stringify(cfg, null, 2))
    } catch {}
  }

  const handleCopy = async () => {
    if (!configStr) return
    await navigator.clipboard.writeText(configStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleClear = () => {
    setInput("")
    setConfigStr("")
    setParsed(null)
    setError(null)
    configRef.current = null
    const c = canvasRef.current as any
    if (c && c._chart) {
      c._chart.destroy()
      c._chart = null
    }
  }

  const handleDownloadSvg = () => {
    const svgEl = document.querySelector(`[data-chart-svg="${resolvedType}"] svg`) as SVGElement | null
    if (!svgEl) return
    const clone = svgEl.cloneNode(true) as SVGElement
    // ensure xmlns
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    const serializer = new XMLSerializer()
    let source = serializer.serializeToString(clone)
    if (!source.match(/^<\?xml/)) source = '<?xml version="1.0" standalone="no"?>\r\n' + source
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resolvedType}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopySvg = async () => {
    const svgEl = document.querySelector(`[data-chart-svg="${resolvedType}"] svg`) as SVGElement | null
    if (!svgEl) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svgEl)
    await navigator.clipboard.writeText(source)
    setCopiedSvg(true)
    setTimeout(() => setCopiedSvg(false), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
          <button onClick={handleGenerate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            {msgs.generate}
          </button>
          <button onClick={handleSample} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border bg-white rounded-lg">
            {msgs.sample}
          </button>
          <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {copied ? msgs.copied : msgs.copy}
          </button>
          <button onClick={handleCopySvg} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {copiedSvg ? msgs.copied : msgs.copySvg}
          </button>
          <button onClick={handleDownloadSvg} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
            {msgs.download}
          </button>
          <button onClick={handleClear} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">
            {msgs.clear}
          </button>
          <span className="ml-auto text-xs text-gray-400 self-center hidden md:inline">{msgs.withHeaderHint}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative border-r flex flex-col">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between">
              <span>{msgs.inputLabel}</span>
              {input && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{input.split("\n").filter(Boolean).length} 行</span>}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={msgs.placeholder}
              className="w-full h-[320px] p-4 font-mono text-sm resize-none focus:outline-none"
            />
            <div className="px-3 py-1.5 text-[11px] text-gray-400 border-t bg-gray-50/50">{msgs.withHeaderHint}</div>
          </div>

          <div className="relative flex flex-col bg-gray-50/30">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b flex justify-between">
              <span>{msgs.configLabel}</span>
              {configStr && <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded">{configStr.split("\n").length} 行</span>}
            </div>
            <textarea
              value={configStr}
              onChange={(e) => setConfigStr(e.target.value)}
              placeholder={locale === "en" ? "Click Generate to see chart config JSON" : locale === "es" ? "Haga clic en Generar" : "点击“生成图表”查看配置 JSON"}
              className="w-full h-[320px] p-4 font-mono text-xs resize-none focus:outline-none bg-white"
              readOnly={false}
            />
          </div>
        </div>

        {error && <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-200"> {error}</div>}
        <div className="px-4 py-2 text-xs text-gray-400 border-t">{msgs.localNote}</div>
      </div>

      {/* Preview area */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">{msgs.previewLabel} · {resolvedType}</h3>
          <span className="text-xs text-gray-400">{canvasSupported ? "Chart.js Canvas + SVG fallback" : "SVG preview (Chart.js not installed, JSON config available)"}</span>
        </div>

        <div className="p-4 space-y-4">
          {/* SVG fallback always shown */}
          <div data-chart-svg={resolvedType}>
            {parsed ? <SimpleSvgPreview chartType={resolvedType} data={parsed} /> : (
              <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed text-sm text-gray-400 gap-2">
                <div>📊</div>
                <div>{locale === "en" ? "Enter data above and click Generate to preview" : locale === "es" ? "Ingrese datos y haga clic en Generar" : "在上方输入数据并点击“生成图表”以预览"}</div>
                <div className="text-xs text-gray-300">支持 label,value 多行 / CSV / JSON</div>
              </div>
            )}
          </div>

          {/* Canvas for chart.js if available */}
          <div className={canvasSupported ? "block" : "hidden"}>
            <div className="text-xs text-gray-500 mb-2">Canvas (Chart.js) {canvasSupported ? "ready" : "unavailable – SVG preview above is fallback"}</div>
            <div className="w-full h-[320px] bg-white rounded-lg border p-2">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
          </div>

          {/* If we have config but no canvas, show hint */}
          {!canvasSupported && configStr && (
            <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
              {locale === "en" ? "Tip: Install chart.js (npm i chart.js) to enable Canvas rendering. SVG preview above works without any dependency." : locale === "es" ? "Consejo: Instale chart.js para habilitar Canvas. La vista SVG funciona sin dependencia." : "提示：安装 chart.js（npm i chart.js）可启用 Canvas 渲染；当前 SVG 预览无需任何依赖即可工作。"}
              <div className="mt-1 font-mono text-[11px] text-gray-600">npm i chart.js</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
