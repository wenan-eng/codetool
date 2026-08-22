# -*- coding: utf-8 -*-
"""为 config/tools.json 中的每个工具生成专属三语使用说明（usage/usage_en/usage_es）。
每工具 = 3 条动作步骤（含工具名插值 {name}）+ 1 条分类隐私条。"""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'config/tools.json'
tools = json.load(open(PATH, encoding='utf-8'))

FAM = {
'img_adjust': (["上传或拖入需要调整的图片", "拖动滑杆实时预览{name}效果", "满意后点击导出保存新图片"],
               ["Upload or drop the image you want to adjust", "Drag the sliders to preview the effect in real time", "Export and save the adjusted image when satisfied"],
               ["Suba o arrastre la imagen que desea ajustar", "Mueva los controles para previsualizar el efecto en tiempo real", "Exporte la imagen ajustada cuando esté satisfecho"]),
'img_edit':   (["选择本地图片（文件不上传服务器）", "按需设置参数并实时预览效果", "点击下载按钮保存处理后的图片"],
               ["Pick a local image (files never leave your device)", "Adjust options and preview instantly", "Click download to save the processed image"],
               ["Elija una imagen local (nunca sale de su dispositivo)", "Ajuste las opciones con vista previa instantánea", "Descargue para guardar la imagen procesada"]),
'img_convert':(["上传一张或多张原始格式图片", "点击按钮开始转换为目标格式", "转换完成后逐张下载"],
               ["Upload one or more images in the source format", "Click to convert to the target format", "Download each converted file when done"],
               ["Suba una o más imágenes en el formato original", "Pulse para convertirlas al formato destino", "Descargue cada archivo convertido al terminar"]),
'fmt':        (["将需要处理的代码粘贴到输入框", "点击功能按钮自动完成格式化与清理", "复制输出结果直接使用"],
               ["Paste the code into the input area", "Click the action button to format or clean automatically", "Copy the output and use it right away"],
               ["Pegue el código en el área de entrada", "Pulse el botón para formatear o limpiar automáticamente", "Copie el resultado y úselo de inmediato"]),
'dataconv':   (["在左侧输入框粘贴源数据", "确认目标格式后点击转换按钮", "复制或下载右侧的转换结果"],
               ["Paste the source data into the left panel", "Confirm the target format and click Convert", "Copy or download the result from the right panel"],
               ["Pegue los datos de origen en el panel izquierdo", "Confirme el formato de destino y pulse Convertir", "Copie o descargue el resultado del panel derecho"]),
'jsonops':    (["粘贴需要处理的 JSON 数据", "按需选择操作选项并点击执行", "复制结构化后的 JSON 结果"],
               ["Paste the JSON data to process", "Choose options and run the operation", "Copy the restructured JSON result"],
               ["Pegue los datos JSON a procesar", "Elija las opciones y ejecute la operación", "Copie el JSON reestructurado"]),
'hash':       (["在输入框粘贴待摘要的文本", "{name}即时计算哈希值，无需点击", "复制哈希值用于完整性校验"],
               ["Paste the text into the input box", "{name} computes the hash instantly — no button needed", "Copy the hash for integrity checks"],
               ["Pegue el texto en el cuadro de entrada", "{name} calcula el hash al instante — sin botones", "Copie el hash para verificar integridad"]),
'hashverify': (["分别粘贴原文与待比对的哈希值", "点击验证按钮自动比对", "查看一致/不一致的校验结论"],
               ["Enter the original text and the hash to compare", "Click Verify to compare automatically", "A match / mismatch verdict is displayed"],
               ["Introduzca el texto original y el hash a comparar", "Pulse Verificar para comparar automáticamente", "Se muestra si coinciden o no"]),
'entropy':    (["输入或粘贴要评估的密码", "实时查看熵值与破解耗时估算", "对照建议调整密码强度"],
               ["Type or paste the password to evaluate", "See entropy and estimated crack time live", "Strengthen the password based on suggestions"],
               ["Escriba o pegue la contraseña a evaluar", "Vea la entropía y el tiempo estimado de descifrado", "Refuerce la contraseña según las sugerencias"]),
'cipher':     (["输入明文与密钥，选择模式与填充", "点击加密或解密按钮执行", "复制结果并妥善保管密钥"],
               ["Enter plaintext and key, choose mode and padding", "Click Encrypt or Decrypt to execute", "Copy the result and keep your key safe"],
               ["Introduzca texto claro y clave, elija modo y relleno", "Pulse Cifrar o Descifrar para ejecutar", "Copie el resultado y guarde bien su clave"]),
'gzip':       (["粘贴文本或导入 .gz 压缩文件", "选择压缩或解压方向执行", "下载或复制处理结果"],
               ["Paste text or import a .gz file", "Choose compress or decompress and run", "Download or copy the output"],
               ["Pegue texto o importe un archivo .gz", "Elija comprimir o descomprimir y ejecute", "Descargue o copie el resultado"]),
'file_b64':   (["选择本地文件或图片（不会上传）", "自动转换为 Base64 字符串或 Data URL", "复制结果嵌入代码或下载"],
               ["Pick a local file or image (never uploaded)", "It is converted to a Base64 string or Data URL automatically", "Copy the result into code or download it"],
               ["Elija un archivo o imagen local (nunca se sube)", "Se convierte automáticamente a Base64 o Data URL", "Copie el resultado en su código o descárguelo"]),
'enc_twoway': (["在输入框粘贴原始文本", "选择编码或解码方向", "结果即时生成，一键复制"],
               ["Paste the raw text into the input box", "Choose encode or decode direction", "Output appears instantly — copy in one click"],
               ["Pegue el texto original en el cuadro", "Elija codificar o decodificar", "El resultado aparece al instante — cópielo con un clic"]),
'jwt':        (["粘贴完整的 JWT 令牌", "自动解析 Header、Payload 与过期时间", "注意：仅解码内容，不验证签名"],
               ["Paste the full JWT token", "Header, Payload and expiry are parsed automatically", "Note: decodes content only; signature is not verified"],
               ["Pegue el token JWT completo", "Header, Payload y caducidad se analizan automáticamente", "Nota: solo decodifica; no verifica la firma"]),
'pwdgen':     (["设置长度与字符集等规则", "点击生成按钮产出随机结果", "一键复制并妥善保存"],
               ["Set length and character-set rules", "Click generate to produce random results", "Copy in one click and store safely"],
               ["Defina longitud y conjunto de caracteres", "Pulse generar para producir resultados aleatorios", "Cópielo con un clic y guárdelo bien"]),
'obfuscator': (["粘贴 JavaScript 源码", "按需调整混淆强度与选项", "生成混淆代码并复制使用"],
               ["Paste your JavaScript source code", "Tune obfuscation strength and options as needed", "Generate the obfuscated code and copy it"],
               ["Pegue el código fuente JavaScript", "Ajuste la intensidad y opciones de ofuscación", "Genere el código ofuscado y cópielo"]),
'stego':      (["上传载体图片并填写隐藏信息", "点击嵌入或提取执行隐写操作", "下载含隐藏信息的图片或提取文本"],
               ["Upload a carrier image and enter hidden text", "Run Embed or Extract to perform steganography", "Download the resulting image or extracted text"],
               ["Suba una imagen portadora y escriba el texto oculto", "Ejecute Incrustar o Extraer", "Descargue la imagen resultante o el texto extraído"]),
'timeconv':   (["输入时间戳或日期时间字符串", "自动双向换算本地与 UTC 时间", "切换秒/毫秒精度后复制结果"],
               ["Enter a timestamp or date-time string", "Converts both ways between local time and UTC", "Switch second/millisecond precision and copy"],
               ["Introduzca una marca de tiempo o fecha-hora", "Convierte en ambos sentidos entre hora local y UTC", "Cambie la precisión segundos/milisegundos y copie"]),
'naming':     (["输入变量名、短语或多行列表", "选择 camelCase、snake_case 等目标风格", "逐行批量转换后一键复制"],
               ["Type names, phrases, or a multi-line list", "Pick camelCase, snake_case or other target style", "Batch-convert every line and copy at once"],
               ["Escriba nombres, frases o una lista multilínea", "Elija camelCase, snake_case u otro estilo", "Convierta todas las líneas y cópielas"]),
'cssgen':     (["调整颜色、圆角、动画速度等参数", "在预览区实时查看视觉效果", "复制生成的 CSS/JSON 配置到项目使用"],
               ["Tweak color, radius, animation speed and more", "Watch the live preview update", "Copy the generated CSS/JSON into your project"],
               ["Ajuste color, radio, velocidad de animación y más", "Vea la vista previa en vivo", "Copie el CSS/JSON generado en su proyecto"]),
'inspector':  (["打开页面即自动采集当前环境信息", "查看屏幕、系统、浏览器等参数明细", "调试适配问题时对照参考"],
               ["Environment info is collected the moment you open the page", "Inspect screen, OS and browser details", "Handy reference while debugging responsive issues"],
               ["La información se recopila al abrir la página", "Consulte pantalla, sistema y navegador", "Útil al depurar problemas de adaptación"]),
'imgextract': (["粘贴网页 HTML 源码或 URL 列表", "自动提取全部图片链接并去重", "逐张预览并批量复制地址"],
               ["Paste page HTML or a list of URLs", "All image links are extracted and deduplicated", "Preview each image and batch-copy addresses"],
               ["Pegue el HTML de la página o una lista de URL", "Extrae y deduplica todos los enlaces de imagen", "Previsualice cada imagen y copie en lote"]),
'textedit':   (["将文本粘贴到编辑框", "选择需要的处理选项并执行", "复制处理后的文本结果"],
               ["Paste your text into the editor", "Choose the processing option and run", "Copy the transformed text"],
               ["Pegue el texto en el editor", "Elija la opción de procesado y ejecútela", "Copie el texto transformado"]),
'extract':    (["粘贴原始长文本或日志内容", "自动匹配并提取目标信息", "去重整理后一键复制结果"],
               ["Paste raw long text or logs", "Target information is matched and extracted automatically", "Results are deduplicated — copy in one click"],
               ["Pegue el texto largo o registros originales", "La información objetivo se extrae automáticamente", "Resultado deduplicado — cópielo con un clic"]),
'unit':       (["在输入框输入要换算的数值", "选择源单位与目标单位", "结果即时显示，支持反向换算与复制"],
               ["Enter the value you want to convert", "Select the source unit and target unit", "Result appears instantly — reverse conversion supported"],
               ["Introduzca el valor que desea convertir", "Seleccione la unidad de origen y de destino", "El resultado aparece al instante — con conversión inversa"]),
'cssunit':    (["输入 rem 或 px 数值", "基于根字号自动换算另一侧", "支持双向输入与批量换算"],
               ["Enter a rem or px value", "Auto-converts using the root font size", "Bidirectional input with batch conversion"],
               ["Introduzca un valor rem o px", "Convierte automáticamente según el font-size raíz", "Entrada bidireccional con conversión por lotes"]),
'numbase':    (["输入一个数值", "选择源进制与目标进制（2-36）", "即时显示换算结果并可复制"],
               ["Enter a number", "Choose source and target bases (2-36)", "Result appears instantly, ready to copy"],
               ["Introduzca un número", "Elija base origen y destino (2-36)", "El resultado aparece al instante, listo para copiar"]),
'lifequery':  (["按提示选择或输入基本条件", "点击查询立即得出参考结果", "结果仅供日常生活参考"],
               ["Provide the basic inputs as prompted", "Get an instant reference result", "For everyday reference only"],
               ["Indique los datos básicos solicitados", "Obtenga un resultado de referencia al instante", "Solo como referencia cotidiana"]),
'calc':       (["按表单输入金额、利率、期限等参数", "点击开始计算生成明细", "核对各项结果后再做决策"],
               ["Fill in amounts, rate, term and other fields", "Click calculate to see the breakdown", "Review every figure before deciding"],
               ["Rellene importe, tasa, plazo y demás campos", "Pulse calcular para ver el detalle", "Revise cada cifra antes de decidir"]),
'countdown':  (["打开页面自动加载节日列表", "倒计时每秒实时刷新", "无需任何操作即可查看全部节日"],
               ["The festival list loads automatically on open", "Countdowns refresh every second", "Zero setup — view all festivals at a glance"],
               ["La lista de festividades carga automáticamente", "La cuenta atrás se actualiza cada segundo", "Sin configuración — vea todas de un vistazo"]),
'chart':      (["在数据编辑器中修改分类与数值", "图表随数据实时重绘", "导出 PNG 或复制图表配置"],
               ["Edit categories and values in the data editor", "The chart redraws in real time", "Export as PNG or copy the chart configuration"],
               ["Edite categorías y valores en el editor", "El gráfico se redibuja en tiempo real", "Exporte a PNG o copie la configuración"]),
'wm_ip':      (["输入 IP、CIDR 或子网参数", "点击转换/计算按钮执行", "复制网络地址、掩码等结果"],
               ["Enter an IP, CIDR, or subnet parameter", "Click convert/calculate to run", "Copy network address, mask and more"],
               ["Introduzca IP, CIDR o parámetros de subred", "Pulse convertir/calcular para ejecutar", "Copie dirección de red, máscara y más"]),
'wm_seo':     (["按界面提示填写规则、路径或内容", "点击生成或检测按钮执行", "复制结果或下载对应文件"],
               ["Fill in rules, paths or content as guided by the UI", "Click generate or check to run", "Copy the result or download the file"],
               ["Rellene reglas, rutas o contenido según la guía", "Pulse generar o comprobar", "Copie el resultado o descargue el archivo"]),
'media_rec':  (["首次使用需允许浏览器麦克风/屏幕权限", "点击开始按钮进行测量或录制", "完成后停止并回放、下载文件"],
               ["Grant microphone/screen permission on first use", "Press start to measure or record", "Stop when done, then replay and download"],
               ["Conceda permiso de micrófono/pantalla la primera vez", "Pulse iniciar para medir o grabar", "Detenga al terminar, reproduzca y descargue"]),
'media_play': (["选择本地媒体文件或在文本框输入内容", "使用播放控件与倍速调节自由控制", "全程本地播放，内容不会上传"],
               ["Pick a local media file or type your content", "Control playback with speed adjustments", "Plays fully locally — nothing is uploaded"],
               ["Elija un archivo local o escriba su contenido", "Controle la reproducción y la velocidad", "Se reproduce localmente — nada se sube"]),
}

