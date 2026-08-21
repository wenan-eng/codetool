const MORSE_TABLE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  '"': ".-..-.",
  "$": "...-..-",
  "@": ".--.-.",
}

const REVERSE_TABLE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_TABLE).map(([char, code]) => [code, char])
)

export function morseEncode(text: string): string {
  if (!text) return ""
  const words = text.toUpperCase().split(/\s+/).filter(Boolean)
  const encodedWords = words
    .map((word) =>
      word
        .split("")
        .map((ch) => MORSE_TABLE[ch])
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean)
  return encodedWords.join(" / ")
}

export function morseDecode(morse: string): string {
  const tokens = morse.trim().split(/\s+/).filter(Boolean)
  if (!tokens.length) return ""
  const words: string[] = []
  let current = ""
  for (const token of tokens) {
    if (token === "/") {
      words.push(current)
      current = ""
    } else {
      current += REVERSE_TABLE[token] ?? ""
    }
  }
  words.push(current)
  return words.filter((w) => w.length > 0).join(" ")
}
