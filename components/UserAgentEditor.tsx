"use client"
import { useState } from "react"

const UA_LIST: { group: string; items: { name: string; ua: string }[] }[] = [
  {
    group: "Windows 浏览器",
    items: [
      { name: "Chrome (Win10)", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" },
      { name: "Edge", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0" },
      { name: "Firefox", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0" },
    ],
  },
  {
    group: "移动端",
    items: [
      { name: "iPhone Safari", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1" },
      { name: "Android Chrome", ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36" },
      { name: "iPad Safari", ua: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1" },
    ],
  },
  {
    group: "搜索引擎爬虫",
    items: [
      { name: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
      { name: "Baiduspider", ua: "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" },
      { name: "Bingbot", ua: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" },
    ],
  },
]

export default function UserAgentEditor({ locale = "zh" }: { locale?: string }) {
  const [copied, setCopied] = useState("")
  const t = (zh: string, en: string, es: string) => (locale === "en" ? en : locale === "es" ? es : zh)

  const copy = async (ua: string) => {
    await navigator.clipboard.writeText(ua)
    setCopied(ua.slice(0, 20))
    setTimeout(() => setCopied(""), 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      {UA_LIST.map(g => (
        <div key={g.group}>
          <div className="text-sm font-medium text-gray-700 mb-2">{g.group}</div>
          <div className="flex flex-col gap-2">
            {g.items.map(item => (
              <button key={item.name} onClick={() => copy(item.ua)} className="bg-white border rounded-xl p-3 text-left hover:border-blue-300 transition">
                <div className="text-sm font-medium mb-1">{copied === item.ua.slice(0, 20) ? `✅ ${t("已复制", "Copied", "Copiado")}` : item.name} <span className="text-xs text-gray-400">⧉</span></div>
                <div className="font-mono text-xs text-gray-500 break-all">{item.ua}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400">{t("点击卡片复制完整 UA；所有操作均在浏览器本地完成", "Click a card to copy its UA. All local.", "Clic para copiar. Todo local.")}</p>
    </div>
  )
}
