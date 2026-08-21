import { describe, it, expect } from "vitest"
import { morseEncode, morseDecode } from "./morseCodec"

describe("morseCodec", () => {
  it("SOS known vector", () => {
    expect(morseEncode("SOS")).toBe("... --- ...")
    expect(morseDecode("... --- ...")).toBe("SOS")
  })
  it("roundtrip letters digits punctuation", () => {
    const s = "HELLO WORLD 123 .,?!"
    expect(morseDecode(morseEncode(s))).toBe(s)
  })
  it("mixed chinese english skips unknown chars", () => {
    expect(morseEncode("你好 hello")).toBe(".... . .-.. .-.. ---")
    expect(morseDecode(morseEncode("你好 hello"))).toBe("HELLO")
  })
  it("case insensitive encode", () => {
    expect(morseEncode("sos")).toBe(morseEncode("SOS"))
    expect(morseEncode("Hello World")).toBe(".... . .-.. .-.. --- / .-- --- .-. .-.. -..")
  })
  it("empty input returns empty output", () => {
    expect(morseEncode("")).toBe("")
    expect(morseDecode("   ")).toBe("")
    expect(morseEncode("   ")).toBe("")
  })
  it("unknown characters skipped in encode", () => {
    expect(morseEncode("a#b")).toBe(".- -...")
    expect(morseEncode("你好")).toBe("")
  })
  it("unknown sequences skipped in decode", () => {
    expect(morseDecode("... -------- ...")).toBe("SS")
    expect(morseDecode("..--. ...")).toBe("S")
  })
  it("digits and symbols vectors", () => {
    expect(morseEncode("2026")).toBe("..--- ----- ..--- -....")
    expect(morseEncode("@")).toBe(".--.-.")
    expect(morseDecode(".--.-.")).toBe("@")
  })
  it("slash inside text roundtrips without breaking word separator", () => {
    expect(morseEncode("A/B")).toBe(".- -..-. -...")
    expect(morseDecode(morseEncode("A/B"))).toBe("A/B")
  })
  it("word separator roundtrip multi words", () => {
    expect(morseEncode("MORSE CODE")).toBe("-- --- .-. ... . / -.-. --- -.. .")
    expect(morseDecode("-- --- .-. ... . / -.-. --- -.. .")).toBe("MORSE CODE")
  })
})
