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
        'blue': {
          '950': '#2262fb',
          '900': '#3872fb',
          '800': '#4e81fc',
          '700': '#6491fc',
          '600': '#7aa1fd',
          '500': '#90b0fd',
          '400': '#a7c0fd',
          '300': '#bdd0fe',
          '200': '#d3e0fe',
          '100': '#e9efff',
        },
        'purple':{
          '950':'#801fff',
          '900':'#8d35ff',
          '800':'#994cff',
          '700':'#a662ff',
          '600':'#b379ff',
          '500':'#c08fff',
          '400':'#cca5ff',
          '300':'#d9bcff',
          '200':'#e6d2ff',
          '100':'#f2e9ff',
        }
      },
    },

  },
  plugins: [],
}

