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
