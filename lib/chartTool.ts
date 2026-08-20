/**
 * Chart helpers: parseData(input) -> ParsedData, getChartConfig(type, data) -> Chart.js config
 * Supports 12 chart types: line-chart, bar-chart, pie-chart, horizontal-bar-chart,
 * area-chart, doughnut-chart, scatter-chart, radar-chart, histogram-chart,
 * multi-line-chart, stacked-area-chart, waterfall-chart
 */

export type ChartType =
  | "line-chart"
  | "bar-chart"
  | "pie-chart"
  | "horizontal-bar-chart"
  | "area-chart"
  | "doughnut-chart"
  | "scatter-chart"
  | "radar-chart"
  | "histogram-chart"
  | "multi-line-chart"
  | "stacked-area-chart"
  | "waterfall-chart"
  | string

export interface ParsedData {
  labels: string[]
  values: number[]
  datasets?: { label: string; data: number[] }[]
  points?: { x: number; y: number }[]
  rawRows?: string[][]
}

export interface ChartConfig {
  type: string
  data: {
    labels?: string[]
    datasets: any[]
  }
  options: Record<string, any>
}

const PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
  "#d946ef",
]

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function isNumeric(v: string): boolean {
  if (v === "" || v === null || v === undefined) return false
  return !isNaN(Number(v)) && v.trim() !== "" && /^-?\d+(\.\d+)?$/.test(v.trim())
}

// CSV line parser with quote handling (similar to dataConvert)
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') {
        fields.push(cur)
        cur = ""
      } else cur += ch
    }
  }
  fields.push(cur)
  return fields.map((f) => f.trim())
}

function detectDelimiter(sample: string): string {
  if (sample.includes(",")) return ","
  if (sample.includes("\t")) return "\t"
  if (sample.includes(";")) return ";"
  if (sample.includes("|")) return "|"
  return ","
}

function tryParseJson(input: string): ParsedData | null {
  const trimmed = input.trim()
  if (!(trimmed.startsWith("[") || trimmed.startsWith("{"))) return null
  try {
    const data = JSON.parse(trimmed)
    // array of objects with label/value
    if (Array.isArray(data)) {
      if (data.length === 0) return { labels: [], values: [] }
      // array of numbers
      if (typeof data[0] === "number") {
        return { labels: data.map((_, i) => String(i + 1)), values: data as number[] }
      }
      // array of {label,value} or {x,y}
      if (typeof data[0] === "object") {
        const first = data[0]
        if ("x" in first && "y" in first) {
          return {
            labels: data.map((d: any) => String(d.label ?? d.x)),
            values: data.map((d: any) => Number(d.y)),
            points: data.map((d: any) => ({ x: Number(d.x), y: Number(d.y) })),
            datasets: undefined,
          }
        }
        if ("label" in first && "value" in first) {
          return {
            labels: data.map((d: any) => String(d.label)),
            values: data.map((d: any) => Number(d.value)),
          }
        }
        // generic array of objects -> try to infer first numeric column
        const keys = Object.keys(first)
        if (keys.length >= 2) {
          const labelKey = keys[0]
          const valueKey = keys[1]
          return {
            labels: data.map((d: any) => String(d[labelKey])),
            values: data.map((d: any) => Number(d[valueKey])),
            datasets: undefined,
          }
        }
      }
    } else if (typeof data === "object" && data !== null) {
      const entries = Object.entries(data)
      return {
        labels: entries.map(([k]) => k),
        values: entries.map(([, v]) => Number(v)),
      }
    }
  } catch {
    return null
  }
  return null
}

/**
 * Parse text input (CSV "label,value" lines) into arrays.
 * Handles:
 * - simple: label,value per line
 * - header row with string labels
 * - multi-series: label, series1, series2, ...
 * - scatter: x,y or label,x,y
 */
