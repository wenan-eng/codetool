import Editor from "./Editor"
import HexConverterEditor from "./HexConverterEditor"
import CamelEditor from "./CamelEditor"
import DatetimeConverterEditor from "./DatetimeConverterEditor"
import HtmlEscapeEditor from "./HtmlEscapeEditor"
import JsonFlattenEditor from "./JsonFlattenEditor"
import JsonUnflattenEditor from "./JsonUnflattenEditor"
import JsonSortEditor from "./JsonSortEditor"
import TimestampEditor from "./TimestampEditor"
import TimestampBatchEditor from "./TimestampBatchEditor"
import CodeBeautifyEditor from "./CodeBeautifyEditor"
import DataConvert2Editor from "./DataConvert2Editor"
import DataConvertEditor from "./DataConvertEditor"
import AdSlot from "./AdSlot"
import { faqJsonLd } from "@/lib/seo"
import zh from "@/messages/zh.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"
const messagesMap: Record<string, any> = { zh, en, es }
export default function ToolLayout({ tool, locale = "zh" }: { tool: any, locale?: string }) {
  const msgs = (messagesMap[locale as string] || zh).toolLayout
  const h1 = locale==='en' ? (tool.h1_en || tool.h1) : locale==='es' ? (tool.h1_es || tool.h1) : tool.h1
  const description = locale==='en' ? (tool.description_en || tool.description) : locale==='es' ? (tool.description_es || tool.description) : tool.description
  const tags = locale==='en' ? (tool.tags_en || tool.tags) : locale==='es' ? (tool.tags_es || tool.tags) : tool.tags
  const faqs = locale==='en' ? (tool.faqs_en || tool.faqs) : locale==='es' ? (tool.faqs_es || tool.faqs) : tool.faqs
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{h1}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">{tags.map((t:string)=><span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">{t}</span>)}</div>
        <p className="text-sm text-gray-600 mt-3">{description}</p>
      </div>
      <AdSlot slot="top" />
      {tool.id === "camel" ? <CamelEditor locale={locale} /> : tool.id === "hex-converter" ? <HexConverterEditor locale={locale} /> : tool.id === "timestamp" ? <TimestampEditor locale={locale} /> : tool.id === "timestamp-batch" ? <TimestampBatchEditor locale={locale} /> : tool.id === "html-escape" ? <HtmlEscapeEditor locale={locale} /> : tool.id === "datetime-converter" ? <DatetimeConverterEditor locale={locale} /> : tool.id === "json-flatten" ? <JsonFlattenEditor locale={locale} /> : tool.id === "json-unflatten" ? <JsonUnflattenEditor locale={locale} /> : tool.id === "json-sort" ? <JsonSortEditor locale={locale} /> : tool.id === "js-formatter" ? <CodeBeautifyEditor toolId="js-formatter" locale={locale} /> : tool.id === "html-formatter" ? <CodeBeautifyEditor toolId="html-formatter" locale={locale} /> : tool.id === "css-formatter" ? <CodeBeautifyEditor toolId="css-formatter" locale={locale} /> : tool.id === "sql-format" ? <CodeBeautifyEditor toolId="sql-format" locale={locale} /> : tool.id === "sql-formatter" ? <CodeBeautifyEditor toolId="sql-format" locale={locale} /> : tool.id === "yaml-formatter" ? <CodeBeautifyEditor toolId="yaml-formatter" locale={locale} /> : tool.id === "json-sql" ? <DataConvert2Editor toolId="json-sql" locale={locale} /> : tool.id === "sql-json" ? <DataConvert2Editor toolId="sql-json" locale={locale} /> : tool.id === "json-cookie" ? <DataConvert2Editor toolId="json-cookie" locale={locale} /> : tool.id === "cookie-json" ? <DataConvert2Editor toolId="cookie-json" locale={locale} /> : tool.id === "json-base64" ? <DataConvert2Editor toolId="json-base64" locale={locale} /> : tool.id === "xml-base64" ? <DataConvert2Editor toolId="xml-base64" locale={locale} /> : tool.id === "json-excel" ? <DataConvert2Editor toolId="json-excel" locale={locale} /> : tool.id === "excel-json" ? <DataConvert2Editor toolId="excel-json" locale={locale} /> : tool.id === "json-csv" ? <DataConvertEditor mode="json-csv" locale={locale} /> : tool.id === "csv-json" ? <DataConvertEditor mode="csv-json" locale={locale} /> : tool.id === "json-yaml" ? <DataConvertEditor mode="json-yaml" locale={locale} /> : tool.id === "yaml-json" ? <DataConvertEditor mode="yaml-json" locale={locale} /> : tool.id === "json-xml" ? <DataConvertEditor mode="json-xml" locale={locale} /> : tool.id === "xml-json" ? <DataConvertEditor mode="xml-json" locale={locale} /> : <Editor locale={locale} />}
      <AdSlot slot="editor-bottom" />
      <section className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">{msgs.usageTitle}</h2>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>{msgs.usage1}</li>
          <li>{msgs.usage2}</li>
          <li>{msgs.usage3}</li>
          <li>{msgs.usage4}</li>
        </ul>
      </section>
      <section className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">{msgs.relatedTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tool.related.map((id:string)=><a key={id} href={`/${locale}/${id}`} className="p-3 border rounded-lg text-sm hover:border-blue-300">{id}</a>)}
        </div>
      </section>
      <AdSlot slot="faq-middle" />
      <section className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">{msgs.faqTitle}</h2>
        {faqs.map((f:any,i:number)=><details key={i} className="py-2 border-b last:border-0"><summary className="font-medium text-sm cursor-pointer">{f.q}</summary><p className="text-sm text-gray-600 mt-2">{f.a}</p></details>)}
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd(faqs))}} />
    </div>
  )
}
