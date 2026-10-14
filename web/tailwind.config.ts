import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          500: "#0066cc",
          600: "#004e98",
          700: "#003b73",
        },
        surface: {
          50: "#0b0f19",
          100: "#111827",
          200: "#182234",
          300: "#223048",
          border: "#293952",
        }
      },
    },
  },
  plugins: [],
};
export default config;
