/** @type {import('tailwindcss').Config} */
// const theme = require("@/constants/theme");
const colors = require("./constants/nativewindColors.ts").default;
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["App.tsx", "./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}","./constants/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: { 
        ...colors, 
      },
    },
  },
  plugins: [],
}