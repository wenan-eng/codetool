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
