# 编程开发 50 工具逐个复刻 Loop 规划 — codetool.site

**对齐用户指令**：按 https://www.lanren-tools.com/code/ 的编程开发分类，一步一步来，完成一个再下一个。已选 A 方案临时屏蔽 404，本规划把 4 组的 50 工具全部做完。

## 1. 范围盘点（已验证）

来源 `GET /code/` 解析，4 分组 50 项，已完成 1：

### 已完成
- `json-formatter` JSON格式化/压缩

### 代码美化 8（剩 7）
1. js-formatter JavaScript美化/压缩  2. html-formatter HTML美化/压缩  3. css-formatter CSS格式化/压缩  4. sql-format SQL格式化/压缩  5. yaml-formatter YAML格式化  6. strip-comments 代码注释清理  7. html-filter HTML代码过滤  (8 json-formatter done)

### 数据转换 14
9. json-csv  10. csv-json  11. json-excel  12. excel-json  13. json-sql  14. sql-json  15. json-yaml  16. yaml-json  17. json-xml  18. xml-json  19. json-base64  20. xml-base64  21. json-cookie  22. cookie-json

### 图表工具 12
23. line-chart 折线图  24. bar-chart 柱状图  25. pie-chart 饼图  26. horizontal-bar-chart 条形图  27. area-chart 面积图  28. doughnut-chart 环形图  29. scatter-chart 散点图  30. radar-chart 雷达图  31. histogram-chart 直方图  32. multi-line-chart 多系列折线  33. stacked-area-chart 堆积面积  34. waterfall-chart 瀑布图

### 开发辅助 16
35. timestamp Unix时间戳  36. timestamp-batch 批量时间戳  37. datetime-converter 日期格式  38. hex-converter 进制转换  39. camel 下划线/驼峰  40. html-escape HTML转义  41. json-flatten 扁平化  42. json-unflatten 反扁平化  43. json-sort 键名排序  44. php-serialize PHP序列化  45. csv-merge CSV合并  46. pwa-manifest PWA配置  47. button-css 按钮CSS  48. loading 加载动画  49. screen-inspector 屏幕参数  50. image-extract 图片链接提取

## 2. Loop 执行顺序（风险与价值排序）

一律 `本地 0 上传 + SSG + i18n`，图表类需 chart.js，最后做：

**Phase 0 基建（已做，本 loop 复用）**
- 模板：`lib/*Tool.ts` 纯函数 TDD + `components/Editor.tsx` 复用 + `config/tools.json` 驱动 + `app/[locale]/[tool]/page.tsx` 动态路由 + `messages/*.json`
- 已修复：`app/[locale]/layout.tsx:1` next/script 水合，`Header` 暂时 span

**Phase 1 低风险文本/编码 10 项（先跑通 loop）**
hex-converter → camel → html-escape → timestamp → timestamp-batch → datetime-converter → json-flatten → json-unflatten → json-sort → json-csv（含 csv-json 成对）

**Phase 2 数据转换成对 10 项**
json-yaml/yaml-json → json-xml/xml-json → json-sql/sql-json → json-excel/excel-json → json-base64/xml-base64 → json-cookie/cookie-json（csv-merge 顺带）

**Phase 3 代码美化 7 项**
js-formatter → html-formatter → css-formatter → sql-format → yaml-formatter → strip-comments → html-filter

**Phase 4 开发辅助剩余 6 项**
php-serialize → pwa-manifest → button-css → loading → screen-inspector → image-extract

**Phase 5 图表工具 12 项（批量，依赖 chart.js / echarts）**
line/bar/pie/horizontal-bar/area/doughnut/scatter/radar/histogram/multi-line/stacked-area/waterfall

> 每 Phase 结束：`Header` 对应分类从 `span 即将上线` 改回 `<a>`，并开 `app/[locale]/category/[category]/page.tsx` 聚合页

## 3. 单工具 Loop（每个工具重复此 9 步，严禁并行）

```
fetch 原站 /{tool}/  → 录屏比对 checklist
→ 编写 docs/loop-state.md 该工具行状态推进
→ TDD lib/{tool}.ts (vitest)   [1]
→ 组件 components/{Tool}Editor.tsx 或复用 Editor  [2]
→ config/tools.json + messages/zh|en|es.json  [3]
→ app/[locale]/[tool]/page.tsx 若已通用则自动生效
→ npm run build + vitest  [4]
→ git commit -m "feat({tool}): ..." + push
→ 待 Vercel Ready → curl / sitemap 验证 → 更新 loop-state 为 done → 下一个
```

[1]  lib 纯函数必须 100% 本地，抛错中文提示，导出 sample
[2]  图表类额外加 canvas 预览与导出 PNG
[3]  related 指向同 Phase 已完成工具，避免 404
[4]  若 build 失败，禁止进入下一工具

## 4. 每工具必达质量门

- `lib/{tool}.ts` 有 5+ vitest 用例（空输入/异常/正常/边界/示例）
- 1:1 复刻原站：双按钮（执行/复制/清空/下载）、示例填充、实时校验、错误行号
- 三语：zh/en/es 的 title/h1/description/tags/faqs 全量
- SEO：faqJsonLd + related + category 聚合
- 0 上传断言：grep `fetch(`/`axios` 为 0

## 5. 状态跟踪文件

- `docs/loop-state.md` —— 唯一真源，列 50 行，每行 `| # | id | 名称 | phase | 状态 | commit | 验证 |`
- 状态：`todo → doing → review → done → deployed`
- 每完成一个工具，更新该文件并单独提交

## 6. 当前下一步

1. 创建 `docs/loop-state.md`（50 行，当前仅 json-formatter deployed，其余 todo）
2. 按 Phase1 首项 `hex-converter 进制转换器` 启动首个 loop：先 `webfetch /hex-converter/` 逆向原站行为，再 TDD lib/hexConverter.ts
3. 完成后 Header 仍保持 span，直到 Phase1 完成再批量开分类页

## 7. 风险

- 图表 12 项依赖 chart 库，包体积 > 1MB，需 `dynamic(import)` 避免首屏阻塞
- excel 相关需 `sheetjs` 仅前端解析，需 file input 兼容
- pwa-manifest/button-css/loading 偏可视化生成器，需单独表单而非双栏 Editor，模板需分支