SPECIAL = {
'color-picker': (["在取色板选取颜色或上传图片吸取颜色", "查看 HEX、RGB、HSL 等多种格式色值", "一键复制所需格式到剪贴板"],
                 ["Pick a color from the palette or sample an uploaded image", "Read HEX, RGB, HSL and other formats at once", "Copy the format you need in one click"],
                 ["Elija un color de la paleta o muestree una imagen", "Vea HEX, RGB, HSL y otros formatos", "Copie el formato que necesite con un clic"]),
'image-color':  (["上传需要分析配色的图片", "自动提取主色调与调色板", "复制色值用于设计配色方案"],
                 ["Upload the image you want to analyze", "Dominant colors and a palette are extracted automatically", "Copy the values for your design palette"],
                 ["Suba la imagen que desea analizar", "Extrae automáticamente los colores dominantes", "Copie los valores para su paleta de diseño"]),
'exif':         (["上传拍摄原图（JPG 等含元数据的格式）", "自动读取相机型号、拍摄时间、GPS 等 EXIF 信息", "注意分享前可先清除敏感元数据"],
                 ["Upload an original photo (JPG or other formats with metadata)", "Camera model, capture time, GPS and other EXIF data are read automatically", "Tip: strip sensitive metadata before sharing"],
                 ["Suba una foto original (JPG u otro formato con metadatos)", "Lee automáticamente cámara, fecha, GPS y demás datos EXIF", "Consejo: elimine metadatos sensibles antes de compartir"]),
'qrcode':       (["输入文本、网址或联系方式等内容", "即时生成对应二维码并预览", "下载 PNG 图片用于印刷或分享"],
                 ["Enter text, a URL or contact info", "A QR code is generated and previewed instantly", "Download the PNG for print or sharing"],
                 ["Introduzca texto, URL o contacto", "El código QR se genera al instante", "Descargue el PNG para imprimir o compartir"]),
'qrcode-decode':[("上传二维码图片"), ("自动解析其中的文本或链接"), ("复制解码内容安全打开")],
'image-placeholder': (["设置宽度、高度、背景色等参数", "实时预览占位图效果", "直接引用生成的占位图地址"],
                 ["Set width, height, background color and more", "Preview the placeholder live", "Reference the generated placeholder URL directly"],
                 ["Defina ancho, alto, color de fondo y más", "Previsualice el marcador en vivo", "Referencie directamente la URL generada"]),
'htpasswd':     (["输入用户名与密码", "点击生成 Basic Auth 认证条目", "复制内容追加到 .htpasswd 文件"],
                 ["Enter a username and password", "Generate the Basic Auth entry", "Append the output to your .htpasswd file"],
                 ["Introduzca usuario y contraseña", "Genere la entrada de Basic Auth", "Añada el resultado a su archivo .htpasswd"]),
}

