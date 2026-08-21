# Loop State — 编程开发 50 + 编码转换 34

> 来源 https://www.lanren-tools.com/code/ 已用 playwright-cli 验证 50 项（main article 50，排除 /about 等footer），见 .playwright-cli/page-*.yml 与 /tmp/lanren-code-overview.png
> 本文件为唯一真源，每完成一个工具更新一行状态并单 commit。

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 1 | json-formatter | JSON格式化/压缩 | 代码美化 | deployed | 72823c1 | 2026-08-20 Vercel Ready /zh/json-formatter Pass |
| 2 | js-formatter | JavaScript美化/压缩 | 代码美化 | deployed | f1592be | 200 Pass |
| 3 | html-formatter | HTML美化/压缩 | 代码美化 | deployed | f1592be | 200 Pass |
| 4 | css-formatter | CSS格式化/压缩 | 代码美化 | deployed | f1592be | 200 Pass |
| 5 | sql-format | SQL格式化/压缩 | 代码美化 | deployed | f1592be | 200 Pass |
| 6 | yaml-formatter | YAML格式化 | 代码美化 | deployed | f1592be | 200 Pass |
| 7 | strip-comments | 代码注释清理 | 代码美化 | deployed | f1592be | 200 Pass |
| 8 | html-filter | HTML代码过滤 | 代码美化 | deployed | f1592be | 200 Pass |
| 9 | json-csv | JSON转CSV | 数据转换 | deployed | f1592be | 200 Pass |
| 10 | csv-json | CSV转JSON | 数据转换 | deployed | f1592be | 200 Pass |
| 11 | json-excel | JSON转EXCEL | 数据转换 | deployed | f1592be | 200 Pass |
| 12 | excel-json | EXCEL转JSON | 数据转换 | deployed | f1592be | 200 Pass |
| 13 | json-sql | JSON转SQL | 数据转换 | deployed | f1592be | 200 Pass |
| 14 | sql-json | SQL转JSON | 数据转换 | deployed | f1592be | 200 Pass |
| 15 | json-yaml | JSON转YAML | 数据转换 | deployed | f1592be | 200 Pass |
| 16 | yaml-json | YAML转JSON | 数据转换 | deployed | f1592be | 200 Pass |
| 17 | json-xml | JSON转XML | 数据转换 | deployed | f1592be | 200 Pass |
| 18 | xml-json | XML转JSON | 数据转换 | deployed | f1592be | 200 Pass |
| 19 | json-base64 | JSON转Base64 | 数据转换 | deployed | f1592be | 200 Pass |
| 20 | xml-base64 | XML转Base64 | 数据转换 | deployed | f1592be | 200 Pass |
| 21 | json-cookie | JSON转Cookie | 数据转换 | deployed | f1592be | 200 Pass |
| 22 | cookie-json | Cookie转JSON | 数据转换 | deployed | f1592be | 200 Pass |
| 23 | line-chart | 折线图 | 图表 | deployed | f1592be | 200 Pass, svg预览 |
| 24 | bar-chart | 柱状图 | 图表 | deployed | f1592be | 200 Pass |
| 25 | pie-chart | 饼图 | 图表 | deployed | f1592be | 200 Pass |
| 26 | horizontal-bar-chart | 条形图 | 图表 | deployed | f1592be | 200 Pass |
| 27 | area-chart | 面积图 | 图表 | deployed | f1592be | 200 Pass |
| 28 | doughnut-chart | 环形图 | 图表 | deployed | f1592be | 200 Pass |
| 29 | scatter-chart | 散点图 | 图表 | deployed | f1592be | 200 Pass |
| 30 | radar-chart | 雷达图 | 图表 | deployed | f1592be | 200 Pass |
| 31 | histogram-chart | 直方图 | 图表 | deployed | f1592be | 200 Pass |
| 32 | multi-line-chart | 多系列折线 | 图表 | deployed | f1592be | 200 Pass |
| 33 | stacked-area-chart | 堆积面积图 | 图表 | deployed | f1592be | 200 Pass |
| 34 | waterfall-chart | 瀑布图 | 图表 | deployed | f1592be | 200 Pass |
| 35 | timestamp | Unix时间戳 | 开发辅助 | deployed | f1592be | 200 Pass, hasGoogle true |
| 36 | timestamp-batch | 批量时间戳 | 开发辅助 | deployed | f1592be | 200 Pass |
| 37 | datetime-converter | 日期格式转换 | 开发辅助 | deployed | f1592be | 200 Pass |
| 38 | hex-converter | 进制转换器 | 开发辅助 | deployed | f1592be | 200 Pass，playwright 255→11111111 |
| 39 | camel | 下划线/驼峰 | 开发辅助 | deployed | f1592be | 200 Pass |
| 40 | html-escape | HTML转义 | 开发辅助 | deployed | f1592be | 200 Pass |
| 41 | json-flatten | JSON扁平化 | 开发辅助 | deployed | f1592be | 200 Pass |
| 42 | json-unflatten | JSON反扁平化 | 开发辅助 | deployed | f1592be | 200 Pass |
| 43 | json-sort | JSON键排序 | 开发辅助 | deployed | f1592be | 200 Pass |
| 44 | php-serialize | PHP序列化 | 开发辅助 | deployed | f1592be | 200 Pass |
| 45 | csv-merge | CSV合并器 | 开发辅助 | deployed | f1592be | 200 Pass |
| 46 | pwa-manifest | PWA配置 | 开发辅助 | deployed | f1592be | 200 Pass |
| 47 | button-css | 按钮CSS | 开发辅助 | deployed | f1592be | 200 Pass |
| 48 | loading | 加载动画 | 开发辅助 | deployed | f1592be | 200 Pass |
| 49 | screen-inspector | 屏幕参数 | 开发辅助 | deployed | f1592be | 200 Pass |
| 50 | image-extract | 图片链接提取 | 开发辅助 | deployed | f1592be | 200 Pass |

