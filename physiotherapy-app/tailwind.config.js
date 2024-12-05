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
        'input': '0.5rem 1rem',
      },
      fontFamily: {
        nunito: ['Nunito Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
