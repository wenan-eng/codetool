/**
 * JSON Flatten / Unflatten / SortKeys — 纯函数
 * 复刻 lanren-tools 行为：
 * - flatten: 嵌套对象 -> 点号扁平，如 {a:{b:1}} -> {"a.b":1}，数组索引同样用点号 {a:[1,2]} -> {"a.0":1,"a.1":2}
 * - unflatten: 扁平点号 -> 嵌套，数字段自动还原为数组
 * - sortKeys: 递归按 key 字母序排序
 */

export function flatten(
  obj: any,
  prefix = "",
  result: Record<string, any> = {}
): Record<string, any> {
  // 原始类型或 null：直接以 prefix 为 key 存入
  if (obj === null || typeof obj !== "object") {
    if (prefix) result[prefix] = obj
    return result
  }

  // 空对象/空数组：prefix 非空时保留空结构？这里扁平后不产生 key，返回 result
  const keys = Array.isArray(obj) ? obj.map((_, i) => String(i)) : Object.keys(obj)
  if (keys.length === 0) {
    if (prefix) result[prefix] = obj
    return result
  }

  for (const k of keys) {
    const v: any = Array.isArray(obj) ? (obj as any)[Number(k)] : (obj as any)[k]
    const newKey = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === "object") {
      // 递归；空对象/数组已在上面处理
      const isEmpty = Array.isArray(v) ? v.length === 0 : Object.keys(v).length === 0
      if (isEmpty) {
        result[newKey] = v
      } else {
        flatten(v, newKey, result)
      }
    } else {
      result[newKey] = v
    }
  }
  return result
}

export function unflatten(flat: Record<string, any>): any {
  const result: any = {}
  for (const [flatKey, value] of Object.entries(flat)) {
    if (!flatKey) continue
    const parts = flatKey.split(".")
    let cur: any = result
    for (let i = 0; i < parts.length; i++) {
      const k = parts[i]
      const isLast = i === parts.length - 1
      const nextKey = parts[i + 1]
      const nextIsArrayIndex = nextKey !== undefined && /^\d+$/.test(nextKey)

      if (isLast) {
        // 若当前容器是数组且 k 为数字索引
        if (Array.isArray(cur) && /^\d+$/.test(k)) {
          cur[Number(k)] = value
        } else {
          cur[k] = value
        }
      } else {
        // 需要下钻
        const isArrayIndex = /^\d+$/.test(k)
        // 确保 cur[k] 存在
        if (Array.isArray(cur) && isArrayIndex) {
          const idx = Number(k)
          if (cur[idx] === undefined) {
            cur[idx] = nextIsArrayIndex ? [] : {}
          }
          cur = cur[idx]
        } else {
          if (cur[k] === undefined) {
            cur[k] = nextIsArrayIndex ? [] : {}
          } else if (cur[k] === null || typeof cur[k] !== "object") {
            // 冲突：已存在原始值但需要变为对象，覆盖为对象
            cur[k] = nextIsArrayIndex ? [] : {}
          }
          cur = cur[k]
        }
      }
    }
  }
  return result
}

export function sortKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys)
  }
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, any> = {}
    Object.keys(obj)
      .sort()
      .forEach((k) => {
        sorted[k] = sortKeys(obj[k])
      })
    return sorted
  }
  return obj
}

export default { flatten, unflatten, sortKeys }