### Phase 全部完成 50/50 — 2026-08-20
- 已 playwright 验证原站 50 项，本地 135 用例全过，build 177页 SSG，自定义广告已隐藏，保留 Google ca-pub-4188363142718866 自动广告
- 2026-08-20 新增编程开发分类页 app/[locale]/code/page.tsx，Header 已恢复编程开发可点

## 批次2：编码转换 34 项（来源 https://www.lanren-tools.com/encode/ playwright 已验证）
> 图标规律 logo-{id}.svg 已 curl 验证；4 个无专属图标按同族分配：base64-encode→logo-base64-bulk、url-encode→logo-url-hex-encode、utf-8→logo-html-entity、js-obfuscator→logo-js-obfuscator-advanced
> 文件类工具一律 FileReader/canvas 本地处理，0 服务器上传

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 51 | url-encode | URL编码/解码 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 52 | escape | Escape编码/解码 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 53 | utf-8 | UTF-8编码/解码 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 54 | html-entity | HTML实体编码/解码 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 55 | morse | 摩斯密码编码/解码 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 56 | text-hex | 文本与十六进制互转 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 57 | text-octal | 文本与八进制互转 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 58 | text-bin | 文本与二进制互转 | 编码转换 | deployed | 6f1波1push | 200 Pass 线上验证 |
| 59 | base32-encode | Base32编码/解码 | 编码转换 | todo | - | - |
| 60 | base64-encode | Base64编码/解码 | 编码转换 | todo | - | - |
| 61 | base64-bulk | Base64批量编码/解码 | 编码转换 | todo | - | - |
| 62 | jwt-decoder | JWT解码查看器 | 编码转换 | todo | - | - |
| 63 | random-pwd | 随机密码生成器 | 编码转换 | todo | - | - |
| 64 | entropy-calculator | 密码熵值计算器 | 编码转换 | todo | - | - |
| 65 | gzip | Gzip编码/解码 | 编码转换 | todo | - | - |
| 66 | md5 | MD5安全加密 | 编码转换 | todo | - | - |
| 67 | md5-batch | 批量MD5加密 | 编码转换 | todo | - | - |
| 68 | sha | SHA系列哈希值生成 | 编码转换 | todo | - | - |
| 69 | mysql-password | MySQL密码哈希生成 | 编码转换 | todo | - | - |
| 70 | htpasswd | Htpasswd密码生成器 | 编码转换 | todo | - | - |
| 71 | md4 | MD4安全加密 | 编码转换 | todo | - | - |
| 72 | aes-encrypt | AES加密/解密 | 编码转换 | todo | - | - |
| 73 | des-encrypt | DES加密/解密 | 编码转换 | todo | - | - |
| 74 | url-hex-encode | URL16进制编码解码 | 编码转换 | todo | - | - |
| 75 | base64-file | Base64转文件 | 编码转换 | todo | - | - |
| 76 | file-base64 | 文件转Base64 | 编码转换 | todo | - | - |
| 77 | base64-image | Base64转图片 | 编码转换 | todo | - | - |
| 78 | image-base64 | 图片转Base64 | 编码转换 | todo | - | - |
| 79 | lsb-extract | LSB图片隐写提取 | 编码转换 | todo | - | - |
| 80 | lsb-embed | LSB图片隐写 | 编码转换 | todo | - | - |
| 81 | md5-verify | 文件MD5哈希值校验 | 编码转换 | todo | - | - |
| 82 | md5-batch-verify | 批量文件MD5校验 | 编码转换 | todo | - | - |
| 83 | js-obfuscator | JS混淆加密 | 编码转换 | todo | - | - |
| 84 | js-obfuscator-advanced | 专业JS代码混淆加密 | 编码转换 | todo | - | - |

