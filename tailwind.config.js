/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-dark': '#17192D',
        'neutral-gray': {
          950: '#24292F'
        },
        blue: {
          100: '#F0F5FF',
          200: '#C2D6FF',
          300: '#94B7FF',
          400: '#6598FF',
          500: '#2188FF',
          600: '#0A5AFF',
          700: '#0848CC',
          800: '#063A9A',
          900: '#023B78',
        } 
      },
    },
  },
  plugins: [],
}