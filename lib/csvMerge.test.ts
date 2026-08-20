import { describe, it, expect } from "vitest"
import { csvMerge } from "./csvMerge"

describe("csvMerge", () => {
  it("merges two CSVs with same header, dedup header", () => {
    const a = "name,age\nAlice,30\nBob,25"
    const b = "name,age\nCharlie,35"
    const result = csvMerge([a, b])
    const lines = result.split("\n")
    expect(lines[0]).toBe("name,age")
    expect(lines).toHaveLength(4) // header + 3 rows
    expect(lines[1]).toBe("Alice,30")
    expect(lines[2]).toBe("Bob,25")
    expect(lines[3]).toBe("Charlie,35")
    // header should appear only once
    expect(result.split("name,age")).toHaveLength(2)
  })

  it("merges CSVs with different headers into union", () => {
    const a = "name,age\nAlice,30"
    const b = "name,city\nBob,NYC"
    const result = csvMerge([a, b])
    expect(result.split("\n")[0]).toBe("name,age,city")
    expect(result).toContain("Alice,30,")
    expect(result).toContain("Bob,,NYC")
  })

  it("handles quoted fields with commas", () => {
    const a = 'name,note\nAlice,"hello, world"'
    const b = 'name,note\nBob,"hi, there"'
    const result = csvMerge([a, b])
    expect(result).toContain('"hello, world"')
    expect(result).toContain('"hi, there"')
    expect(result.split("\n")).toHaveLength(3)
  })

  it("preserves order of header first appearance", () => {
    const a = "b,a\n1,2"
    const b = "a,c\n3,4"
    const result = csvMerge([a, b])
    expect(result.split("\n")[0]).toBe("b,a,c")
    expect(result).toContain("1,2,")
    expect(result).toContain(",3,4")
  })

  it("handles empty and single CSV cases", () => {
    const a = "x,y\n1,2"
    expect(csvMerge([a])).toBe("x,y\n1,2")
    expect(csvMerge([])).toBe("")
    expect(csvMerge(["", ""])).toBe("")
    const withEmpty = csvMerge([a, ""])
    expect(withEmpty).toBe("x,y\n1,2")
  })
})
