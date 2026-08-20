export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
        <div><h4 className="font-semibold mb-2">热门推荐</h4><a href="/json-formatter">JSON格式化</a></div>
        <div><h4 className="font-semibold mb-2">站长工具</h4><a href="/myip">IP查询</a></div>
        <div><h4 className="font-semibold mb-2">关于</h4><a href="/about">关于我们</a><a href="/privacy" className="block">隐私政策</a></div>
        <div><h4 className="font-semibold mb-2">合规</h4><a href="/terms">服务条款</a><a href="/contact">联系我们</a></div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4">© 2026 工具箱 All Rights Reserved</div>
    </footer>
  )
}
