import { describe, it, expect } from "vitest"
import { flatten, unflatten, sortKeys } from "./jsonFlatten"

describe("jsonFlatten", () => {
  it("{a:{b:1}} -> {\"a.b\":1} flatten", () => {
    expect(flatten({ a: { b: 1 } })).toEqual({ "a.b": 1 })
  })

  it("unflatten reverse {\"a.b\":1} -> {a:{b:1}}", () => {
    expect(unflatten({ "a.b": 1 })).toEqual({ a: { b: 1 } })
  })

  it("flatten/unflatten roundtrip with nested array", () => {
    const original = { a: { b: [1, 2, { c: 3 }], d: "hi" }, e: null }
    const flat = flatten(original)
    expect(flat).toEqual({ "a.b.0": 1, "a.b.1": 2, "a.b.2.c": 3, "a.d": "hi", e: null })
    expect(unflatten(flat)).toEqual(original)
  })

  it("sortKeys sorts keys recursively", () => {
    const input = { z: 1, a: { d: 4, b: 2, c: 3 }, m: [{ z: 1, a: 2 }, 3] }
    expect(sortKeys(input)).toEqual({
      a: { b: 2, c: 3, d: 4 },
      m: [{ a: 2, z: 1 }, 3],
      z: 1,
    })
    // keys order
    expect(Object.keys(sortKeys(input))).toEqual(["a", "m", "z"])
    expect(Object.keys(sortKeys(input).a)).toEqual(["b", "c", "d"])
  })

  it("flatten with prefix param and empty handling", () => {
    expect(flatten({ x: 1 }, "pre")).toEqual({ "pre.x": 1 })
    expect(flatten({ a: { b: { c: 2 } } })).toEqual({ "a.b.c": 2 })
    expect(unflatten({ "a.b.c": 2 })).toEqual({ a: { b: { c: 2 } } })
    // sortKeys leaves primitives untouched
    expect(sortKeys(42)).toBe(42)
    expect(sortKeys(null)).toBe(null)
  })
})
