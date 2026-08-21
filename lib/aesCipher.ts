export type AesMode = "CBC" | "CTR" | "GCM"

const IV_LENGTHS: Record<AesMode, number> = { CBC: 16, CTR: 16, GCM: 12 }

const ALGORITHMS: Record<AesMode, AesAlgorithmName> = {
  CBC: "AES-CBC",
  CTR: "AES-CTR",
  GCM: "AES-GCM",
}

type AesAlgorithmName = "AES-CBC" | "AES-CTR" | "AES-GCM"

function buildParams(mode: AesMode, iv: Uint8Array): AlgorithmIdentifier {
  if (mode === "CTR") {
    return { name: ALGORITHMS[mode], counter: iv as unknown as BufferSource, length: 128 } as AlgorithmIdentifier
  }
  return { name: ALGORITHMS[mode], iv: iv as unknown as ArrayBuffer } as AlgorithmIdentifier
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function base64ToBytes(b64: string): Uint8Array {
  const trimmed = b64.trim()
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) || trimmed.length % 4 !== 0) {
    throw new Error("不是有效的Base64字符串")
  }
  const binary = atob(trimmed)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function assertKey(keyText: string): Uint8Array {
  if (!keyText) {
    throw new Error("密钥不能为空")
  }
  const bytes = new TextEncoder().encode(keyText)
  if (bytes.length !== 16 && bytes.length !== 24 && bytes.length !== 32) {
    throw new Error(
      `密钥长度必须为16、24或32个字符（当前为${bytes.length}字节），请检查后重新输入`
    )
  }
  return bytes
}

function assertIv(ivBase64: string | undefined, mode: AesMode): Uint8Array {
  if (!ivBase64 || !ivBase64.trim()) {
    throw new Error("解密需要提供加密时使用的IV")
  }
  const iv = base64ToBytes(ivBase64.trim())
  if (iv.length !== IV_LENGTHS[mode]) {
    throw new Error(`IV长度不正确：${mode}模式需要${IV_LENGTHS[mode]}字节（当前为${iv.length}字节）`)
  }
  return iv
}

async function importKey(keyText: string, mode: AesMode, usage: KeyUsage[]): Promise<CryptoKey> {
  const raw = assertKey(keyText)
  try {
    return await crypto.subtle.importKey(
      "raw",
      raw as unknown as ArrayBuffer,
      { name: ALGORITHMS[mode] },
      false,
      usage
    )
  } catch {
    throw new Error("当前环境不支持该密钥长度，请使用16或32字符密钥")
  }
}

export async function generateRandomIv(mode: AesMode): Promise<string> {
  const iv = new Uint8Array(IV_LENGTHS[mode])
  crypto.getRandomValues(iv)
  return bytesToBase64(iv)
}

export interface AesEncryptResult {
  cipher: string
  iv: string
}

export async function aesEncrypt(
  plaintext: string,
  keyText: string,
  mode: AesMode,
  ivBase64?: string
): Promise<AesEncryptResult> {
  const key = await importKey(keyText, mode, ["encrypt"])
  let iv: Uint8Array
  if (ivBase64 && ivBase64.trim()) {
    iv = base64ToBytes(ivBase64.trim())
    if (iv.length !== IV_LENGTHS[mode]) {
      throw new Error(
        `IV长度不正确：${mode}模式需要${IV_LENGTHS[mode]}字节（当前为${iv.length}字节）`
      )
    }
  } else {
    iv = new Uint8Array(IV_LENGTHS[mode])
    crypto.getRandomValues(iv)
  }
  const data = new TextEncoder().encode(plaintext)
  let cipherBuffer: ArrayBuffer
  try {
    cipherBuffer = await crypto.subtle.encrypt(
      buildParams(mode, iv),
      key,
      data as unknown as ArrayBuffer
    )
  } catch (error) {
    throw new Error(`加密失败：${error instanceof Error ? error.message : String(error)}`)
  }
  return { cipher: bytesToBase64(new Uint8Array(cipherBuffer)), iv: bytesToBase64(iv) }
}

export async function aesDecrypt(
  cipherBase64: string,
  keyText: string,
  mode: AesMode,
  ivBase64: string
): Promise<string> {
  const key = await importKey(keyText, mode, ["decrypt"])
  const iv = assertIv(ivBase64, mode)
  let cipherBytes: Uint8Array
  try {
    cipherBytes = base64ToBytes(cipherBase64.trim())
  } catch {
    throw new Error("密文不是有效的Base64字符串")
  }
  if (cipherBytes.length === 0) {
    throw new Error("密文不能为空")
  }
  if (mode === "CBC" && cipherBytes.length % 16 !== 0) {
    throw new Error("密文长度无效：CBC模式密文必须是16字节的整数倍，请检查密文是否完整")
  }
  let plainBuffer: ArrayBuffer
  try {
    plainBuffer = await crypto.subtle.decrypt(
      buildParams(mode, iv),
      key,
      cipherBytes as unknown as ArrayBuffer
    )
  } catch {
    throw new Error("解密失败：密钥或IV不正确，或密文已损坏、被篡改（GCM校验失败）")
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(plainBuffer)
  } catch {
    throw new Error("解密失败：解密结果不是有效的UTF-8文本，密钥或数据可能不正确")
  }
}
