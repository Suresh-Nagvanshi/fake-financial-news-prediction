/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020617", // slate-950
        card: "rgba(15, 23, 42, 0.6)", // trans-slate-900
        cardBorder: "rgba(255, 255, 255, 0.05)",
        primary: "#FE7743",
        textBase: "#f8fafc",
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
