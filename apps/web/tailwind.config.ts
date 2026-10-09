import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { fontFamily: { serif: ['Georgia', 'serif'], mono: ['Courier', 'monospace'], sans: ['Inter', 'sans-serif'] }, colors: { caution: '#FFD700', surface: '#161b22', border: '#30363d' } } }, plugins: [] };
export default config;
