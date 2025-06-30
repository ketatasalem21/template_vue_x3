/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sage-blue': {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc4ff',
          400: '#36a5ff',
          500: '#0c8ce9',
          600: '#0073d1',
          700: '#073a6f', // Couleur principale demandée
          800: '#0a2c5a',
          900: '#0f2847',
        }
      }
    },
  },
  plugins: [],
};