/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors:{
      'white': '#ffffff',
      'blue': '#047BD5',
      'gray': '#D3D3D3',
    }
  },
  plugins: [],
}

