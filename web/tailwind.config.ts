import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          400: "#38bdf8",
          500: "#0066cc",
          600: "#004e98",
          700: "#003b73",
        },
        surface: {
          50: "#060913",
          100: "#0d1322",
          200: "#131c31",
          300: "#1c2842",
          border: "#1e293b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
