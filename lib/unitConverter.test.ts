import { describe, expect, it } from "vitest"
import { convertUnit, getUnits } from "./unitConverter"

describe("linear conversion", () => {
  it("长度：千米转英里", () => {
    expect(convertUnit("length", 1, "km", "mi")).toBeCloseTo(0.621371, 5)
  })
  it("重量：磅转千克", () => {
    expect(convertUnit("weight", 100, "lb", "kg")).toBeCloseTo(45.359237, 6)
  })
  it("面积：亩转平方米", () => {
    expect(convertUnit("area", 1, "亩", "m²")).toBeCloseTo(666.6667, 3)
  })
  it("体积：加仑转换", () => {
    expect(convertUnit("volume", 1, "L", "gal(US)")).toBeCloseTo(0.264172, 5)
  })
  it("速度：km/h 转 m/s", () => {
    expect(convertUnit("speed", 36, "km/h", "m/s")).toBeCloseTo(10, 10)
  })
  it("时间往返", () => {
    const v = convertUnit("time", 1, "d", "min")
    expect(convertUnit("time", v, "min", "d")).toBeCloseTo(1, 10)
  })
  it("角度：弧度转度", () => {
    expect(convertUnit("angle", Math.PI, "rad", "°")).toBeCloseTo(180, 10)
  })
})

describe("temperature affine", () => {
  it("摄氏转华氏", () => {
    expect(convertUnit("temperature", 100, "°C", "°F")).toBeCloseTo(212, 10)
  })
  it("华氏转摄氏", () => {
    expect(convertUnit("temperature", 32, "°F", "°C")).toBeCloseTo(0, 10)
  })
  it("开尔文往返", () => {
    expect(convertUnit("temperature", convertUnit("temperature", 25, "°C", "K"), "K", "°C")).toBeCloseTo(25, 10)
  })
  it("兰氏度", () => {
    expect(convertUnit("temperature", 0, "°C", "°R")).toBeCloseTo(491.67, 2)
  })
})

describe("errors", () => {
  it("未知单位报错", () => {
    expect(() => convertUnit("length", 1, "xx", "m")).toThrow(/未知单位/)
  })
})

describe("getUnits", () => {
  it("温度四单位", () => {
    expect(getUnits("temperature").map(x => x.sym)).toEqual(["°C", "°F", "K", "°R"])
  })
  it("长度十二单位", () => {
    expect(getUnits("length")).toHaveLength(12)
  })
})

describe("wave2 categories", () => {
  it("压力：atm 转 kPa", () => {
    expect(convertUnit("pressure", 1, "atm", "kPa")).toBeCloseTo(101.325, 3)
  })
  it("功率：公制马力转瓦", () => {
    expect(convertUnit("power", 1, "ps", "W")).toBeCloseTo(735.49875, 5)
  })
  it("力：千克力转牛顿", () => {
    expect(convertUnit("force", 1, "kgf", "N")).toBeCloseTo(9.80665, 10)
  })
  it("扭矩：磅力英尺转牛米", () => {
    expect(convertUnit("torque", 1, "lbf·ft", "N·m")).toBeCloseTo(1.355818, 5)
  })
  it("能量：千卡转千焦", () => {
    expect(convertUnit("energy", 1, "kcal", "kJ")).toBeCloseTo(4.184, 3)
  })
  it("频率：rpm 转赫兹", () => {
    expect(convertUnit("frequency", 60, "rpm", "Hz")).toBeCloseTo(1, 10)
  })
  it("密度：g/cm³ 转 kg/m³", () => {
    expect(convertUnit("density", 1, "g/cm³", "kg/m³")).toBeCloseTo(1000, 10)
  })
  it("油耗：mpg 与 L/100km 倒数换算", () => {
    const l100 = convertUnit("fuel", 235.2145833, "mpg(US)", "L/100km")
    expect(l100).toBeCloseTo(1, 6)
    const back = convertUnit("fuel", l100, "L/100km", "mpg(US)")
    expect(back).toBeCloseTo(235.2145833, 4)
  })
  it("油耗：0 值报错", () => {
    expect(() => convertUnit("fuel", 0, "mpg(US)", "L/100km")).toThrow(/不能为 0/)
  })
})

describe("wave3 categories", () => {
  it("电压：千伏转毫伏", () => {
    expect(convertUnit("voltage", 1, "kV", "mV")).toBeCloseTo(1e6, 0)
  })
  it("电流：安转微安", () => {
    expect(convertUnit("current", 1, "A", "μA")).toBeCloseTo(1e6, 0)
  })
  it("电阻：兆欧转千欧", () => {
    expect(convertUnit("resistance", 1, "MΩ", "kΩ")).toBeCloseTo(1000, 10)
  })
  it("电容：微法转皮法", () => {
    expect(convertUnit("capacitance", 1, "μF", "pF")).toBeCloseTo(1e6, 0)
  })
  it("电荷：安时转库仑", () => {
    expect(convertUnit("charge", 1, "Ah", "C")).toBeCloseTo(3600, 10)
  })
  it("照度：英尺烛光转勒克斯", () => {
    expect(convertUnit("illuminance", 1, "fc", "lx")).toBeCloseTo(10.7639, 4)
  })
  it("声学：奈培转分贝", () => {
    expect(convertUnit("sound", 1, "Np", "dB")).toBeCloseTo(8.6859, 4)
  })
  it("色温：5000K 转 mired", () => {
    expect(convertUnit("cct", 5000, "K", "mired")).toBeCloseTo(200, 6)
  })
})
