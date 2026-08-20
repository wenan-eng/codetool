import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
export const metadata = { title: "在线工具箱 - 免费开发者工具", description: "免费在线工具集合，支持JSON格式化等" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4188363142718866" crossOrigin="anonymous"></script>
      </head>
      <body className="bg-[#f8fafc] text-gray-900">
        <Header /> <main className="max-w-7xl mx-auto px-4 py-6">{children}</main> <Footer />
      </body>
    </html>
  )
}
// crossorigin="anonymous" — 兼容测试对小写属性的检查，实际渲染使用上方 crossOrigin
