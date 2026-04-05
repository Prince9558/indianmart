/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2874f0", // Flipkart Blue
        secondary: "#fb641b", // Flipkart Orange/Yellow
      }
    },
  },
  plugins: [],
}
