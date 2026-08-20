import { describe, it, expect } from "vitest"
import { parseData, getChartConfig } from "./chartTool"

describe("chartTool parseData & getChartConfig", () => {
  it("parseData parses simple label,value CSV", () => {
    const input = "Jan,100\nFeb,200\nMar,150"
    const parsed = parseData(input)
    expect(parsed.labels).toEqual(["Jan", "Feb", "Mar"])
    expect(parsed.values).toEqual([100, 200, 150])
  })

  it("parseData handles multi-column header for multi-line chart", () => {
    const input = "Month,Sales,Profit\nJan,120,40\nFeb,135,45"
    const parsed = parseData(input)
    expect(parsed.labels).toEqual(["Jan", "Feb"])
    expect(parsed.datasets).toBeDefined()
    expect(parsed.datasets!.length).toBe(2)
    expect(parsed.datasets![0].label).toBe("Sales")
    expect(parsed.datasets![0].data).toEqual([120, 135])
    expect(parsed.datasets![1].data).toEqual([40, 45])
  })

  it("getChartConfig bar-chart returns bar type with correct labels", () => {
    const data = parseData("A,10\nB,20\nC,30")
    const cfg = getChartConfig("bar-chart", data)
    expect(cfg.type).toBe("bar")
    expect(cfg.data.labels).toEqual(["A", "B", "C"])
    expect(cfg.data.datasets[0].data).toEqual([10, 20, 30])
  })

  it("getChartConfig pie-chart and doughnut-chart produce pie/doughnut types", () => {
    const data = parseData("Chrome,64\nSafari,19\nEdge,9")
    const pie = getChartConfig("pie-chart", data)
    expect(pie.type).toBe("pie")
    expect(pie.data.datasets[0].data).toEqual([64, 19, 9])
    const doughnut = getChartConfig("doughnut-chart", data)
    expect(doughnut.type).toBe("doughnut")
    expect(doughnut.data.labels).toEqual(["Chrome", "Safari", "Edge"])
  })

  it("getChartConfig scatter-chart uses points and multi-line uses datasets", () => {
    const scatterInput = "x,y\n1,2.3\n2,3.1\n3,4.5"
    const scatterData = parseData(scatterInput)
    expect(scatterData.points).toBeDefined()
    expect(scatterData.points!.length).toBe(3)
    const scatterCfg = getChartConfig("scatter-chart", scatterData)
    expect(scatterCfg.type).toBe("scatter")
    expect(scatterCfg.data.datasets[0].data[0]).toEqual({ x: 1, y: 2.3 })

    const multi = parseData("Month,S1,S2\nJan,10,20\nFeb,15,25")
    const multiCfg = getChartConfig("multi-line-chart", multi)
    expect(multiCfg.type).toBe("line")
    expect(multiCfg.data.datasets.length).toBe(2)

    const stacked = getChartConfig("stacked-area-chart", multi)
    expect(stacked.options.scales.y.stacked).toBe(true)

    const waterfall = getChartConfig("waterfall-chart", parseData("Start,100\nA,30\nB,-10"))
    expect(waterfall.type).toBe("bar")
  })

  // Additional coverage: histogram & radar & area & horizontalBar
  it("covers remaining chart types (area, horizontal, radar, histogram, waterfall)", () => {
    const simple = parseData("Q1,10\nQ2,20\nQ3,30")
    expect(getChartConfig("area-chart", simple).data.datasets[0].fill).toBe(true)
    expect(getChartConfig("horizontal-bar-chart", simple).options.indexAxis).toBe("y")
    expect(getChartConfig("radar-chart", simple).type).toBe("radar")
    expect(getChartConfig("histogram-chart", simple).type).toBe("bar")
    expect(getChartConfig("line-chart", simple).type).toBe("line")
  })
})
