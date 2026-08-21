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
import ScreenInspectorEditor from "./ScreenInspectorEditor"
import PhpSerializeEditor from "./PhpSerializeEditor"
import PwaManifestEditor from "./PwaManifestEditor"
import ButtonCssEditor from "./ButtonCssEditor"
import LoadingEditor from "./LoadingEditor"
import StripCommentsEditor from "./StripCommentsEditor"
import HtmlFilterEditor from "./HtmlFilterEditor"
import CsvMergeEditor from "./CsvMergeEditor"
import ImageExtractEditor from "./ImageExtractEditor"
import ChartEditor from "./ChartEditor"
import AdSlot from "./AdSlot"
import { faqJsonLd } from "@/lib/seo"
import UrlEncodeEditor from "./UrlEncodeEditor"
import EscapeEditor from "./EscapeEditor"
import Utf8Editor from "./Utf8Editor"
import HtmlEntityEditor from "./HtmlEntityEditor"
import MorseEditor from "./MorseEditor"
import TextHexEditor from "./TextHexEditor"
import TextOctalEditor from "./TextOctalEditor"
import TextBinEditor from "./TextBinEditor"
import Base32EncodeEditor from "./Base32EncodeEditor"
import Base64EncodeEditor from "./Base64EncodeEditor"
import Base64BulkEditor from "./Base64BulkEditor"
import JwtDecoderEditor from "./JwtDecoderEditor"
import RandomPwdEditor from "./RandomPwdEditor"
import EntropyCalculatorEditor from "./EntropyCalculatorEditor"
import GzipEditor from "./GzipEditor"
import Md5Editor from "./Md5Editor"
import Md5BatchEditor from "./Md5BatchEditor"
import ShaEditor from "./ShaEditor"
import Md4Editor from "./Md4Editor"
import MySqlPasswordEditor from "./MySqlPasswordEditor"
import HtpasswdEditor from "./HtpasswdEditor"
import AesEncryptEditor from "./AesEncryptEditor"
import DesEncryptEditor from "./DesEncryptEditor"
import UrlHexEncodeEditor from "./UrlHexEncodeEditor"
import FileBase64Editor from "./FileBase64Editor"
import ImageBase64Editor from "./ImageBase64Editor"
import Base64FileEditor from "./Base64FileEditor"
import Base64ImageEditor from "./Base64ImageEditor"
import LsbEmbedEditor from "./LsbEmbedEditor"
import LsbExtractEditor from "./LsbExtractEditor"
import Md5VerifyEditor from "./Md5VerifyEditor"
import Md5BatchVerifyEditor from "./Md5BatchVerifyEditor"
import JsObfuscatorEditor from "./JsObfuscatorEditor"
import JsObfuscatorAdvancedEditor from "./JsObfuscatorAdvancedEditor"
import TextToolEditor from "./TextToolEditor"
import ExtractToolEditor from "./ExtractToolEditor"
import IdcardExtractEditor from "./IdcardExtractEditor"
import NetParserEditor from "./NetParserEditor"
import ConvertToolEditor from "./ConvertToolEditor"
import UnitConverterEditor from "./UnitConverterEditor"
import CssUnitEditor from "./CssUnitEditor"
import BaseConverterEditor from "./BaseConverterEditor"
import ShoeSizeEditor from "./ShoeSizeEditor"
import RmbUpperEditor from "./RmbUpperEditor"
import BloodTypeEditor from "./BloodTypeEditor"
import ImageAdjustEditor from "./ImageAdjustEditor"
import ImageFormatEditor from "./ImageFormatEditor"
import WatermarkEditor from "./WatermarkEditor"
import ImageCompressorEditor from "./ImageCompressorEditor"
import ColorPickerEditor from "./ColorPickerEditor"
import ImageColorEditor from "./ImageColorEditor"
import ExifViewerEditor from "./ExifViewerEditor"
import PlaceholderEditor from "./PlaceholderEditor"
import RoundImageEditor from "./RoundImageEditor"
import NineGridEditor from "./NineGridEditor"
import QrcodeEditor from "./QrcodeEditor"
import QrcodeDecodeEditor from "./QrcodeDecodeEditor"
import IpToolsEditor from "./IpToolsEditor"
import RobotsEditor from "./RobotsEditor"
import MetaGeneratorEditor from "./MetaGeneratorEditor"
import ProportionCalculatorEditor from "./ProportionCalculatorEditor"
import RegexGeneratorEditor from "./RegexGeneratorEditor"
import ColorConverterEditor from "./ColorConverterEditor"
import UserAgentEditor from "./UserAgentEditor"
import ClientInfoEditor from "./ClientInfoEditor"
import DevicePreviewEditor from "./DevicePreviewEditor"
import ShortcutEditor from "./ShortcutEditor"
import SitemapExtractorEditor from "./SitemapExtractorEditor"
import DensityEditor from "./DensityEditor"
import LogAnalysisEditor from "./LogAnalysisEditor"
import LoanCalcEditor from "./LoanCalcEditor"
import { BonusTaxEditor, StampDutyEditor, RoiEditor } from "./TaxRoiEditors"
import PayslipEditor from "./PayslipEditor"
import CountdownEditor from "./CountdownEditor"
import { TOOL_CATEGORY_MAP } from "@/lib/unitConverter"
import tools from "@/config/tools.json"
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
  const icon = (tool as any).icon as string
  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        {icon && <img src={icon} alt="" width={48} height={48} className="w-12 h-12 rounded-xl bg-blue-50 p-2 border shrink-0" />}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{h1}</h1>
          <div className="flex gap-2 mt-2 flex-wrap">{tags.map((t:string)=><span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">{t}</span>)}</div>
          <p className="text-sm text-gray-600 mt-3">{description}</p>
        </div>
      </div>
      <AdSlot slot="top" />
      {tool.id === "camel" ? <CamelEditor locale={locale} /> : tool.id === "hex-converter" ? <HexConverterEditor locale={locale} /> : tool.id === "timestamp" ? <TimestampEditor locale={locale} /> : tool.id === "timestamp-batch" ? <TimestampBatchEditor locale={locale} /> : tool.id === "html-escape" ? <HtmlEscapeEditor locale={locale} /> : tool.id === "datetime-converter" ? <DatetimeConverterEditor locale={locale} /> : tool.id === "json-flatten" ? <JsonFlattenEditor locale={locale} /> : tool.id === "json-unflatten" ? <JsonUnflattenEditor locale={locale} /> : tool.id === "json-sort" ? <JsonSortEditor locale={locale} /> : tool.id === "js-formatter" ? <CodeBeautifyEditor toolId="js-formatter" locale={locale} /> : tool.id === "html-formatter" ? <CodeBeautifyEditor toolId="html-formatter" locale={locale} /> : tool.id === "css-formatter" ? <CodeBeautifyEditor toolId="css-formatter" locale={locale} /> : tool.id === "sql-format" ? <CodeBeautifyEditor toolId="sql-format" locale={locale} /> : tool.id === "sql-formatter" ? <CodeBeautifyEditor toolId="sql-format" locale={locale} /> : tool.id === "yaml-formatter" ? <CodeBeautifyEditor toolId="yaml-formatter" locale={locale} /> : tool.id === "json-sql" ? <DataConvert2Editor toolId="json-sql" locale={locale} /> : tool.id === "sql-json" ? <DataConvert2Editor toolId="sql-json" locale={locale} /> : tool.id === "json-cookie" ? <DataConvert2Editor toolId="json-cookie" locale={locale} /> : tool.id === "cookie-json" ? <DataConvert2Editor toolId="cookie-json" locale={locale} /> : tool.id === "json-base64" ? <DataConvert2Editor toolId="json-base64" locale={locale} /> : tool.id === "xml-base64" ? <DataConvert2Editor toolId="xml-base64" locale={locale} /> : tool.id === "json-excel" ? <DataConvert2Editor toolId="json-excel" locale={locale} /> : tool.id === "excel-json" ? <DataConvert2Editor toolId="excel-json" locale={locale} /> : tool.id === "json-csv" ? <DataConvertEditor mode="json-csv" locale={locale} /> : tool.id === "csv-json" ? <DataConvertEditor mode="csv-json" locale={locale} /> : tool.id === "json-yaml" ? <DataConvertEditor mode="json-yaml" locale={locale} /> : tool.id === "yaml-json" ? <DataConvertEditor mode="yaml-json" locale={locale} /> : tool.id === "json-xml" ? <DataConvertEditor mode="json-xml" locale={locale} /> : tool.id === "xml-json" ? <DataConvertEditor mode="xml-json" locale={locale} /> : tool.id === "screen-inspector" ? <ScreenInspectorEditor locale={locale} /> : tool.id === "php-serialize" ? <PhpSerializeEditor locale={locale} /> : tool.id === "pwa-manifest" ? <PwaManifestEditor locale={locale} /> : tool.id === "button-css" ? <ButtonCssEditor locale={locale} /> : tool.id === "loading" ? <LoadingEditor locale={locale} /> : tool.id === "strip-comments" ? <StripCommentsEditor locale={locale} /> : tool.id === "html-filter" ? <HtmlFilterEditor locale={locale} /> : tool.id === "csv-merge" ? <CsvMergeEditor locale={locale} /> : tool.id === "image-extract" ? <ImageExtractEditor locale={locale} /> : ["line-chart","bar-chart","pie-chart","horizontal-bar-chart","area-chart","doughnut-chart","scatter-chart","radar-chart","histogram-chart","multi-line-chart","stacked-area-chart","waterfall-chart"].includes(tool.id) ? <ChartEditor chartType={tool.id} locale={locale} /> : tool.id === "url-encode" ? <UrlEncodeEditor locale={locale} /> : tool.id === "escape" ? <EscapeEditor locale={locale} /> : tool.id === "utf-8" ? <Utf8Editor locale={locale} /> : tool.id === "html-entity" ? <HtmlEntityEditor locale={locale} /> : tool.id === "morse" ? <MorseEditor locale={locale} /> : tool.id === "text-hex" ? <TextHexEditor locale={locale} /> : tool.id === "text-octal" ? <TextOctalEditor locale={locale} /> : tool.id === "text-bin" ? <TextBinEditor locale={locale} /> : tool.id === "base32-encode" ? <Base32EncodeEditor locale={locale} /> : tool.id === "base64-encode" ? <Base64EncodeEditor locale={locale} /> : tool.id === "base64-bulk" ? <Base64BulkEditor locale={locale} /> : tool.id === "jwt-decoder" ? <JwtDecoderEditor locale={locale} /> : tool.id === "random-pwd" ? <RandomPwdEditor locale={locale} /> : tool.id === "entropy-calculator" ? <EntropyCalculatorEditor locale={locale} /> : tool.id === "gzip" ? <GzipEditor locale={locale} /> : tool.id === "md5" ? <Md5Editor locale={locale} /> : tool.id === "md5-batch" ? <Md5BatchEditor locale={locale} /> : tool.id === "sha" ? <ShaEditor locale={locale} /> : tool.id === "md4" ? <Md4Editor locale={locale} /> : tool.id === "mysql-password" ? <MySqlPasswordEditor locale={locale} /> : tool.id === "htpasswd" ? <HtpasswdEditor locale={locale} /> : tool.id === "aes-encrypt" ? <AesEncryptEditor locale={locale} /> : tool.id === "des-encrypt" ? <DesEncryptEditor locale={locale} /> : tool.id === "url-hex-encode" ? <UrlHexEncodeEditor locale={locale} /> : tool.id === "base64-file" ? <Base64FileEditor locale={locale} /> : tool.id === "file-base64" ? <FileBase64Editor locale={locale} /> : tool.id === "base64-image" ? <Base64ImageEditor locale={locale} /> : tool.id === "image-base64" ? <ImageBase64Editor locale={locale} /> : tool.id === "lsb-embed" ? <LsbEmbedEditor locale={locale} /> : tool.id === "lsb-extract" ? <LsbExtractEditor locale={locale} /> : tool.id === "md5-verify" ? <Md5VerifyEditor locale={locale} /> : tool.id === "md5-batch-verify" ? <Md5BatchVerifyEditor locale={locale} /> : tool.id === "js-obfuscator" ? <JsObfuscatorEditor locale={locale} /> : tool.id === "js-obfuscator-advanced" ? <JsObfuscatorAdvancedEditor locale={locale} /> : ["letter-converter","symbol-converter","remove-emoji","word-count","line-text","text-line","text-replace","text-split"].includes(tool.id) ? <TextToolEditor toolId={tool.id as "letter-converter"} locale={locale} /> : ["mobile-extractor","email-extractor","url-extractor","idcard-date","text-extract"].includes(tool.id) ? <ExtractToolEditor toolId={tool.id as "mobile-extractor"} locale={locale} /> : tool.id === "idcard-extract" ? <IdcardExtractEditor locale={locale} /> : tool.id === "net-parser" ? <NetParserEditor locale={locale} /> : ["chinese-converter","mars-converter","letter-circle","string-random","sequence-generator","text-formatter","pinyin-converter"].includes(tool.id) ? <ConvertToolEditor toolId={tool.id as "chinese-converter"} locale={locale} /> : ["loan-calculator","car-loan-calculator","wangshangdai-calculator"].includes(tool.id) ? <LoanCalcEditor locale={locale} /> : tool.id === "bonus-tax-calculator" ? <BonusTaxEditor locale={locale} /> : tool.id === "stamp-duty-calculator" ? <StampDutyEditor locale={locale} /> : tool.id === "profit-roi-calculator" ? <RoiEditor locale={locale} /> : tool.id === "payslip" ? <PayslipEditor locale={locale} /> : tool.id === "countdown" ? <CountdownEditor locale={locale} /> : tool.id === "regex-generator" ? <RegexGeneratorEditor locale={locale} /> : tool.id === "color-converter" ? <ColorConverterEditor locale={locale} /> : tool.id === "user-agent" ? <UserAgentEditor locale={locale} /> : tool.id === "client-info" ? <ClientInfoEditor locale={locale} /> : tool.id === "device-preview" ? <DevicePreviewEditor locale={locale} /> : tool.id === "shortcut" ? <ShortcutEditor locale={locale} /> : tool.id === "sitemap-extractor" ? <SitemapExtractorEditor locale={locale} /> : tool.id === "density" ? <DensityEditor locale={locale} /> : tool.id === "log-analysis" ? <LogAnalysisEditor locale={locale} /> : TOOL_CATEGORY_MAP[tool.id] ? <UnitConverterEditor category={TOOL_CATEGORY_MAP[tool.id]} locale={locale} /> : tool.id === "rem-px" || tool.id === "font-size-converter" ? <CssUnitEditor locale={locale} /> : tool.id === "base-converter" ? <BaseConverterEditor locale={locale} /> : tool.id === "shoe-size" ? <ShoeSizeEditor locale={locale} /> : tool.id === "rmb-upper" ? <RmbUpperEditor locale={locale} /> : tool.id === "blood-type" ? <BloodTypeEditor locale={locale} /> : ["image-brightness","image-contrast","image-saturation","image-hsl","image-temperature","image-highlight","image-fader","image-sharpener","blur-image","image-rotate","image-mirror","image-size-revise","image-cropping","image-quality"].includes(tool.id) ? <ImageAdjustEditor toolId={tool.id as "image-brightness"} locale={locale} /> : ["image-jpg","image-png","image-webp","image-bmp","png2jpg","webp2jpg"].includes(tool.id) ? <ImageFormatEditor toolId={tool.id as "image-jpg"} locale={locale} /> : tool.id === "ip2int" || tool.id === "cidr-converter" || tool.id === "ip-subnet" || tool.id === "ip-generator" ? <IpToolsEditor toolId={tool.id} locale={locale} /> : tool.id === "robots" || tool.id === "robots-check" ? <RobotsEditor toolId={tool.id} locale={locale} /> : tool.id === "meta-generator" ? <MetaGeneratorEditor locale={locale} /> : tool.id === "proportion-calculator" ? <ProportionCalculatorEditor locale={locale} /> : tool.id === "watermark" ? <WatermarkEditor locale={locale} /> : tool.id === "image-compressor" ? <ImageCompressorEditor locale={locale} /> : tool.id === "color-picker" ? <ColorPickerEditor locale={locale} /> : tool.id === "image-color" ? <ImageColorEditor locale={locale} /> : tool.id === "exif" ? <ExifViewerEditor locale={locale} /> : tool.id === "image-placeholder" ? <PlaceholderEditor locale={locale} /> : tool.id === "round-image" ? <RoundImageEditor locale={locale} /> : tool.id === "nine-grid" ? <NineGridEditor locale={locale} /> : tool.id === "qrcode" ? <QrcodeEditor locale={locale} /> : tool.id === "qrcode-decode" ? <QrcodeDecodeEditor locale={locale} /> : <Editor locale={locale} />}
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
          {tool.related.map((id:string)=>{
            const rel = (tools as any[]).find((x:any)=>x.id===id) as any
            const relH1 = rel ? (locale==='en' ? rel.h1_en : locale==='es' ? rel.h1_es : rel.h1) : id
            const relIcon = rel?.icon as string
            return <a key={id} href={`/${locale}/${id}`} className="p-3 border rounded-lg text-sm hover:border-blue-300 flex items-center gap-2">{relIcon && <img src={relIcon} alt="" width={24} height={24} className="w-6 h-6 rounded bg-blue-50 p-1 shrink-0" loading="lazy" />}<span className="truncate">{relH1}</span></a>
          })}
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
