/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brutal-yellow': '#FFE600',
        'brutal-pink': '#FF6B9D',
        'brutal-blue': '#4ECDC4',
        'brutal-orange': '#FF8C42',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000',
        'brutal-lg': '6px 6px 0px 0px #000',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
