/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 👈 habilita el uso de clases dark:
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // App Router
    "./src/**/*.{js,ts,jsx,tsx}", // si usás src/
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
