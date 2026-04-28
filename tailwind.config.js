/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#050b14',
        'surface-panel': '#0f172a',
        'surface-elevated': '#1e293b',
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff0055',
        'neon-green': '#00ff9d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
