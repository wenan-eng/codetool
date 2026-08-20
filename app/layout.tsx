import "./globals.css"

export const metadata = {
  title: "在线工具箱 - 免费开发者工具",
  description: "免费在线工具集合",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#f8fafc] text-gray-900">{children}</body>
    </html>
  )
}
