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
