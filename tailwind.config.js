/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#eef6fb',
          100: '#d5e8f4',
          200: '#a9d0e8',
          300: '#74b0d4',
          400: '#3e8ab8',
          500: '#1f6b9a',
          600: '#16567f',
          700: '#134666',
          800: '#123b55',
          900: '#0c2438',
          950: '#071621',
        },
        gold: {
          400: '#d4a84b',
          500: '#c4922f',
          600: '#a67724',
        },
      },
      fontFamily: {
        display: ['"Noto Serif SC"', 'Source Han Serif SC', 'serif'],
        sans: ['"Noto Sans SC"', 'Source Han Sans SC', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 3px rgba(7, 22, 33, 0.08), 0 8px 24px rgba(7, 22, 33, 0.06)',
      },
    },
  },
  plugins: [],
}
