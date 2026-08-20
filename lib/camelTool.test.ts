import { describe, it, expect } from "vitest"
import { camelToSnake, snakeToCamel, transform, convertCamel } from "./camelTool"

describe("camelTool", () => {
  it('camelToSnake: helloWorld -> hello_world', () => {
    expect(camelToSnake("helloWorld")).toBe("hello_world")
  })

  it('snakeToCamel: hello_world -> helloWorld', () => {
    expect(snakeToCamel("hello_world")).toBe("helloWorld")
  })

  it('camelToSnake: myVariableName -> my_variable_name', () => {
    expect(camelToSnake("myVariableName")).toBe("my_variable_name")
  })

  it('snakeToCamel: my_variable_name -> myVariableName', () => {
    expect(snakeToCamel("my_variable_name")).toBe("myVariableName")
  })

  it("handle multi-line with symbols preserves structure", () => {
    const input = "const myVariableName = hello_world;\nlet fooBar = my_variable_name;\n// symbols: = ; , ( ) { }\nfoo_bar(baz_qux) + helloWorld"
    // toSnake: 驼峰转下划线，非驼峰标识保持 snake 形态，符号/换行不变
    const toSnake = transform(input, "toSnake")
    expect(toSnake).toBe(
      "const my_variable_name = hello_world;\nlet foo_bar = my_variable_name;\n// symbols: = ; , ( ) { }\nfoo_bar(baz_qux) + hello_world"
    )
    // also via wrapper
    expect(convertCamel(input, "toSnake")).toBe(toSnake)

    // toCamel: 下划线转驼峰
    const toCamel = transform(input, "toCamel")
    expect(toCamel).toBe(
      "const myVariableName = helloWorld;\nlet fooBar = myVariableName;\n// symbols: = ; , ( ) { }\nfooBar(bazQux) + helloWorld"
    )
    expect(convertCamel(input, "toCamel")).toBe(toCamel)

    // 行分隔与符号未被破坏
    expect(toCamel.split("\n")).toHaveLength(4)
    expect(toSnake).toContain(";")
    expect(toSnake).toContain("=")
    expect(toSnake).toContain("(")
    expect(toSnake).toContain(")")
  })
})
