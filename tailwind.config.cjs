/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: ["font-arabic", "font-ui"],
  theme: {
    extend: {
      fontFamily: {
        ui: ["'Sora'", "sans-serif"],
        arabic: ["'Amiri'", "serif"],
      },
      colors: {
        sand: "var(--color-sand)",
        ink: "var(--color-ink)",
        mint: "var(--color-mint)",
        coral: "var(--color-coral)",
        sea: "var(--color-sea)",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(8, 22, 38, 0.22)",
      },
    },
  },
  plugins: [],
};
