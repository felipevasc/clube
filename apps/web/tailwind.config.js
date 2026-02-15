/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sun: {
          50: "#fff8d6",
          100: "#fff1ad",
          200: "#ffe57a",
          300: "#ffd84f",
          400: "#ffcc2e",
          500: "#ffbf0f",
          600: "#e0a800",
          700: "#b88700",
          800: "#8a6500",
          900: "#5c4300"
        }
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

