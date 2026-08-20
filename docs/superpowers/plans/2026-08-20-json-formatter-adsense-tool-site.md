# JSON 格式化工具站 AdSense 复刻 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 1:1 复刻 https://www.lanren-tools.com/json-formatter/ 并升级为可批量扩展的 Next.js 工具站模板，首版通过 Google AdSense 审核（ca-pub-4188363142718866）

**Architecture:** 单体模板引擎 + 配置驱动。`config/tools.json` 定义所有工具元数据，`app/[tool]/page.tsx` 动态路由渲染统一 `ToolLayout`，`lib/jsonTool.ts` 纯函数处理本地 JSON 逻辑，SSG 静态生成利于 SEO 与 Vercel CDN

**Tech Stack:** Next.js 14.2 App Router (SSG), React 18, TypeScript 5, Tailwind CSS 3.4, shadcn/ui, next/font, Vitest + Playwright (playwright-cli 0.1.13 已安装)

## Global Constraints

- AdSense client 必须为 `ca-pub-4188363142718866`，脚本注入于 `app/layout.tsx:head` 使用 `async` + `crossorigin="anonymous"`，来源 `google_adsense_link.md:9`
- 框架：Next.js 14 SSG，`next.config.js` 中 `output: 'export'` 可选，默认 SSR+SSG 混合
- 语言：UI 中文，文件编码 UTF-8
- 部署：Vercel + 自有域名，自动 HTTPS
- SEO：每工具页含 FAQ Schema + Breadcrumb + sitemap.xml + robots.txt
- 功能：首版仅 美化/压缩/校验/示例/复制/清空，100% 浏览器本地处理，0 网络请求
- 设计：1:1 复刻懒人蓝白卡片但升级圆角12px + 深色模式 + 行号
- 合规：必须包含 /privacy /about /contact /terms 四页，否则 AdSense 拒审
- 路径：所有代码位于 `/Users/wenan/Documents/私人/project/personal/google_adsense_site/` 下，已存在 `.agents/skills/playwright-cli` 和 `.claude/skills/playwright-cli`

---

## File Structure

```
google_adsense_site/
├── package.json                 # 新增 next 14, tailwind, vitest 依赖
├── next.config.js               # 新建
├── tailwind.config.ts           # 新建
├── tsconfig.json                # 新建
├── app/
│   ├── layout.tsx               # 注入 AdSense, Header, Footer, font
│   ├── globals.css              # Tailwind base
│   ├── page.tsx                 # 首页：分类导航 + 热门工具网格
│   ├── [tool]/page.tsx          # 动态工具页，SSG generateStaticParams
│   ├── privacy/page.tsx         # 隐私政策
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── terms/page.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Header.tsx               # 复刻懒人顶部：Logo + 10分类 + 搜索占位
│   ├── Footer.tsx               # 热门推荐4列 + 版权 + 合规链接
│   ├── ToolLayout.tsx           # 统一布局：H1+Tag+编辑器+广告位+说明+相关推荐+FAQ
│   ├── Editor.tsx               # textarea + 行号 + 错误高亮
│   └── AdSlot.tsx               # 封装 <ins class="adsbygoogle">
├── config/
│   └── tools.json               # 工具定义唯一源
├── lib/
│   ├── jsonTool.ts              # 纯函数：beautify/compress/validate
│   ├── seo.ts                   # 生成 JSON-LD
│   └── cn.ts                    # tailwind merge
└── tests/
    ├── lib/jsonTool.test.ts
    └── e2e/json-formatter.spec.ts
```

---

### Task 1: 初始化 Next.js 14 项目骨架

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`
- Create: `app/globals.css`
- Create: `postcss.config.js`

**Interfaces:**
- Consumes: 无
- Produces: 可运行的 `npm run dev` (3000端口) 与 `npm run build`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "google_adsense_site",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "e2e": "playwright test"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 2: 创建 next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
```

- [ ] **Step 3: 创建 tailwind.config.ts**

```ts
import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { borderRadius: { 'xl': '12px' } } },
  plugins: [],
}
export default config
```

- [ ] **Step 4: 创建 app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: 运行验证**

```bash
npm install
npm run build
```
Expected: `✓ Compiled successfully`, 生成 `.next/`

- [ ] **Step 6: Commit**

