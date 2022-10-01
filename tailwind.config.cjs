/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          dark: 'hsl(0, 0%, 65%)',
          light: 'hsl(0, 0%, 8%)'
        },
        background: {
          dark: 'hsl(0, 0%, 12%)',
          light: 'hsl(0, 0%, 60%)'
        },
        void: {
          dark: 'hsl(0, 0%, 6%)',
          light: 'hsl(0, 0%, 25%)'
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
