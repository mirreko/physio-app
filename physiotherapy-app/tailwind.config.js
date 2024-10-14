/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0FF2B2',
        secondary: '#6B71F2',
        background: '#F0F0F0',
        text: '#333',
      },
      padding: {
        'btn': '0.5rem 1.5rem',
      }
    },
  },
  plugins: [],
}
