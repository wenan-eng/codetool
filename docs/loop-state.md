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

### 批次2 全部完成 34/34 — 2026-08-21
- 波1 转义进制8 + 波2 Base系杂项7 + 波3 哈希加密9 + 波4 文件图片8 + 波5 JS混淆2，全部 deployed 线上验证
- vitest 325/325，build 278页 SSG（zh/en/es × 84工具 + 分类页）
- 流程：波1-3 子代理并行+leader集成；波3起子代理多次空报告/缺交付，波4-5 leader亲自实现
- 关键坑：tools.json 字面反斜杠致 Next JSON 解析崩、LSB 位偏移×2、AES-CTR counter 类型、GitHub SSH 抖动重试

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
| 59 | base32-encode | Base32编码/解码 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 60 | base64-encode | Base64编码/解码 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 61 | base64-bulk | Base64批量编码/解码 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 62 | jwt-decoder | JWT解码查看器 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 63 | random-pwd | 随机密码生成器 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 64 | entropy-calculator | 密码熵值计算器 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 65 | gzip | Gzip编码/解码 | 编码转换 | deployed | 波2push | 200 Pass 线上验证 |
| 66 | md5 | MD5安全加密 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 67 | md5-batch | 批量MD5加密 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 68 | sha | SHA系列哈希值生成 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 69 | mysql-password | MySQL密码哈希生成 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 70 | htpasswd | Htpasswd密码生成器 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 71 | md4 | MD4安全加密 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 72 | aes-encrypt | AES加密/解密 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 73 | des-encrypt | DES加密/解密 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 74 | url-hex-encode | URL16进制编码解码 | 编码转换 | deployed | 波3push | 200 Pass 线上验证 |
| 75 | base64-file | Base64转文件 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 76 | file-base64 | 文件转Base64 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 77 | base64-image | Base64转图片 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 78 | image-base64 | 图片转Base64 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 79 | lsb-extract | LSB图片隐写提取 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 80 | lsb-embed | LSB图片隐写 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 81 | md5-verify | 文件MD5哈希值校验 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 82 | md5-batch-verify | 批量文件MD5校验 | 编码转换 | deployed | 波4push | 200 Pass 线上验证 |
| 83 | js-obfuscator | JS混淆加密 | 编码转换 | deployed | 波5push | 200 Pass 线上验证 |
| 84 | js-obfuscator-advanced | 专业JS代码混淆加密 | 编码转换 | deployed | 波5push | 200 Pass 线上验证 |



## 批次3：文本处理 22 项（来源 https://www.lanren-tools.com/text/ playwright 已验证 40 项中筛选）
> 跳过：word-filter-*×12（词库版权）、image-extract（已有#50）、note/startup-idea/wechat-chat/folder-generator/markdown（应用型后置）
> 图标：15 个 logo-{id}.svg 直命中；7 个无专属按同族：remove-emoji→logo-emoji、letter-converter→logo-letter-circle、chinese/mars-converter→logo-symbol-converter、net-parser/url-extractor→logo-url-extractor、sequence-generator/string-random→logo-string-random、pinyin-converter→logo-word-count

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 85 | letter-converter | 字母大小写转换 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 86 | symbol-converter | 中英文符号转换器 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 87 | remove-emoji | Emoji表情去除神器 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 88 | word-count | 在线字数统计 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 89 | line-text | 换行符转文本换行 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 90 | text-line | 文本换行转换行符 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 91 | text-replace | 文本批量替换 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 92 | text-split | 文本分割神器 | 文本处理 | deployed | b3w1push | 200 Pass 线上验证 |
| 93 | mobile-extractor | 手机号去重提取 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 94 | email-extractor | 文本邮箱提取器 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 95 | url-extractor | 通用文本URL提取 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 96 | idcard-date | 身份证号提取生日 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 97 | idcard-extract | 身份证信息提取 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 98 | net-parser | URL地址解析 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 99 | text-extract | 文本信息提取器 | 文本处理 | deployed | b3w2push | 200 Pass 线上验证 |
| 100 | chinese-converter | 简体繁体转换器 | 文本处理 | todo | - | - |
| 101 | mars-converter | 火星文生成器 | 文本处理 | todo | - | - |
| 102 | letter-circle | 圆圈字母生成器 | 文本处理 | todo | - | - |
| 103 | string-random | 随机字符串批量生成 | 文本处理 | todo | - | - |
| 104 | sequence-generator | 数字序列批量生成器 | 文本处理 | todo | - | - |
| 105 | text-formatter | 文本自动排版 | 文本处理 | todo | - | - |
| 106 | pinyin-converter | 汉字转拼音 | 文本处理 | todo | - | - |
