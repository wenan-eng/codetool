export interface UnitEntry {
  sym: string
  name: string
  f: number
}

export type CategoryKey =
  | "length" | "weight" | "temperature" | "area" | "volume"
  | "speed" | "time" | "angle"
  | "pressure" | "power" | "force" | "torque" | "energy" | "frequency" | "density"
  | "fuel"

interface LinearCategory {
  kind: "linear"
  baseName: string
  units: UnitEntry[]
}

const u = (sym: string, name: string, f: number): UnitEntry => ({ sym, name, f })

const LINEAR: Record<Exclude<CategoryKey, "temperature" | "fuel">, LinearCategory> = {
  length: {
    kind: "linear",
    baseName: "米",
    units: [
      u("nm", "纳米", 1e-9), u("μm", "微米", 1e-6), u("mm", "毫米", 1e-3), u("cm", "厘米", 1e-2),
      u("dm", "分米", 0.1), u("m", "米", 1), u("km", "千米", 1e3), u("in", "英寸", 0.0254),
      u("ft", "英尺", 0.3048), u("yd", "码", 0.9144), u("mi", "英里", 1609.344), u("nmi", "海里", 1852),
    ],
  },
  weight: {
    kind: "linear",
    baseName: "千克",
    units: [
      u("mg", "毫克", 1e-6), u("g", "克", 1e-3), u("kg", "千克", 1), u("t", "吨", 1e3),
      u("oz", "盎司", 0.028349523125), u("lb", "磅", 0.45359237), u("ct", "克拉", 2e-4),
      u("斤", "市斤", 0.5), u("两", "市两", 0.05),
    ],
  },
  area: {
    kind: "linear",
    baseName: "平方米",
    units: [
      u("mm²", "平方毫米", 1e-6), u("cm²", "平方厘米", 1e-4), u("m²", "平方米", 1),
      u("ha", "公顷", 1e4), u("km²", "平方千米", 1e6), u("in²", "平方英寸", 6.4516e-4),
      u("ft²", "平方英尺", 0.09290304), u("ac", "英亩", 4046.8564224), u("亩", "市亩", 2000 / 3),
    ],
  },
  volume: {
    kind: "linear",
    baseName: "升",
    units: [
      u("ml", "毫升", 1e-3), u("L", "升", 1), u("m³", "立方米", 1e3), u("cm³", "立方厘米", 1e-3),
      u("in³", "立方英寸", 0.016387064), u("ft³", "立方英尺", 28.316846592),
      u("gal(US)", "美制加仑", 3.785411784), u("qt", "夸脱", 0.946352946), u("pt", "品脱", 0.473176473),
    ],
  },
  speed: {
    kind: "linear",
    baseName: "米/秒",
    units: [
      u("m/s", "米/秒", 1), u("km/h", "千米/小时", 1 / 3.6), u("mph", "英里/小时", 0.44704),
      u("kn", "节", 1852 / 3600), u("ft/s", "英尺/秒", 0.3048), u("mach", "马赫", 340.29),
    ],
  },
  time: {
    kind: "linear",
    baseName: "秒",
    units: [
      u("ns", "纳秒", 1e-9), u("μs", "微秒", 1e-6), u("ms", "毫秒", 1e-3), u("s", "秒", 1),
      u("min", "分钟", 60), u("h", "小时", 3600), u("d", "天", 86400), u("wk", "周", 604800),
    ],
  },
  angle: {
    kind: "linear",
    baseName: "度",
    units: [
      u("°", "度", 1), u("rad", "弧度", 180 / Math.PI), u("grad", "冈", 0.9),
      u("′", "角分", 1 / 60), u("″", "角秒", 1 / 3600), u("turn", "转", 360),
    ],
  },
  pressure: {
    kind: "linear",
    baseName: "帕斯卡",
    units: [
      u("Pa", "帕斯卡", 1), u("kPa", "千帕", 1e3), u("MPa", "兆帕", 1e6), u("bar", "巴", 1e5),
      u("mbar", "毫巴", 100), u("atm", "标准大气压", 101325), u("mmHg", "毫米汞柱", 133.322368),
      u("psi", "磅/平方英寸", 6894.757293), u("Torr", "托", 133.322368),
    ],
  },
  power: {
    kind: "linear",
    baseName: "瓦特",
    units: [
      u("W", "瓦特", 1), u("kW", "千瓦", 1e3), u("MW", "兆瓦", 1e6),
      u("hp", "机械马力", 745.699872), u("ps", "公制马力", 735.49875),
      u("cal/s", "卡/秒", 4.184), u("BTU/h", "英热/小时", 0.29307107),
    ],
  },
  force: {
    kind: "linear",
    baseName: "牛顿",
    units: [
      u("N", "牛顿", 1), u("kN", "千牛", 1e3), u("dyn", "达因", 1e-5),
      u("kgf", "千克力", 9.80665), u("lbf", "磅力", 4.448221615), u("tf", "吨力", 9806.65),
    ],
  },
  torque: {
    kind: "linear",
    baseName: "牛·米",
    units: [
      u("N·m", "牛·米", 1), u("kN·m", "千牛·米", 1e3), u("kgf·m", "千克力·米", 9.80665),
      u("lbf·ft", "磅力·英尺", 1.355817948), u("lbf·in", "磅力·英寸", 0.112984829),
    ],
  },
  energy: {
    kind: "linear",
    baseName: "焦耳",
    units: [
      u("J", "焦耳", 1), u("kJ", "千焦", 1e3), u("cal", "卡路里", 4.184), u("kcal", "千卡", 4184),
      u("Wh", "瓦时", 3600), u("kWh", "千瓦时", 3.6e6), u("BTU", "英热单位", 1055.055853),
      u("eV", "电子伏特", 1.602176634e-19),
    ],
  },
  frequency: {
    kind: "linear",
    baseName: "赫兹",
    units: [u("Hz", "赫兹", 1), u("kHz", "千赫", 1e3), u("MHz", "兆赫", 1e6), u("GHz", "吉赫", 1e9), u("rpm", "转/分钟", 1 / 60)],
  },
  density: {
    kind: "linear",
    baseName: "千克/立方米",
    units: [
      u("kg/m³", "千克/立方米", 1), u("g/cm³", "克/立方厘米", 1e3), u("g/L", "克/升", 1),
      u("lb/ft³", "磅/立方英尺", 16.01846337), u("lb/in³", "磅/立方英寸", 27679.90471),
    ],
  },
}

