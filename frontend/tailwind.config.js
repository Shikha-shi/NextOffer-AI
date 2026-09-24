/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0B1220",
        secondary: "#172554",
        accent: "#FF7A00",
        ai: "#06B6D4",
        background: "#F8FAFC",
        card: "#FFFFFF",
        text: "#0F172A",
      },

      boxShadow: {
        soft: "0 24px 70px rgba(15, 23, 42, 0.12)",
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },

  plugins: [],
}