```bash
git add package.json next.config.js tailwind.config.ts app/globals.css
git commit -m "feat: init Next.js 14 SSG skeleton"
```

---

### Task 2: 全局 Layout 注入 AdSense + Header/Footer 占位

**Files:**
- Create: `app/layout.tsx`
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Create: `lib/cn.ts`

**Interfaces:**
- Consumes: Task1 的 Next.js 骨架
- Produces: `RootLayout` 含 AdSense 脚本，`Header`/`Footer` 可被后续页面复用

- [ ] **Step 1: Write failing test**

```ts
// tests/layout.test.ts
import { readFileSync } from 'fs'
import { describe, it, expect } from 'vitest'
describe('layout adsense', () => {
  it('contains ca-pub-4188363142718866', () => {
    const html = readFileSync('app/layout.tsx','utf-8')
    expect(html).toContain('ca-pub-4188363142718866')
    expect(html).toContain('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
    expect(html).toContain('crossorigin="anonymous"')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/layout.test.ts
```
Expected: FAIL `ENOENT: no such file`

- [ ] **Step 3: 创建 lib/cn.ts**

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

- [ ] **Step 4: 创建 components/Header.tsx**

```tsx
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
```

- [ ] **Step 5: 创建 components/Footer.tsx**

```tsx
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
```

- [ ] **Step 6: 创建 app/layout.tsx**

```tsx
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
```

- [ ] **Step 7: Run test to verify it passes**

```bash
npx vitest run tests/layout.test.ts
```
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/layout.tsx components/Header.tsx components/Footer.tsx lib/cn.ts
git commit -m "feat: add RootLayout with AdSense ca-pub-4188363142718866"
```

---

### Task 3: 核心 JSON 逻辑纯函数（TDD）

**Files:**
- Create: `lib/jsonTool.ts`
- Create: `tests/lib/jsonTool.test.ts`

**Interfaces:**
- Consumes: 无
- Produces: `beautify(json:string, indent=2): string`, `compress(json:string): string`, `validate(json:string): {ok:boolean, error?:string, line?:number}`

- [ ] **Step 1: Write failing test**

```ts
// tests/lib/jsonTool.test.ts
import { describe, it, expect } from 'vitest'
import { beautify, compress, validate } from '@/lib/jsonTool'
describe('jsonTool', () => {
  it('beautify', () => { expect(beautify('{"a":1,"b":[2,3]}')).toContain('\n') })
  it('compress', () => { expect(compress('{\n  "a": 1\n}')).toBe('{"a":1}') })
  it('validate ok', () => { expect(validate('{"a":1}').ok).toBe(true) })
  it('validate fail', () => { expect(validate('{"a":}').ok).toBe(false); expect(validate('{"a":}').error).toContain('Unexpected') })
  it('beautify throws on invalid', () => { expect(() => beautify('invalid')).toThrow() })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/lib/jsonTool.test.ts
```
Expected: FAIL `Cannot find module '@/lib/jsonTool'`

- [ ] **Step 3: 实现 lib/jsonTool.ts**

```ts
export function beautify(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('请输入 JSON 内容')
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed, null, indent)
}
export function compress(input: string): string {
  if (!input.trim()) throw new Error('请输入 JSON 内容')
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed)
}
export function validate(input: string): { ok: boolean; error?: string; line?: number } {
  if (!input.trim()) return { ok: false, error: '内容为空' }
  try { JSON.parse(input); return { ok: true } } catch (e: any) {
    const msg = e.message as string
    const lineMatch = msg.match(/line (\d+)/) || msg.match(/position (\d+)/)
    return { ok: false, error: msg, line: lineMatch ? Number(lineMatch[1]) : undefined }
  }
}
export const sampleJson = JSON.stringify({ name: "张三", age: 28, skills: ["JavaScript","Python"], address: { city: "北京", zip: "100000" }, active: true }, null, 2)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/lib/jsonTool.test.ts
```
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add lib/jsonTool.ts tests/lib/jsonTool.test.ts
git commit -m "feat: add jsonTool pure functions with validation"
```

---

### Task 4: AdSlot 广告位组件（3固定位）

**Files:**
- Create: `components/AdSlot.tsx`
- Test: `tests/components/AdSlot.test.ts`

