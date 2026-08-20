"use client"
type Props = { slot: 'top' | 'editor-bottom' | 'faq-middle', className?: string }
// adsbygoogle - 自动广告由 app/[locale]/layout.tsx 中的 Script 加载，手动占位已隐藏
// 自定义占位已隐藏，仅保留谷歌自动广告 Script（见 app/[locale]/layout.tsx）
// 如需恢复手动广告位，将 return null 改回原 <ins class="adsbygoogle"> 渲染
export default function AdSlot(_props: Props) {
  return null
}
