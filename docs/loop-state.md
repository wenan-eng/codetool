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
> 图标：15 个 logo-{id}.svg 直命中；7 个无专属按同族

### 批次3 全部完成 22/22 — 2026-08-21
- 波1 基础编辑8 + 波2 提取解析7 + 波3 转换生成7，全部 deployed 线上验证
- vitest 363/363，build 347页 SSG（zh/en/es × 106工具 + code/encode/text 三分类页）
- 菜单三件套齐活：Header 文本处理入口 + /text 分类页 + sitemap
- 沉淀 skill：~/.config/opencode/skills/site-replication-loop（通用版，项目数据全在状态文件）
- 关键坑：URL 正则字符类被多余]截断、简繁表重复键 TS1117、trim 吃全角缩进、pinyin-pro 多音字词组级识别：remove-emoji→logo-emoji、letter-converter→logo-letter-circle、chinese/mars-converter→logo-symbol-converter、net-parser/url-extractor→logo-url-extractor、sequence-generator/string-random→logo-string-random、pinyin-converter→logo-word-count

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
| 100 | chinese-converter | 简体繁体转换器 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |
| 101 | mars-converter | 火星文生成器 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |
| 102 | letter-circle | 圆圈字母生成器 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |
| 103 | string-random | 随机字符串批量生成 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |
| 104 | sequence-generator | 数字序列批量生成器 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |
| 105 | text-formatter | 文本自动排版 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |
| 106 | pinyin-converter | 汉字转拼音 | 文本处理 | deployed | b3w3push | 200 Pass 线上验证 |


## 批次4：单位换算 32 项（来源 https://www.lanren-tools.com/unit/ playwright 已验证 33 项中筛选）
> 跳过 currency-converter（需实时汇率 API）
> 图标：9 个直命中（shoe-size/blood-type/sound/illuminance/frequency/density/cct/base-converter/rem-px 及 charge/capacitance）；23 个无专属按同族分配见各行 icon

### 批次4 全部完成 32/32 — 2026-08-21
- 波1 物理量8 + 波2 力热8 + 波3 电光8 + 波4 杂项8，全部 deployed 线上验证
- vitest 412/412，build 446页 SSG（zh/en/es × 138工具 + 四分类页）
- 菜单四入口：编程开发/文本处理/编码加密/单位换算
- 架构：UnitConverterEditor 配置驱动覆盖 24 类线性+温度仿射+油耗色温倒数；杂项 6 个专用组件
- 关键坑：BigInt 字面量 vs ES2017、cct mired 常数、rmbUpper 跨节补零、LINEAR Record 类型排除

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 107 | length-converter | 长度单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 108 | weight-converter | 重量单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 109 | temperature-converter | 温度单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 110 | area-converter | 面积单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 111 | volume-converter | 体积/容积单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 112 | speed-converter | 速度单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 113 | time-converter | 时间单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 114 | angle-converter | 角度单位换算 | 单位换算 | deployed | b4w1push | 200 Pass 线上验证 |
| 115 | pressure-converter | 压力单位换算 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 116 | power-converter | 功率单位换算 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 117 | force-converter | 力单位转换器 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 118 | torque-converter | 扭矩单位转换器 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 119 | heat-converter | 热量单位换算 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 120 | frequency-converter | 频率单位换算 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 121 | density-converter | 密度单位换算 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 122 | fuel-consumption-converter | 油耗单位换算 | 单位换算 | deployed | b4w2push | 200 Pass 线上验证 |
| 123 | voltage-converter | 电压单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 124 | current-converter | 电流单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 125 | resistance-converter | 电阻单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 126 | capacitance-converter | 电容单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 127 | charge-converter | 电荷单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 128 | illuminance-converter | 照度单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 129 | sound-converter | 声音强度单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 130 | cct-converter | 色温单位换算 | 单位换算 | deployed | b4w3push | 200 Pass 线上验证 |
| 131 | wind-speed-converter | 风速单位换算 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 132 | bandwidth-converter | 带宽单位转换 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 133 | rem-px | REM与PX单位转换 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 134 | font-size-converter | 字体字号单位换算 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 135 | base-converter | 多进制转换器 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 136 | shoe-size | 鞋子尺码换算 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 137 | rmb-upper | 人民币大写转换 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |
| 138 | blood-type | 血型遗传计算器 | 单位换算 | deployed | b4w4push | 200 Pass 线上验证 |


