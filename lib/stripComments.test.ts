import { describe, it, expect } from "vitest"
import { stripComments } from "./stripComments"

describe("stripComments", () => {
  it("js: removes // single line comment", () => {
    const code = "const a = 1; // this is comment\nlet b = 2;"
    const result = stripComments(code, "js")
    expect(result).not.toContain("//")
    expect(result).not.toContain("this is comment")
    expect(result).toContain("const a = 1;")
    expect(result).toContain("let b = 2;")
  })

  it("js: removes /* block comment */", () => {
    const code = "const a = /* block */ 1;\n/* multi\n line */\nlet b=2;"
    const result = stripComments(code, "javascript")
    expect(result).not.toContain("/*")
    expect(result).not.toContain("block")
    expect(result).not.toContain("multi")
    expect(result).toContain("const a =")
    expect(result).toContain("let b=2;")
  })

  it("python: removes # comments", () => {
    const code = "a = 1 # comment\n# full line comment\nb = 2"
    const result = stripComments(code, "python")
    expect(result).not.toContain("#")
    expect(result).not.toContain("comment")
    expect(result).toContain("a = 1")
    expect(result).toContain("b = 2")
  })

  it("html: removes <!-- comments -->", () => {
    const code = "<div><!-- comment --><p>hello</p><!-- multi\nline --></div>"
    const result = stripComments(code, "html")
    expect(result).not.toContain("<!--")
    expect(result).not.toContain("comment")
    expect(result).toContain("<div>")
    expect(result).toContain("<p>hello</p>")
  })

  it("preserves strings containing comment-like content", () => {
    const code = `const s = "// not a comment";\nconst t = '/* not comment */';\nconst a = 1; // real comment`
    const result = stripComments(code, "js")
    expect(result).toContain('"// not a comment"')
    expect(result).toContain("'/* not comment */'")
    expect(result).not.toContain("real comment")
  })

  it("sql: removes -- and /* */ comments", () => {
    const code = "SELECT * FROM users -- filter\nWHERE id=1 /* block comment */;"
    const result = stripComments(code, "sql")
    expect(result).not.toContain("--")
    expect(result).not.toContain("filter")
    expect(result).not.toContain("block comment")
    expect(result).toContain("SELECT * FROM users")
    expect(result).toContain("WHERE id=1")
  })
})
