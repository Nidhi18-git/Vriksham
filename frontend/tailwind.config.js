/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#effcf4",
          100: "#d8f7e3",
          200: "#b4edca",
          300: "#7fdda9",
          400: "#46c57f",
          500: "#20a963",
          600: "#15864e",
          700: "#126b41",
          800: "#115536",
          900: "#0f462e"
        },
        soil: "#3c3327",
        mist: "#f6fbf7"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(32, 169, 99, 0.22)",
        soft: "0 18px 60px rgba(16, 24, 40, 0.10)"
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
