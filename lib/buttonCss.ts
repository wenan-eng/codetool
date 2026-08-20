/**
 * buttonCss — button CSS generator
 * 从选项生成 CSS 字符串与内联 style 对象
 */

export type ButtonOptions = {
  text?: string
  bgColor: string
  textColor: string
  borderColor?: string
  borderWidth?: number // px
  borderStyle?: "solid" | "dashed" | "none"
  borderRadius: number // px
  paddingY: number // px
  paddingX: number // px
  fontSize: number // px
  fontWeight?: number | string
  boxShadow?: string
  hoverBgColor?: string
  hoverTextColor?: string
  transition?: string
  width?: string // e.g. auto, 100%
}

export const defaultButtonOptions: ButtonOptions = {
  text: "Button",
  bgColor: "#3b82f6",
  textColor: "#ffffff",
  borderColor: "#3b82f6",
  borderWidth: 1,
  borderStyle: "solid",
  borderRadius: 8,
  paddingY: 10,
  paddingX: 20,
  fontSize: 14,
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
  hoverBgColor: "#2563eb",
  hoverTextColor: "#ffffff",
  transition: "all 0.2s ease",
  width: "auto",
}

export function generateButtonCss(opts: ButtonOptions, className = ".btn"): string {
  const o = { ...defaultButtonOptions, ...opts }
  // normalize colors
  const border = o.borderStyle === "none" ? "none" : `${o.borderWidth}px ${o.borderStyle} ${o.borderColor}`
  const lines: string[] = []
  lines.push(`${className} {`)
  lines.push(`  display: inline-flex;`)
  lines.push(`  align-items: center;`)
  lines.push(`  justify-content: center;`)
  lines.push(`  background-color: ${o.bgColor};`)
  lines.push(`  color: ${o.textColor};`)
  lines.push(`  border: ${border};`)
  lines.push(`  border-radius: ${o.borderRadius}px;`)
  lines.push(`  padding: ${o.paddingY}px ${o.paddingX}px;`)
  lines.push(`  font-size: ${o.fontSize}px;`)
  if (o.fontWeight !== undefined) lines.push(`  font-weight: ${o.fontWeight};`)
  if (o.boxShadow) lines.push(`  box-shadow: ${o.boxShadow};`)
  if (o.transition) lines.push(`  transition: ${o.transition};`)
  lines.push(`  cursor: pointer;`)
  if (o.width && o.width !== "auto") lines.push(`  width: ${o.width};`)
  lines.push(`}`)
  if (o.hoverBgColor || o.hoverTextColor) {
    lines.push(`${className}:hover {`)
    if (o.hoverBgColor) lines.push(`  background-color: ${o.hoverBgColor};`)
    if (o.hoverTextColor) lines.push(`  color: ${o.hoverTextColor};`)
    lines.push(`}`)
  }
  return lines.join("\n")
}

export function generateButtonInlineStyle(opts: ButtonOptions): React.CSSProperties {
  const o = { ...defaultButtonOptions, ...opts }
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: o.bgColor,
    color: o.textColor,
    border: o.borderStyle === "none" ? "none" : `${o.borderWidth}px ${o.borderStyle} ${o.borderColor}`,
    borderRadius: `${o.borderRadius}px`,
    padding: `${o.paddingY}px ${o.paddingX}px`,
    fontSize: `${o.fontSize}px`,
    fontWeight: o.fontWeight as any,
    boxShadow: o.boxShadow,
    transition: o.transition,
    cursor: "pointer",
    width: o.width !== "auto" ? (o.width as any) : undefined,
  }
}

export function generateButtonHtml(opts: ButtonOptions, className = "btn"): string {
  const text = opts.text || defaultButtonOptions.text || "Button"
  return `<button class="${className}">${escapeHtml(text)}</button>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export default { defaultButtonOptions, generateButtonCss, generateButtonInlineStyle, generateButtonHtml }
