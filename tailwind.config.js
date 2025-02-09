/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '&:is(.dark *)'],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  important:true,
  theme: {
    extend: {
      colors: {
        'orange':{
          '100': '#fff7ed',
          '200': '#ffedd5',
          '300': '#f5ebdb',
          '400': '#f7deb7',
          '500': '#f8d192',
          '600': '#fac46e',
          '700': '#fcb749',
          '800': '#fdaa25',
          '900': '#ff9d00',
        },
        'green':{
          '950': '#00471b',
          '900': '#00531f',
          '800': '#005a25',
          '700': '#006b2c',
          '600': '#00b94d',
          '500': '#1ec467',
          '400': '#47ce82',
          '300': '#70d99d',
          '200': '#99e3b8',
          '100': '#c2efd3',
        },
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