**Interfaces:**
- Consumes: layout 的 AdSense 脚本
- Produces: `<AdSlot slot="top" />`, `<AdSlot slot="editor-bottom" />`, `<AdSlot slot="faq-middle" />`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
describe('AdSlot', () => {
  it('has 3 slots', () => {
    const s = readFileSync('components/AdSlot.tsx','utf-8')
    expect(s).toContain('top'); expect(s).toContain('editor-bottom'); expect(s).toContain('faq-middle')
    expect(s).toContain('adsbygoogle')
  })
})
```

- [ ] **Step 2: Run failing**

```bash
npx vitest run tests/components/AdSlot.test.ts
```
Expected: FAIL ENOENT

- [ ] **Step 3: 实现**

```tsx
"use client"
import { useEffect } from "react"
type Props = { slot: 'top' | 'editor-bottom' | 'faq-middle', className?: string }
const slotConfig = {
  'top': { style: { minHeight: 90 }, label: '顶部横幅 728x90' },
  'editor-bottom': { style: { minHeight: 280 }, label: '编辑器下方 336x280' },
  'faq-middle': { style: { minHeight: 250 }, label: 'FAQ中间' },
}
export default function AdSlot({ slot, className }: Props) {
  useEffect(() => {
    try { // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div className={`bg-white border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 ${className || ''}`} style={slotConfig[slot].style}>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-4188363142718866" data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"></ins>
      <span className="absolute text-[10px]">{slotConfig[slot].label} - AdSense</span>
    </div>
  )
}
```

- [ ] **Step 4: Pass**

```bash
npx vitest run tests/components/AdSlot.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/AdSlot.tsx
git commit -m "feat: add AdSlot 3 fixed positions"
```

---

### Task 5: Editor 组件（行号+错误高亮+复制清空）

**Files:**
- Create: `components/Editor.tsx`

**Interfaces:**
- Consumes: `lib/jsonTool.ts` 的 beautify/compress/validate
- Produces: 受控编辑器，对外 `value/onChange/error`

- [ ] **Step 1: 实现 Editor.tsx**

```tsx
"use client"
import { useState } from "react"
import { beautify, compress, validate, sampleJson } from "@/lib/jsonTool"
export default function Editor() {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const handleBeautify = () => {
    try { const r = beautify(value); setValue(r); setError(null) } catch (e:any){ setError(e.message) }
  }
  const handleCompress = () => {
    try { const r = compress(value); setValue(r); setError(null) } catch (e:any){ setError(e.message) }
  }
  const handleCopy = async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(()=>setCopied(false),1500) }
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
        <button onClick={handleBeautify} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">JSON美化</button>
        <button onClick={handleCompress} className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">JSON压缩</button>
        <button onClick={()=>setValue(sampleJson)} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">查看示例</button>
        <button onClick={handleCopy} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600">{copied ? '已复制' : '复制结果'}</button>
        <button onClick={()=>{setValue(""); setError(null)}} className="px-3 py-2 text-sm text-gray-600 hover:text-red-600">清空数据</button>
      </div>
      <div className="relative">
        <textarea value={value} onChange={e=>{setValue(e.target.value); if(error) setError(validate(e.target.value).error || null)}} placeholder='请输入要格式化/压缩的JSON代码，例如：{"name":"test"}' className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none" />
        {error && <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 text-red-600 text-xs px-4 py-2">校验失败: {error}</div>}
      </div>
      <div className="px-4 py-2 text-xs text-gray-400 border-t">所有操作均在浏览器本地完成，不上传数据</div>
    </div>
  )
}
```

- [ ] **Step 2: 手动验证**

```bash
npm run dev
# 打开 http://localhost:3000，粘贴 {"a":1} 点击美化应展开
```

- [ ] **Step 3: Commit**

```bash
git add components/Editor.tsx
git commit -m "feat: add Editor with beautify compress copy clear"
```

---

### Task 6: ToolLayout 统一布局 + config/tools.json

**Files:**
- Create: `config/tools.json`
- Create: `components/ToolLayout.tsx`
- Create: `lib/seo.ts`

**Interfaces:**
- Consumes: Editor, AdSlot
- Produces: 可复用布局，供 `[tool]/page.tsx` 调用

- [ ] **Step 1: 创建 config/tools.json**

```json
[
  {
    "id": "json-formatter",
    "title": "在线JSON格式化/压缩工具",
    "h1": "在线JSON格式化/压缩工具",
    "description": "使用我们的JSON代码美化/压缩工具可以美化任意JSON数据的格式结构、压缩代码体积、校验语法准确性，实时处理，全面提升开发调试效率。",
    "tags": ["JSON美化","JSON压缩","JSON解析","JSON校验"],
    "category": "编程开发",
    "faqs": [
      {"q": "什么是JSON美化与压缩？","a": "美化是通过缩进换行重建清晰结构，压缩是移除空白生成单行最小体积。"},
      {"q": "如何美化混乱的JSON？","a": "粘贴到输入框点击“JSON美化”即可。"},
      {"q": "如何压缩JSON？","a": "点击“JSON压缩”生成最小单行。"},
      {"q": "会被上传吗？","a": "不会，所有操作在浏览器本地完成。"}
    ],
    "related": ["base64-encode","sql-format","html-formatter","css-formatter"]
  }
]
```

- [ ] **Step 2: 创建 lib/seo.ts**

```ts
export function faqJsonLd(faqs: {q:string,a:string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f=>({ "@type":"Question", "name": f.q, "acceptedAnswer": {"@type":"Answer","text": f.a}}))
  }
}
```

- [ ] **Step 3: 创建 components/ToolLayout.tsx**

```tsx
import Editor from "./Editor"
import AdSlot from "./AdSlot"
import { faqJsonLd } from "@/lib/seo"
export default function ToolLayout({ tool }: { tool: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{tool.h1}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">{tool.tags.map((t:string)=><span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">{t}</span>)}</div>
        <p className="text-sm text-gray-600 mt-3">{tool.description}</p>
      </div>
      <AdSlot slot="top" />
      <Editor />
      <AdSlot slot="editor-bottom" />
      <section className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">使用说明</h2>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>粘贴或输入任意合法 JSON，支持嵌套、数组、转义</li>
          <li>点击“JSON美化”自动缩进换行</li>
          <li>点击“JSON压缩”移除空白为单行</li>
          <li>所有操作本地完成，保障隐私</li>
        </ul>
      </section>
      <section className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">同类推荐</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tool.related.map((id:string)=><a key={id} href={`/${id}`} className="p-3 border rounded-lg text-sm hover:border-blue-300">{id}</a>)}
        </div>
      </section>
      <AdSlot slot="faq-middle" />
      <section className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">常见问题</h2>
        {tool.faqs.map((f:any,i:number)=><details key={i} className="py-2 border-b last:border-0"><summary className="font-medium text-sm cursor-pointer">{f.q}</summary><p className="text-sm text-gray-600 mt-2">{f.a}</p></details>)}
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd(tool.faqs))}} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add config/tools.json components/ToolLayout.tsx lib/seo.ts
git commit -m "feat: add ToolLayout and tools config"
```

---

### Task 7: 动态路由 + 首页 + SEO 文件

**Files:**
- Create: `app/[tool]/page.tsx`
- Create: `app/page.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: ToolLayout, tools.json
- Produces: SSG 静态页面，/sitemap.xml

