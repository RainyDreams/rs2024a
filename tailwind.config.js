/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  important:true,
  theme: {
    extend: {
      colors: {
        'blue': '#2262fb'
      },
    },

  },
  plugins: [],
}

