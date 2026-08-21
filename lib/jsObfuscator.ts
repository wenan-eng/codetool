import type { ObfuscatorOptions } from "javascript-obfuscator"

export interface ObfuscateOptions {
  code: string
  mode?: "standard" | "high"
  comment?: string
  domainLock?: string[]
  theftAlert?: boolean
  alertMessage?: string
  alertFrequency?: "once" | "daily" | "always"
  redirectUrl?: string
}

const DOMAIN_CHECK_SNIPPET = (domains: string[], message: string, frequency: string, redirect: string) => `
(function(){
  var __allowed = ${JSON.stringify(domains)};
  var __host = location.hostname;
  var __ok = __allowed.some(function(d){ return __host === d || __host.endsWith('.' + d); });
  if (__ok) return;
  var __key = '__obf_alert_' + ${JSON.stringify(domains.join('|'))};
  var __show = true;
  if (${JSON.stringify(frequency)} !== 'always') {
    try {
      var __last = localStorage.getItem(__key);
      var __now = Date.now();
      if (${JSON.stringify(frequency)} === 'daily' && __last && __now - Number(__last) < 86400000) __show = false;
      if (${JSON.stringify(frequency)} === 'once' && __last) __show = false;
      localStorage.setItem(__key, String(__now));
    } catch(e) {}
  }
  if (__show) alert(${JSON.stringify(message)});
  ${redirect ? `if (${JSON.stringify(redirect)}) location.href = ${JSON.stringify(redirect)};` : ""}
})();
`

export function obfuscateJs(opts: ObfuscateOptions): string {
  const { code, mode = "standard", comment, domainLock, theftAlert, alertMessage, alertFrequency = "daily", redirectUrl } = opts
  if (!code.trim()) throw new Error("输入代码为空")
  const options: ObfuscatorOptions = {
    compact: true,
    controlFlowFlattening: mode === "high",
    controlFlowFlatteningThreshold: mode === "high" ? 0.75 : 0,
    deadCodeInjection: mode === "high",
    deadCodeInjectionThreshold: mode === "high" ? 0.4 : 0,
    debugProtection: false,
    identifierNamesGenerator: "hexadecimal",
    renameGlobals: false,
    selfDefending: mode === "high",
    stringArray: true,
    stringArrayCallsTransform: mode === "high",
    stringArrayEncoding: mode === "high" ? ["rc4"] : [],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: mode === "high" ? 2 : 1,
    stringArrayWrappersType: "function",
    stringArrayThreshold: 0.75,
    transformObjectKeys: mode === "high",
    unicodeEscapeSequence: false,
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const JavaScriptObfuscator = require("javascript-obfuscator") as typeof import("javascript-obfuscator")
  let out = JavaScriptObfuscator.obfuscate(code, options).getObfuscatedCode()
  const header = comment?.trim() ? `/* ${comment.trim()} */\n` : ""
  let guard = ""
  if (domainLock?.length || theftAlert) {
    const domains = domainLock?.filter(Boolean) ?? []
    if (theftAlert) {
      guard += DOMAIN_CHECK_SNIPPET(domains.length ? domains : ["localhost"], alertMessage?.trim() || "本代码受版权保护，禁止未授权使用！", alertFrequency, redirectUrl?.trim() || "")
    } else if (domains.length) {
      guard += `(function(){var __allowed=${JSON.stringify(domains)};var __h=location.hostname;if(!__allowed.some(function(d){return __h===d||__h.endsWith('.'+d)})){location.href=${JSON.stringify(redirectUrl?.trim() || "about:blank")};}})();\n`
    }
  }
  return header + guard + out
}
