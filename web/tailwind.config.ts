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
          400: "#60a5fa",
          500: "#1d4ed8",
          600: "#1e40af",
          700: "#1e3a8a",
        },
        surface: {
          50: "#0b0d11",
          100: "#11141b",
          200: "#171c26",
          300: "#202634",
          border: "#232836",
        }
      },
    },
  },
  plugins: [],
};
export default config;
