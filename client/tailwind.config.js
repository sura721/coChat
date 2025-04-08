import daisyui from "daisyui"
import tailwind from "tailwindcss"
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths to match your project
  ],
  theme: {
    extend: {},
  },
  plugins: [
   daisyui,tailwind(),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"], 
  },
}