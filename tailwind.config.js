/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    colors: {
      primary: "#6C5CE7",
      primaryDark: "#5A4BD6",
      primaryLight: "#A29BFE",
    }, 
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },     
    },
  },
  plugins: [],
};