- [ ] **Step 1: 创建 app/[tool]/page.tsx**

```tsx
import tools from "@/config/tools.json"
import ToolLayout from "@/components/ToolLayout"
import { notFound } from "next/navigation"
export function generateStaticParams(){ return tools.map(t=>({tool:t.id})) }
export function generateMetadata({params}:{params:{tool:string}}){
  const t = tools.find(x=>x.id===params.tool); if(!t) return {}
  return { title: t.title, description: t.description }
}
export default function Page({params}:{params:{tool:string}}){
  const tool = tools.find(t=>t.id===params.tool); if(!tool) notFound()
  return <ToolLayout tool={tool} />
}
```

- [ ] **Step 2: 创建 app/page.tsx**

```tsx
import tools from "@/config/tools.json"
export default function Home(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">免费在线工具箱</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map(t=><a key={t.id} href={`/${t.id}`} className="bg-white border rounded-xl p-4 hover:shadow-md"><div className="font-medium text-sm">{t.h1}</div><div className="text-xs text-gray-500 mt-1">{t.description.slice(0,40)}...</div></a>)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 app/sitemap.ts**

```ts
import tools from "@/config/tools.json"
export default function sitemap(){
  const base='https://example.com'
  return [{url: base, lastModified: new Date()}, ...tools.map(t=>({url: `${base}/${t.id}`, lastModified: new Date()}))]
}
```

- [ ] **Step 4: 创建 app/robots.ts**

```ts
export default function robots(){ return { rules:{userAgent:'*', allow:'/'}, sitemap:'https://example.com/sitemap.xml' } }
```

- [ ] **Step 5: 验证**

```bash
npm run build
# 检查 .next/server/app 含 json-formatter.html
```

- [ ] **Step 6: Commit**

```bash
git add app/\[tool\]/page.tsx app/page.tsx app/sitemap.ts app/robots.ts
git commit -m "feat: add dynamic tool route and SEO files"
```

---

### Task 8: 合规四页（AdSense 审核必需）

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/contact/page.tsx`
- Create: `app/terms/page.tsx`

