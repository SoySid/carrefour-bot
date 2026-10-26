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
        serif: ["'Newsreader'", "Georgia", "serif"],
        sans: ["var(--font-oswald)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        anton: ["var(--font-anton)", "sans-serif"],
        oswald: ["var(--font-oswald)", "sans-serif"],
      },
      colors: {
        paper: {
          50: "#FFFFFF",
          100: "#F4F6F9",
          200: "#E9ECF2",
          300: "#D8DEE9",
          border: "#D5DCE8",
        },
        ink: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          400: "#94A3B8",
        },
        carrefour: {
          blue: "#004E98",
          red: "#DC2626",
          green: "#059669",
        },
      },
      boxShadow: {
        ticket: "0 2px 0 #CBD5E1, 0 10px 25px -5px rgba(15, 23, 42, 0.08)",
        card: "0 1px 3px rgba(15, 23, 42, 0.05), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