PRIVACY = {
'编程开发': ["所有解析与处理均在浏览器本地完成，代码不会上传服务器","All processing runs locally in your browser; your code is never uploaded","Todo el procesamiento ocurre localmente en su navegador; su código nunca se sube"],
'图表工具': ["图表由你的数据在本地实时渲染，数据不出设备","Charts render locally from your data — nothing leaves your device","Los gráficos se generan localmente con sus datos — nada sale de su dispositivo"],
'编码转换': ["全部编解码在浏览器本地完成，敏感内容不会离开你的设备","All encoding/decoding runs locally; sensitive content never leaves your device","Toda la codificación se ejecuta localmente; el contenido confidencial nunca sale de su dispositivo"],
'文本处理': ["文本处理全程本地运行，不收集任何文本数据","Text processing runs entirely locally; we never collect any text data","El procesamiento de texto se ejecuta localmente; nunca recopilamos texto"],
'单位换算': ["换算基于国际标准系数在本地即时计算，无需联网","Conversions use standard factors computed locally — works offline too","Las conversiones usan factores estándar calculados localmente — funciona sin conexión"],
'图片处理': ["图片仅在浏览器内处理，全程不会上传到任何服务器","Images are processed inside your browser only — never uploaded to any server","Las imágenes se procesan solo en su navegador — nunca se suben a ningún servidor"],
'生活计算': ["计算完全在本地进行，输入信息不会被记录；结果仅供参考","Calculations run fully locally; inputs are never stored. Results are for reference only","Los cálculos son locales; sus datos no se guardan. Resultados solo de referencia"],
'站长工具': ["所有检测与生成本地执行，不产生任何上传行为","All checks and generation run locally — nothing is uploaded","Todo se genera y comprueba localmente — nada se sube"],
'影音媒体': ["音视频通过浏览器原生能力本地处理，内容不会上传任何服务器","Audio/video is handled natively in your browser — nothing is uploaded","El audio/video se procesa nativamente en su navegador — nada se sube"],
}

