/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1900px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        2.5: "10px",
      },
      margin: {
        0.5: "2px",
        1.5: "6px",
        18: "72px",
      },
      colors: {
        slateGray: "#6c8595",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        slide: "slideIn 0.35s ease-in-out",
      },
    },
  },
  plugins: [
    function ({ addComponents, addUtilities }) {
      addComponents({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          width: "0",
          height: "0",
        },
      });
      addUtilities({
        ".animate-slide": {
          animation: "slideIn 0.35s ease-in-out",
        },
      });
    },
  ],
};