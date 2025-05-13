import colors from "tailwindcss/colors";
import "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
      "6xl": [
        "4.875rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.02em",
          fontWeight: "700",
        },
      ],
    },

    container: {
      screens: {
        xm: "360px",
        sm: "575px",
        md: "768px",
        lg: "992px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1680px",
        "4xl": "1920px",
      },
      center: true,
      padding: {
        DEFAULT: "1rem",
        xs: "0rem",
        sm: "0rem",
        md: "0rem",
        lg: "0rem",
        xl: "0rem",
        "2xl": "0rem",
        "3xl": "2rem",
        "4xl": "2rem",
      },
    },

    colors: {
      primary: {
        "50": "#eef3ff",
        "100": "#e0e8ff",
        "200": "#c7d5fe",
        "300": "#a5b8fc",
        "400": "#8192f8",
        "500": "#636df1",
        "600": "#4846e5",
        "700": "#3c38ca",
        "800": "#3230a3",
        "900": "#33348e",
        "950": "#1c1b4b",
      },
      secondary: {
        "50": "#fef2f2",
        "100": "#fee2e3",
        "200": "#fecacc",
        "300": "#fca5a9",
        "400": "#f77277",
        "500": "#ee454c",
        "600": "#cc2229",
        "700": "#b81d23",
        "800": "#981c21",
        "900": "#7e1e22",
        "950": "#450a0c",
      },
      slate: colors.slate,
      neutral: colors.neutral,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      orange: colors.orange,
      indigo: colors.indigo,
      green: colors.green,
      red: colors.red,
      yellow: colors.yellow,
      transparent: "transparent",
    },

    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;