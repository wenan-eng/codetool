/**
 * image-extract — 从 HTML 中提取 <img src> 的 URL
 * 使用正则 <img ... src="...">，大小写不敏感，支持单/双引号及无引号
 */

export function imageExtract(html: string): string[] {
  if (!html) return []
  const urls: string[] = []
  // 正则解释：
  // <img\b      匹配 <img 单词边界，确保是 img 标签
  // [^>]*?      非贪婪匹配任意非 > 字符
  // \bsrc\s*=\s* 匹配 src 属性
  // (?: "([^"]+)" | '([^']+)' | ([^\s"'`>]+) ) 三种引号情况
  const regex = /<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'`>]+))/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(html)) !== null) {
    const url = match[1] ?? match[2] ?? match[3]
    if (url) {
      urls.push(url.trim())
    }
  }
  return urls
}

// 别名以兼容不同导入方式
export const extractImages = imageExtract
export const extractImageUrls = imageExtract
export const getImageUrls = imageExtract
export default imageExtract