const TEMPERATURE_UNITS = ["°C", "°F", "K", "°R"] as const

interface ReciprocalUnit {
  sym: string
  name: string
  c: number
}

const RECIPROCAL: Record<string, { units: ReciprocalUnit[] }> = {
  fuel: {
    units: [
      { sym: "L/100km", name: "升/百公里", c: 1 },
      { sym: "km/L", name: "千米/升", c: 100 },
      { sym: "mpg(US)", name: "美制mpg", c: 235.2145833 },
      { sym: "mpg(UK)", name: "英制mpg", c: 282.4809363 },
    ],
  },
}

const TEMP_TO_BASE: Record<string, (v: number) => number> = {
  "°C": v => v,
  "°F": v => ((v - 32) * 5) / 9,
  K: v => v - 273.15,
  "°R": v => ((v - 491.67) * 5) / 9,
}

const TEMP_FROM_BASE: Record<string, (v: number) => number> = {
  "°C": v => v,
  "°F": v => (v * 9) / 5 + 32,
  K: v => v + 273.15,
  "°R": v => ((v + 273.15) * 9) / 5,
}

export const TOOL_CATEGORY_MAP: Record<string, CategoryKey> = {
  "length-converter": "length",
  "weight-converter": "weight",
  "temperature-converter": "temperature",
  "area-converter": "area",
  "volume-converter": "volume",
  "speed-converter": "speed",
  "time-converter": "time",
  "angle-converter": "angle",
  "pressure-converter": "pressure",
  "power-converter": "power",
  "force-converter": "force",
  "torque-converter": "torque",
  "heat-converter": "energy",
  "frequency-converter": "frequency",
  "density-converter": "density",
  "fuel-consumption-converter": "fuel",
}

export function getCategoryKeys(): CategoryKey[] {
  return [...Object.keys(LINEAR) as CategoryKey[], "temperature", ...Object.keys(RECIPROCAL) as CategoryKey[]]
}

export function getUnits(category: CategoryKey): { sym: string; name: string }[] {
  if (category === "temperature") {
    const names: Record<string, string> = { "°C": "摄氏度", "°F": "华氏度", K: "开尔文", "°R": "兰氏度" }
    return TEMPERATURE_UNITS.map(sym => ({ sym, name: names[sym] }))
  }
  if (category in RECIPROCAL) return RECIPROCAL[category].units.map(({ sym, name }) => ({ sym, name }))
  return LINEAR[category as Exclude<CategoryKey, "temperature" | "fuel">].units.map(({ sym, name }) => ({ sym, name }))
}

export function convertUnit(category: CategoryKey, value: number, from: string, to: string): number {
  if (category === "temperature") {
    const tb = TEMP_TO_BASE[from]
    const fb = TEMP_FROM_BASE[to]
    if (!tb || !fb) throw new Error("未知温度单位")
    return fb(tb(value))
  }
  if (category in RECIPROCAL) {
    const uf = RECIPROCAL[category].units.find(x => x.sym === from)
    const ut = RECIPROCAL[category].units.find(x => x.sym === to)
    if (!uf || !ut) throw new Error("未知单位")
    if (value === 0) throw new Error("数值不能为 0")
    return (ut.c * uf.c) / value
  }
  const cat = LINEAR[category as Exclude<CategoryKey, "temperature" | "fuel">]
  const uf = cat.units.find(x => x.sym === from)
  const ut = cat.units.find(x => x.sym === to)
  if (!uf || !ut) throw new Error("未知单位")
  return (value * uf.f) / ut.f
}