export function parseData(input: string): ParsedData {
  if (!input || !input.trim()) {
    return { labels: [], values: [] }
  }

  const jsonParsed = tryParseJson(input)
  if (jsonParsed) return jsonParsed

  const rawLines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (rawLines.length === 0) return { labels: [], values: [] }

  // Detect delimiter from first non-empty line
  const delim = detectDelimiter(rawLines[0])

  // Parse rows
  let rows: string[][] = rawLines.map((line) => {
    if (delim === ",") return parseCsvLine(line)
    return line.split(delim).map((s) => s.trim().replace(/^"|"$/g, "").trim())
  })

  // Filter rows where all fields empty
  rows = rows.filter((r) => r.some((c) => c !== ""))

  if (rows.length === 0) return { labels: [], values: [] }

  // Header detection: if first row contains non-numeric and second row is numeric-ish
  const firstRow = rows[0]
  const secondRow = rows[1]

  const firstRowAllNonNumeric = firstRow.every((c) => !isNumeric(c) && c !== "")
  const secondRowExists = !!secondRow
  const secondRowHasNumeric = secondRowExists && secondRow.some((c) => isNumeric(c))

  const hasHeader = firstRowAllNonNumeric && secondRowHasNumeric

  let headers: string[] | null = null
  let dataRows: string[][] = rows
  if (hasHeader) {
    headers = firstRow.map((h) => h.trim())
    dataRows = rows.slice(1)
  }

  if (dataRows.length === 0) return { labels: [], values: [] }

  const colCount = Math.max(...dataRows.map((r) => r.length), headers ? headers.length : 0)

  // Heuristic for column types
  // If headers exist:
  if (headers) {
    const lowerHeaders = headers.map((h) => h.toLowerCase())
    const isScatterHeader =
      (lowerHeaders.includes("x") && lowerHeaders.includes("y")) ||
      (lowerHeaders[0] === "x" && lowerHeaders[1] === "y")

    if (isScatterHeader) {
      // find xIdx, yIdx
      const xIdx = lowerHeaders.indexOf("x")
      const yIdx = lowerHeaders.indexOf("y")
      const points = dataRows
        .map((r) => ({
          x: Number(r[xIdx]),
          y: Number(r[yIdx]),
        }))
        .filter((p) => !isNaN(p.x) && !isNaN(p.y))
      return {
        labels: points.map((p) => String(p.x)),
        values: points.map((p) => p.y),
        points,
        rawRows: rows,
      }
    }

    if (headers.length >= 3) {
      // multi-series
      const labels = dataRows.map((r) => String(r[0] ?? ""))
      const datasets = headers.slice(1).map((h, i) => ({
        label: h,
        data: dataRows.map((r) => {
          const v = r[i + 1]
          const n = Number(v)
          return isNaN(n) ? 0 : n
        }),
      }))
      // also compute values as first dataset for simple fallback
      const firstDatasetValues = datasets[0]?.data ?? []
      return { labels, values: firstDatasetValues, datasets, rawRows: rows }
    }

    if (headers.length === 2) {
      const labels = dataRows.map((r) => String(r[0] ?? ""))
      const values = dataRows.map((r) => {
        const n = Number(r[1])
        return isNaN(n) ? 0 : n
      })
      // check if both numeric -> scatter without label?
      const bothNumeric = dataRows.every((r) => isNumeric(r[0]) && isNumeric(r[1]))
      if (bothNumeric) {
        const points = dataRows.map((r) => ({ x: Number(r[0]), y: Number(r[1]) }))
        return { labels, values, points, rawRows: rows }
      }
      return { labels, values, rawRows: rows }
    }
  }

  // No header cases
  if (colCount === 2) {
    const allFirstNonNumeric = dataRows.every((r) => !isNumeric(r[0] ?? ""))
    const allSecondNumeric = dataRows.every((r) => isNumeric(r[1] ?? ""))
    if (allFirstNonNumeric && allSecondNumeric) {
      return {
        labels: dataRows.map((r) => String(r[0])),
        values: dataRows.map((r) => Number(r[1])),
        rawRows: rows,
      }
    }
    const bothNumeric = dataRows.every((r) => isNumeric(r[0] ?? "") && isNumeric(r[1] ?? ""))
    if (bothNumeric) {
      const points = dataRows.map((r) => ({ x: Number(r[0]), y: Number(r[1]) }))
      return {
        labels: points.map((p) => String(p.x)),
        values: points.map((p) => p.y),
        points,
        rawRows: rows,
      }
    }
    // fallback simple
    return {
      labels: dataRows.map((r) => String(r[0])),
      values: dataRows.map((r) => Number(r[1]) || 0),
      rawRows: rows,
    }
  }

  if (colCount >= 3) {
    // treat as multi-series without header: generate Series1, Series2...
    const labels = dataRows.map((r) => String(r[0]))
    const seriesCount = colCount - 1
    const datasets = Array.from({ length: seriesCount }, (_, i) => ({
      label: `Series ${i + 1}`,
      data: dataRows.map((r) => {
        const n = Number(r[i + 1])
        return isNaN(n) ? 0 : n
      }),
    }))
    const firstVals = datasets[0]?.data ?? []
    return { labels, values: firstVals, datasets, rawRows: rows }
  }

  // single column: treat each line as value, label as index
  if (colCount === 1) {
    const values = dataRows.map((r) => Number(r[0]) || 0)
    const labels = dataRows.map((_, i) => String(i + 1))
    // if first row non-numeric, maybe labels?
    const maybeLabelsAreStrings = dataRows.some((r) => !isNumeric(r[0]))
    if (maybeLabelsAreStrings && values.some((v) => v === 0)) {
      // ambiguous, fallback to treating single column as labels with auto values 1..n?
      return { labels: dataRows.map((r) => String(r[0])), values: dataRows.map((_, i) => i + 1), rawRows: rows }
    }
    return { labels, values, rawRows: rows }
  }

  return { labels: [], values: [], rawRows: rows }
}

