import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { borderRadius: { 'xl': '12px' } } },
  plugins: [],
}
export default config
