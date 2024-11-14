/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        linkedin: {
          primary: "#0a66c2",
          light: "#e8f0fe",
          dark: "#003d70",
          gray: "#f3f2f2",
          darkGray: "#7a7a7a",
          white: "#ffffff",
          black: "#000000",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        linkedin: {
          primary: "#0a66c2",
          secondary: "#ffffff",
          accent: "#e8f0fe",
          neutral: "#000000",
          "base-100": "#f3f2ef",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#fb5607",
        },
      },
    ],
  },
};