// Alias for compatibility
export const parseChartData = parseData

// ----------------- Config generators -----------------

function baseOptions(title?: string): Record<string, any> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: title ? { display: true, text: title } : { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, beginAtZero: true },
    },
  }
}

export function getLineChartConfig(data: ParsedData, title?: string): ChartConfig {
  const { labels, values, datasets } = data
  if (datasets && datasets.length > 1) return getMultiLineChartConfig(data, title)
  return {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: datasets?.[0]?.label ?? "Value",
          data: datasets?.[0]?.data ?? values,
          borderColor: PALETTE[0],
          backgroundColor: hexToRgba(PALETTE[0], 0.15),
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: baseOptions(title),
  }
}

export function getAreaChartConfig(data: ParsedData, title?: string): ChartConfig {
  const cfg = getLineChartConfig(data, title)
  cfg.data.datasets = cfg.data.datasets.map((ds) => ({
    ...ds,
    fill: true,
    backgroundColor: hexToRgba(ds.borderColor ?? PALETTE[0], 0.25),
  }))
  return cfg
}

export function getBarChartConfig(data: ParsedData, title?: string): ChartConfig {
  const { labels, values } = data
  return {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Value",
          data: values,
          backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...baseOptions(title),
      indexAxis: "x" as const,
    },
  }
}

export function getHorizontalBarChartConfig(data: ParsedData, title?: string): ChartConfig {
  const cfg = getBarChartConfig(data, title)
  cfg.options.indexAxis = "y"
  return cfg
}

export function getPieChartConfig(data: ParsedData, title?: string): ChartConfig {
  const { labels, values } = data
  return {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Value",
          data: values,
          backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "right" as const },
        title: title ? { display: true, text: title } : { display: false },
      },
    },
  }
}

export function getDoughnutChartConfig(data: ParsedData, title?: string): ChartConfig {
  const cfg = getPieChartConfig(data, title)
  cfg.type = "doughnut"
  cfg.options.cutout = "55%"
  return cfg
}

