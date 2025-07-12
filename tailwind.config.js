/** @type {import("tailwindcss").Config} */

module.exports = {
  content: [],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          "default":"#4bdd7e",
          "50": "#f0fdf4",
          "100": "#dcfce7",
          "200": "#bbf7cf",
          "300": "#87eeaa",
          "400": "#4bdd7e", // primary
          "500": "#23c45b",
          "600": "#17a248",
          "700": "#167f3b",
          "800": "#176433",
          "900": "#14532c",
          "950": "#052e15",
        },
        secondary: {
          "default": "#2e375c",
          "50": "#b2b5c4",
          "100": "#a1a5b7",
          "200": "#8f95aa",
          "300": "#7d859c",
          "400": "#2e375c", // primary
          "500": "#252d4f",
          "600": "#1e253f",
          "700": "#181d31",
          "800": "#111422",
          "900": "#090b14",
          "950": "#040510",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}