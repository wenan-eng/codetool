import tools from "@/config/tools.json"
export default function sitemap(){
  const base='https://example.com'
  return [{url: base, lastModified: new Date()}, ...tools.map(t=>({url: `${base}/${t.id}`, lastModified: new Date()}))]
}