export function getScatterChartConfig(data: ParsedData, title?: string): ChartConfig {
  const points = data.points ?? data.labels.map((_, i) => ({ x: i, y: data.values[i] ?? 0 }))
  return {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Points",
          data: points,
          backgroundColor: PALETTE[0],
          borderColor: PALETTE[0],
          pointRadius: 5,
          showLine: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: title ? { display: true, text: title } : { display: false },
      },
      scales: {
        x: { type: "linear" as const, position: "bottom" as const, beginAtZero: true, title: { display: true, text: "X" } },
        y: { beginAtZero: true, title: { display: true, text: "Y" } },
      },
    },
  }
}

export function getRadarChartConfig(data: ParsedData, title?: string): ChartConfig {
  const { labels, values, datasets } = data
  if (datasets && datasets.length > 1) {
    return {
      type: "radar",
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          label: ds.label,
          data: ds.data,
          borderColor: PALETTE[i % PALETTE.length],
          backgroundColor: hexToRgba(PALETTE[i % PALETTE.length], 0.2),
          borderWidth: 2,
          pointRadius: 3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true }, title: title ? { display: true, text: title } : { display: false } },
        scales: { r: { beginAtZero: true } },
      },
    }
  }
  return {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Value",
          data: values,
          borderColor: PALETTE[0],
          backgroundColor: hexToRgba(PALETTE[0], 0.25),
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, title: title ? { display: true, text: title } : { display: false } },
      scales: { r: { beginAtZero: true } },
    },
  }
}

export function getHistogramChartConfig(data: ParsedData, title?: string): ChartConfig {
  // histogram as bar with 0 gap
  const cfg = getBarChartConfig(data, title)
  cfg.options.barPercentage = 1.0
  cfg.options.categoryPercentage = 0.98
  cfg.options.plugins.legend.display = false
  // ensure one color for histogram continuity
  cfg.data.datasets[0].backgroundColor = hexToRgba(PALETTE[0], 0.7)
  cfg.data.datasets[0].borderColor = PALETTE[0]
  return cfg
}

export function getMultiLineChartConfig(data: ParsedData, title?: string): ChartConfig {
  const { labels, datasets, values } = data
  const ds = datasets && datasets.length > 0 ? datasets : [{ label: "Value", data: values }]
  return {
    type: "line",
    data: {
      labels,
      datasets: ds.map((d, i) => ({
        label: d.label,
        data: d.data,
        borderColor: PALETTE[i % PALETTE.length],
        backgroundColor: hexToRgba(PALETTE[i % PALETTE.length], 0.12),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
      })),
    },
    options: baseOptions(title),
  }
}

export function getStackedAreaChartConfig(data: ParsedData, title?: string): ChartConfig {
  const cfg = getMultiLineChartConfig(data, title)
  cfg.data.datasets = cfg.data.datasets.map((ds: any) => ({
    ...ds,
    fill: true,
    backgroundColor: hexToRgba(ds.borderColor, 0.35),
  }))
  cfg.options.scales = {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, beginAtZero: true },
  }
  return cfg
}

export function getWaterfallChartConfig(data: ParsedData, title?: string): ChartConfig {
  const { labels, values } = data
  // compute floating bars: each bar from previous cumulative to cumulative
  // For Chart.js waterfall pattern, use data as [start, end] pairs with background
  let cumulative = 0
  const floatingData: (number | [number, number])[] = []
  const colors: string[] = []
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    if (i === values.length - 1 && labels[i]?.toLowerCase().includes("total")) {
      // last total bar from 0 to cumulative + v? For simplicity treat as cumulative
      floatingData.push([0, cumulative + (v === 0 ? 0 : v)])
      colors.push(PALETTE[4])
    } else {
      const start = cumulative
      const end = cumulative + v
      floatingData.push([Math.min(start, end), Math.max(start, end)])
      colors.push(v >= 0 ? PALETTE[1] : PALETTE[3])
      cumulative = end
    }
  }

  // For simple case where no total detection, just use values directly as bars (fallback)
  const useFloating = true // keep floating for visual
  return {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Value",
          data: useFloating ? floatingData : values,
          backgroundColor: useFloating ? colors : labels.map((_, i) => (values[i] >= 0 ? PALETTE[1] : PALETTE[3])),
          borderColor: useFloating ? colors : labels.map((_, i) => (values[i] >= 0 ? PALETTE[1] : PALETTE[3])),
          borderWidth: 1,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: title ? { display: true, text: title } : { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const v = values[ctx.dataIndex]
              return ` ${v >= 0 ? "+" : ""}${v}`
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    },
  }
}

