# Loop State — 编程开发 50 工具

> 来源 https://www.lanren-tools.com/code/ 已用 playwright-cli 验证 50 项（main article 50，排除 /about 等footer），见 .playwright-cli/page-*.yml 与 /tmp/lanren-code-overview.png
> 本文件为唯一真源，每完成一个工具更新一行状态并单 commit。

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 1 | json-formatter | JSON格式化/压缩 | 代码美化 | deployed | 72823c1 | 2026-08-20 Vercel Ready /zh/json-formatter Pass |
| 2 | js-formatter | JavaScript美化/压缩 | 代码美化 | done | pending | jsFormatter 5/5, build 29工具 |
| 3 | html-formatter | HTML美化/压缩 | 代码美化 | done | pending | htmlFormatter 5/5 |
| 4 | css-formatter | CSS格式化/压缩 | 代码美化 | done | pending | cssFormatter 5/5 |
| 5 | sql-format | SQL格式化/压缩 | 代码美化 | done | pending | sqlFormatter 5/5 |
| 6 | yaml-formatter | YAML格式化 | 代码美化 | done | pending | yamlFormatter 5/5 |
| 7 | strip-comments | 代码注释清理 | 代码美化 | done | pending | 6/6 stripComments Pass |
| 8 | html-filter | HTML代码过滤 | 代码美化 | done | pending | 5/5 htmlFilter Pass |
| 9 | json-csv | JSON转CSV | 数据转换 | done | pending | 6/6 dataConvert Pass |
| 10 | csv-json | CSV转JSON | 数据转换 | done | pending | 6/6 |
| 11 | json-excel | JSON转EXCEL | 数据转换 | done | pending | 8/8 dataConvert2 |
| 12 | excel-json | EXCEL转JSON | 数据转换 | done | pending | 8/8 |
| 13 | json-sql | JSON转SQL | 数据转换 | done | pending | 8/8 |
| 14 | sql-json | SQL转JSON | 数据转换 | done | pending | 8/8 |
| 15 | json-yaml | JSON转YAML | 数据转换 | done | pending | 6/6 |
| 16 | yaml-json | YAML转JSON | 数据转换 | done | pending | 6/6 |
| 17 | json-xml | JSON转XML | 数据转换 | done | pending | 6/6 |
| 18 | xml-json | XML转JSON | 数据转换 | done | pending | 6/6 |
| 19 | json-base64 | JSON转Base64 | 数据转换 | done | pending | 8/8 |
| 20 | xml-base64 | XML转Base64 | 数据转换 | done | pending | 8/8 |
| 21 | json-cookie | JSON转Cookie | 数据转换 | done | pending | 8/8 |
| 22 | cookie-json | Cookie转JSON | 数据转换 | done | pending | 8/8 |
| 23 | line-chart | 折线图 | 图表 | done | pending | chartTool 6/6, build 170页 |
| 24 | bar-chart | 柱状图 | 图表 | done | pending | 6/6 |
| 25 | pie-chart | 饼图 | 图表 | done | pending | 6/6 |
| 26 | horizontal-bar-chart | 条形图 | 图表 | done | pending | 6/6 |
| 27 | area-chart | 面积图 | 图表 | done | pending | 6/6 |
| 28 | doughnut-chart | 环形图 | 图表 | done | pending | 6/6 |
| 29 | scatter-chart | 散点图 | 图表 | done | pending | 6/6 |
| 30 | radar-chart | 雷达图 | 图表 | done | pending | 6/6 |
| 31 | histogram-chart | 直方图 | 图表 | done | pending | 6/6 |
| 32 | multi-line-chart | 多系列折线 | 图表 | done | pending | 6/6 |
| 33 | stacked-area-chart | 堆积面积图 | 图表 | done | pending | 6/6 |
| 34 | waterfall-chart | 瀑布图 | 图表 | done | pending | 6/6 |
| 35 | timestamp | Unix时间戳 | 开发辅助 | done | pending | vitest 6/6 Pass, build 10工具 |
| 36 | timestamp-batch | 批量时间戳 | 开发辅助 | done | pending | vitest batch Pass, playw配置 |
| 37 | datetime-converter | 日期格式转换 | 开发辅助 | done | pending | 7/7 Pass, build 44页 |
| 38 | hex-converter | 进制转换器 | 开发辅助 | deployed | fb76846+727f96c | 2026-08-20 200 Pass，playwright 255→11111111 |
| 39 | camel | 下划线/驼峰 | 开发辅助 | deployed | b156805 | 5/5 Pass, build 32页 |
| 40 | html-escape | HTML转义 | 开发辅助 | done | pending | 5/5 Pass, build 12路 |
| 41 | json-flatten | JSON扁平化 | 开发辅助 | done | pending | 5/5 Pass |
| 42 | json-unflatten | JSON反扁平化 | 开发辅助 | done | pending | 5/5 Pass |
| 43 | json-sort | JSON键排序 | 开发辅助 | done | pending | 5/5 Pass |
| 44 | php-serialize | PHP序列化 | 开发辅助 | done | pending | 5/5 phpSerialize Pass |
| 45 | csv-merge | CSV合并器 | 开发辅助 | done | pending | 5/5 csvMerge Pass |
| 46 | pwa-manifest | PWA配置 | 开发辅助 | done | pending | 5/5 pwaManifest Pass |
| 47 | button-css | 按钮CSS | 开发辅助 | done | pending | 5/5 buttonCss Pass |
| 48 | loading | 加载动画 | 开发辅助 | done | pending | 8动画 + build |
| 49 | screen-inspector | 屏幕参数 | 开发辅助 | done | pending | 9/9 screenInspector Pass |
| 50 | image-extract | 图片链接提取 | 开发辅助 | done | pending | 5/5 imageExtract Pass |

### Phase 全部完成 50/50 — 2026-08-20
- 已 playwright 验证原站 50 项，本地 135 用例全过，build 177页 SSG，自定义广告已隐藏，保留 Google ca-pub-4188363142718866 自动广告
- 2026-08-20 新增编程开发分类页 app/[locale]/code/page.tsx，Header 已恢复编程开发可点
- 下一步：批量 playwright 抽验 10+ 工具线上回归 → 标记 deployed → 归档