## 批次5：图片处理 30 项（来源 https://www.lanren-tools.com/image/ playwright 已验证 110 项中筛选）
> 冲突复核结论：canvas/FileReader 全程本地，0 上传，伪冲突可做；跳过需服务端解码的 heic/tiff/avif/jxl/psd 系与 OCR/抠图/AI 类
> 图标：按 logo-{id}.svg 规律分配（404 时同族 image-* 替代，实现时 curl 验证）

### 批次5 全部完成 30/30 — 2026-08-21
- 波1 色彩几何调整14 + 波2 格式转换6 + 波3 专用工具10，全部 deployed 线上验证
- vitest 423/423，build 539页 SSG（zh/en/es × 168工具 + 五分类页）
- 菜单五入口：编程开发/文本处理/编码加密/单位换算/图片处理
- 冲突复核结论：image 分类 canvas 本地伪冲突全可做；webmaster 剩 robots/meta/color/proportion/ip 工具族可做；life 计算器类可做；media 播放器录音类可做
- 关键坑：zsh 不分词 $var 致 curl 批量验证失效、双 canvas ref 冲突、jsqr ESM 导入、qrcode 需 @types

| # | id | 名称 | 分组 | 状态 | commit | 验证 |
|---|----|------|------|------|--------|------|
| 139 | image-brightness | 图片亮度调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 140 | image-contrast | 图片对比度调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 141 | image-saturation | 色彩饱和度调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 142 | image-hsl | 图片HSL色彩调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 143 | image-temperature | 图片冷暖色调调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 144 | image-highlight | 图片高光调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 145 | image-fader | 图片色彩淡化器 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 146 | image-sharpener | 图片锐化处理 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 147 | blur-image | 图片虚化处理 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 148 | image-rotate | 图片角度调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 149 | image-mirror | 图片镜像翻转 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 150 | image-size-revise | 图片尺寸调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 151 | image-cropping | 图片自定义裁剪 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 152 | image-quality | 图片质量调整 | 图片处理 | deployed | b5w1push | 200 Pass 线上验证 |
| 153 | image-jpg | 图片转JPG格式 | 图片处理 | deployed | b5w2push | 200 Pass 线上验证 |
| 154 | image-png | 图片转PNG格式 | 图片处理 | deployed | b5w2push | 200 Pass 线上验证 |
| 155 | image-webp | 图片转WebP格式 | 图片处理 | deployed | b5w2push | 200 Pass 线上验证 |
| 156 | image-bmp | 图片转BMP格式 | 图片处理 | deployed | b5w2push | 200 Pass 线上验证 |
| 157 | png2jpg | PNG图片转JPG | 图片处理 | deployed | b5w2push | 200 Pass 线上验证 |
| 158 | webp2jpg | WEBP图片转JPG | 图片处理 | deployed | b5w2push | 200 Pass 线上验证 |
| 159 | watermark | 图片添加水印 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 160 | image-compressor | 图片高清压缩 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 161 | color-picker | 图片取色器 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 162 | image-color | 图片配色提取器 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 163 | exif | 图片Exif查看器 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 164 | image-placeholder | 占位图片生成器 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 165 | round-image | 生成透明圆角图片 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 166 | nine-grid | 朋友圈九宫格生成 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 167 | qrcode | 二维码生成器 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
| 168 | qrcode-decode | 二维码解码器 | 图片处理 | deployed | b5w3push | 200 Pass 线上验证 |
