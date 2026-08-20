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