export function getChartConfig(type: ChartType, data: ParsedData, title?: string): ChartConfig {
  switch (type) {
    case "line-chart":
      return getLineChartConfig(data, title)
    case "bar-chart":
      return getBarChartConfig(data, title)
    case "pie-chart":
      return getPieChartConfig(data, title)
    case "horizontal-bar-chart":
      return getHorizontalBarChartConfig(data, title)
    case "area-chart":
      return getAreaChartConfig(data, title)
    case "doughnut-chart":
      return getDoughnutChartConfig(data, title)
    case "scatter-chart":
      return getScatterChartConfig(data, title)
    case "radar-chart":
      return getRadarChartConfig(data, title)
    case "histogram-chart":
      return getHistogramChartConfig(data, title)
    case "multi-line-chart":
      return getMultiLineChartConfig(data, title)
    case "stacked-area-chart":
      return getStackedAreaChartConfig(data, title)
    case "waterfall-chart":
      return getWaterfallChartConfig(data, title)
    default:
      // fallback to bar
      return getBarChartConfig(data, title)
  }
}

// Samples for each chart type
export const chartSamples: Record<ChartType, string> = {
  "line-chart": `Jan,120\nFeb,135\nMar,148\nApr,160\nMay,178\nJun,195`,
  "bar-chart": `Mon,320\nTue,450\nWed,280\nThu,500\nFri,610\nSat,420`,
  "pie-chart": `Chrome,64\nSafari,19\nEdge,9\nFirefox,5\nOther,3`,
  "horizontal-bar-chart": `Product A,240\nProduct B,180\nProduct C,320\nProduct D,150`,
  "area-chart": `Q1,120\nQ2,200\nQ3,150\nQ4,280`,
  "doughnut-chart": `Desktop,55\nMobile,35\nTablet,10`,
  "scatter-chart": `x,y\n1,2.3\n2,3.1\n3,4.5\n4,3.9\n5,5.2\n6,6.1`,
  "radar-chart": `Speed,85\nPower,70\nAgility,90\nEndurance,60\nPrecision,75`,
  "histogram-chart": `0-10,5\n10-20,12\n20-30,18\n30-40,25\n40-50,16\n50-60,8`,
  "multi-line-chart": `Month,Sales,Profit\nJan,120,40\nFeb,135,45\nMar,148,52\nApr,160,60\nMay,178,70\nJun,195,85`,
  "stacked-area-chart": `Month,Direct,Search,Social\nJan,30,50,20\nFeb,35,55,25\nMar,40,60,30\nApr,45,65,35`,
  "waterfall-chart": `Start,100\nSales,60\nMarketing,-20\nOperations,-10\nOther,15\nTotal,145`,
}

export function getChartSample(type: ChartType): string {
  return chartSamples[type] ?? chartSamples["bar-chart"]
}

export default {
  parseData,
  parseChartData,
  getChartConfig,
  getLineChartConfig,
  getBarChartConfig,
  getPieChartConfig,
  getHorizontalBarChartConfig,
  getAreaChartConfig,
  getDoughnutChartConfig,
  getScatterChartConfig,
  getRadarChartConfig,
  getHistogramChartConfig,
  getMultiLineChartConfig,
  getStackedAreaChartConfig,
  getWaterfallChartConfig,
  getChartSample,
  chartSamples,
}
