/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},

    colors: {
      customBlue: '#047BD5',
      white: '#ffffff',
      gray1:'#DEDFE4',
      gray2: '#D3D3D3',
      lightgray:'#F3F4F9',
    },

  },
  plugins: [],
}

