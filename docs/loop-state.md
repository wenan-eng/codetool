# Loop State — 编程开发 50 工具

> 来源 https://www.lanren-tools.com/code/ 已用 playwright-cli 验证 50 项（main article 50，排除 /about 等footer），见 .playwright-cli/page-*.yml 与 /tmp/lanren-code-overview.png
> 本文件为唯一真源，每完成一个工具更新一行状态并单 commit。

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 1 | json-formatter | JSON格式化/压缩 | 代码美化 | deployed | 72823c1 | 2026-08-20 Vercel Ready /zh/json-formatter Pass |
| 2 | js-formatter | JavaScript美化/压缩 | 代码美化 | todo | - | - |
| 3 | html-formatter | HTML美化/压缩 | 代码美化 | todo | - | - |
| 4 | css-formatter | CSS格式化/压缩 | 代码美化 | todo | - | - |
| 5 | sql-format | SQL格式化/压缩 | 代码美化 | todo | - | - |
| 6 | yaml-formatter | YAML格式化 | 代码美化 | todo | - | - |
| 7 | strip-comments | 代码注释清理 | 代码美化 | todo | - | - |
| 8 | html-filter | HTML代码过滤 | 代码美化 | todo | - | - |
| 9 | json-csv | JSON转CSV | 数据转换 | todo | - | - |
| 10 | csv-json | CSV转JSON | 数据转换 | todo | - | - |
| 11 | json-excel | JSON转EXCEL | 数据转换 | todo | - | - |
| 12 | excel-json | EXCEL转JSON | 数据转换 | todo | - | - |
| 13 | json-sql | JSON转SQL | 数据转换 | todo | - | - |
| 14 | sql-json | SQL转JSON | 数据转换 | todo | - | - |
| 15 | json-yaml | JSON转YAML | 数据转换 | todo | - | - |
| 16 | yaml-json | YAML转JSON | 数据转换 | todo | - | - |
| 17 | json-xml | JSON转XML | 数据转换 | todo | - | - |
| 18 | xml-json | XML转JSON | 数据转换 | todo | - | - |
| 19 | json-base64 | JSON转Base64 | 数据转换 | todo | - | - |
| 20 | xml-base64 | XML转Base64 | 数据转换 | todo | - | - |
| 21 | json-cookie | JSON转Cookie | 数据转换 | todo | - | - |
| 22 | cookie-json | Cookie转JSON | 数据转换 | todo | - | - |
| 23 | line-chart | 折线图 | 图表 | todo | - | - |
| 24 | bar-chart | 柱状图 | 图表 | todo | - | - |
| 25 | pie-chart | 饼图 | 图表 | todo | - | - |
| 26 | horizontal-bar-chart | 条形图 | 图表 | todo | - | - |
| 27 | area-chart | 面积图 | 图表 | todo | - | - |
| 28 | doughnut-chart | 环形图 | 图表 | todo | - | - |
| 29 | scatter-chart | 散点图 | 图表 | todo | - | - |
| 30 | radar-chart | 雷达图 | 图表 | todo | - | - |
| 31 | histogram-chart | 直方图 | 图表 | todo | - | - |
| 32 | multi-line-chart | 多系列折线 | 图表 | todo | - | - |
| 33 | stacked-area-chart | 堆积面积图 | 图表 | todo | - | - |
| 34 | waterfall-chart | 瀑布图 | 图表 | todo | - | - |
| 35 | timestamp | Unix时间戳 | 开发辅助 | todo | - | - |
| 36 | timestamp-batch | 批量时间戳 | 开发辅助 | todo | - | - |
| 37 | datetime-converter | 日期格式转换 | 开发辅助 | todo | - | - |
| 38 | hex-converter | 进制转换器 | 开发辅助 | deployed | fb76846+727f96c | 2026-08-20 200 Pass，playwright 255→11111111/377/FF/7V/73/Ev/5Q/47/_w 与原站一致 |
| 39 | camel | 下划线/驼峰 | 开发辅助 | todo | - | - |
| 40 | html-escape | HTML转义 | 开发辅助 | todo | - | - |
| 41 | json-flatten | JSON扁平化 | 开发辅助 | todo | - | - |
| 42 | json-unflatten | JSON反扁平化 | 开发辅助 | todo | - | - |
| 43 | json-sort | JSON键排序 | 开发辅助 | todo | - | - |
| 44 | php-serialize | PHP序列化 | 开发辅助 | todo | - | - |
| 45 | csv-merge | CSV合并器 | 开发辅助 | todo | - | - |
| 46 | pwa-manifest | PWA配置 | 开发辅助 | todo | - | - |
| 47 | button-css | 按钮CSS | 开发辅助 | todo | - | - |
| 48 | loading | 加载动画 | 开发辅助 | todo | - | - |
| 49 | screen-inspector | 屏幕参数 | 开发辅助 | todo | - | - |
| 50 | image-extract | 图片链接提取 | 开发辅助 | todo | - | - |

### Phase 1 当前 doing: 38 hex-converter
- 已 playwright 验证原站交互：radio 2/8/10/16/32/36 + 输入框 + 进制转换/清空 + 结果表 6 行（2/8/10/16/32/36 各一行，含解释）
- 下一步：TDD lib/hexConverter.ts → 组件 HexConverterEditor → config+messages → build+playwright 回归 → commit → 更新本行 deployed