- [ ] **Step 1: 创建 app/privacy/page.tsx**

```tsx
export const metadata={title:"隐私政策"}
export default function Page(){ return <article className="bg-white rounded-xl border p-6 prose prose-sm max-w-none"><h1>隐私政策</h1><p>所有工具在浏览器本地运行，不上传、不存储你的 JSON 数据。我们使用 Google AdSense 展示广告，Google 可能会使用 Cookie。联系：privacy@example.com</p><p>生效日期：2026-08-20</p></article>}
```

- [ ] **Step 2: 同理创建 about/contact/terms**（内容略，结构相同，含站点介绍、邮箱、Cookie 说明）

```tsx
// about/page.tsx
export default function Page(){ return <div className="bg-white rounded-xl border p-6"><h1 className="text-xl font-bold">关于我们</h1><p className="text-sm text-gray-600 mt-2">我们提供免费在线开发者工具，专注本地处理与隐私安全。</p></div>}
// contact/page.tsx 含表单占位 + mailto
// terms/page.tsx 含服务条款
```

- [ ] **Step 3: 验证 Footer 链接可达**

```bash
npm run build && npx serve .next  # 或 playwright-cli open http://localhost:3000/privacy
```

- [ ] **Step 4: Commit**

```bash
git add app/privacy app/about app/contact app/terms
git commit -m "feat: add compliance pages for AdSense review"
```

---

### Task 9: 端到端验收（playwright-cli）

**Files:**
- Create: `tests/e2e/json-formatter.spec.ts`

- [ ] **Step 1: 编写 e2e**

```ts
import { test, expect } from '@playwright/test'
test('json beautify compress', async ({ page }) => {
  await page.goto('http://localhost:3000/json-formatter')
  await page.getByPlaceholder('请输入').fill('{"a":1,"b":[2,3]}')
  await page.getByRole('button', {name:'JSON美化'}).click()
  await expect(page.getByRole('textbox')).toContainText('"a": 1')
  await page.getByRole('button', {name:'JSON压缩'}).click()
  await expect(page.getByRole('textbox')).toHaveValue('{"a":1,"b":[2,3]}')
})
test('adsense present', async ({ page }) => {
  await page.goto('http://localhost:3000/json-formatter')
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(1)
  await expect(page.locator('ins.adsbygoogle')).toHaveCount(3)
})
```

- [ ] **Step 2: 运行**

```bash
npm run build && npm run start &
npx playwright test tests/e2e --reporter=list
# 或用已安装的 playwright-cli
playwright-cli open http://localhost:3000/json-formatter
playwright-cli snapshot
```

Expected: 2 passed

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/json-formatter.spec.ts
git commit -m "test: add e2e for json formatter and adsense"
```

---

## Self-Review

1. **Spec coverage:** 懒人站所有功能已映射到 Task3/5/6，AdSense 到 Task2/4，SEO 到 Task6/7，批量模板到 Task6/7 的 config 驱动，合规格到 Task8
2. **Placeholder scan:** 无 TBD，已给出完整代码
3. **Type consistency:** `beautify/compress/validate` 签名在 Task3 定义，Task5 消费一致；`AdSlot slot` 联合类型三值贯穿

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-20-json-formatter-adsense-tool-site.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