RULES = [
({'image-brightness','image-contrast','image-saturation','image-hsl','image-temperature','image-highlight','image-fader','image-sharpener','blur-image'}, 'img_adjust'),
({'image-mirror','image-rotate','image-size-revise','image-cropping','image-quality','round-image','nine-grid','watermark','image-compressor'}, 'img_edit'),
({'image-jpg','image-png','image-webp','image-bmp','png2jpg','webp2jpg'}, 'img_convert'),
({'json-formatter','js-formatter','html-formatter','css-formatter','sql-format','sql-formatter','yaml-formatter','strip-comments','html-filter'}, 'fmt'),
({'json-sql','sql-json','json-cookie','cookie-json','json-base64','xml-base64','json-excel','excel-json','json-csv','csv-json','json-yaml','yaml-json','json-xml','xml-json','csv-merge','php-serialize'}, 'dataconv'),
({'json-flatten','json-unflatten','json-sort'}, 'jsonops'),
({'md5','md5-batch','sha','md4','mysql-password'}, 'hash'),
({'md5-verify','md5-batch-verify'}, 'hashverify'),
({'entropy-calculator',}, 'entropy'),
({'aes-encrypt','des-encrypt'}, 'cipher'),
({'gzip',}, 'gzip'),
({'url-encode','escape','utf-8','html-entity','url-hex-encode','morse','text-hex','text-octal','text-bin','base32-encode','base64-encode','base64-bulk','hex-converter','html-escape'}, 'enc_twoway'),
({'base64-file','file-base64','base64-image','image-base64'}, 'file_b64'),
({'jwt-decoder',}, 'jwt'),
({'random-pwd','string-random','sequence-generator','ip-generator'}, 'pwdgen'),
({'js-obfuscator','js-obfuscator-advanced'}, 'obfuscator'),
({'lsb-embed','lsb-extract'}, 'stego'),
({'timestamp','timestamp-batch','datetime-converter'}, 'timeconv'),
({'camel',}, 'naming'),
({'pwa-manifest','button-css','loading'}, 'cssgen'),
({'screen-inspector','client-info','user-agent','device-preview'}, 'inspector'),
({'image-extract',}, 'imgextract'),
({'letter-converter','symbol-converter','remove-emoji','word-count','line-text','text-line','text-replace','text-split','chinese-converter','mars-converter','letter-circle','text-formatter','pinyin-converter'}, 'textedit'),
({'mobile-extractor','email-extractor','url-extractor','idcard-date','idcard-extract','net-parser','text-extract','sitemap-extractor','density','log-analysis'}, 'extract'),
({'rem-px','font-size-converter'}, 'cssunit'),
({'base-converter',}, 'numbase'),
({'shoe-size','rmb-upper','blood-type'}, 'lifequery'),
({'loan-calculator','car-loan-calculator','wangshangdai-calculator','bonus-tax-calculator','stamp-duty-calculator','profit-roi-calculator','payslip','proportion-calculator'}, 'calc'),
({'countdown',}, 'countdown'),
({'line-chart','bar-chart','pie-chart','horizontal-bar-chart','area-chart','doughnut-chart','scatter-chart','radar-chart','histogram-chart','multi-line-chart','stacked-area-chart','waterfall-chart'}, 'chart'),
({'ip2int','cidr-converter','ip-subnet'}, 'wm_ip'),
({'robots','robots-check','meta-generator','regex-generator','shortcut','color-converter'}, 'wm_seo'),
({'decibel-meter','voice-recorder','screen-recorder'}, 'media_rec'),
({'video-player','audio-player','tts'}, 'media_play'),
]

unmatched = []
for t in tools:
    fam = None
    for ids, f in RULES:
        if t['id'] in ids: fam = f; break
    if fam is None and t['category']=='单位换算' and t['id'].endswith('-converter'): fam = 'unit'
    if fam is None and t['id'] in SPECIAL: fam = t['id']
    if fam is None:
        unmatched.append(t['id']); continue
    if fam in SPECIAL:
        zh, en, es = SPECIAL[fam]
    else:
        zh, en, es = FAM[fam]
    name_zh, name_en, name_es = t['h1'], t.get('h1_en') or t['h1'], t.get('h1_es') or t['h1']
    pz, pe, ps = PRIVACY[t['category']]
    t['usage']   = [s.replace('{name}', name_zh) for s in zh] + [pz]
    t['usage_en']= [s.replace('{name}', name_en) for s in en] + [pe]
    t['usage_es']= [s.replace('{name}', name_es) for s in es] + [ps]

if unmatched:
    print('未覆盖:', unmatched); sys.exit(1)
json.dump(tools, open(PATH,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
uniq = len({tuple(t['usage']) for t in tools})
print(f"OK 199/{len(tools)} 已写入 usage 三语字段，zh 不同说明组合数: {uniq}")
