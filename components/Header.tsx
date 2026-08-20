export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-bold text-blue-600">工具箱</a>
        <nav className="hidden md:flex gap-4 text-sm text-gray-600">
          <a href="/code">编程开发</a><a href="/text">文本处理</a><a href="/encode">编码加密</a>
        </nav>
        <div className="text-sm text-gray-400">搜索工具</div>
      </div>
    </header>
  )
}
