import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0a0e27",
        "brand-darker": "#070a1a",
        "brand-cyan": "#00d4ff",
        "brand-cyan-dark": "#00b8d4",
        "input-bg": "#3a3a3a",
        "input-border": "#00d4ff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;