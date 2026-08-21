import { describe, it, expect } from "vitest"
import { decodeJwt, base64UrlEncode } from "./jwtDecoder"

const header = { alg: "HS256", typ: "JWT" }
const payload = {
  sub: "1234567890",
  name: "张三",
  admin: true,
  iat: 1704067200,
  exp: 1735689600,
}
const token = [base64UrlEncode(header), base64UrlEncode(payload), "sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"].join(".")

describe("jwtDecoder", () => {
  it("decodes a real structure token and formats json with 2 spaces", () => {
    const result = decodeJwt(token)
    expect(result.headerJson).toBe(JSON.stringify(header, null, 2))
    expect(result.payloadJson).toBe(JSON.stringify(payload, null, 2))
    expect(result.signature).toBe("sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
  })
  it("roundtrips unicode payload values", () => {
    const result = decodeJwt(token)
    expect((result.payload as Record<string, unknown>).name).toBe("张三")
  })
  it("parses exp and iat timestamps to readable iso time", () => {
    const result = decodeJwt(token)
    expect(result.times).toContainEqual({ label: "过期时间 exp", iso: new Date(1735689600 * 1000).toISOString() })
    expect(result.times).toContainEqual({ label: "签发时间 iat", iso: new Date(1704067200 * 1000).toISOString() })
  })
  it("omits times when payload has no timestamp fields", () => {
    const t = [base64UrlEncode({ alg: "none" }), base64UrlEncode({ sub: "a" }), "sig"].join(".")
    expect(decodeJwt(t).times).toEqual([])
  })
  it("throws on wrong segment count", () => {
    expect(() => decodeJwt("abc.def")).toThrow(/三段/)
    expect(() => decodeJwt("a.b.c.d")).toThrow(/三段/)
  })
  it("throws on invalid base64url segment", () => {
    expect(() => decodeJwt("!!!.e30.x")).toThrow(/Base64URL/)
  })
  it("throws on non-json segment", () => {
    const bad = btoa("not json").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    expect(() => decodeJwt(`${bad}.${bad}.sig`)).toThrow(/JSON/)
  })
  it("throws on empty input", () => {
    expect(() => decodeJwt("   ")).toThrow(/请输入/)
  })
})
