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
        sans: ["'Bricolage Grotesque'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        paper: {
          50: "#FCFBF9",
          100: "#F6F4EF",
          200: "#EFECE4",
          300: "#E2DFD6",
          border: "#D8D4C8",
        },
        ink: {
          900: "#121211",
          700: "#2B2A27",
          500: "#5A5852",
          400: "#8C8980",
        },
        carrefour: {
          blue: "#004E98",
          red: "#C92A2A",
          green: "#0B7285",
        },
      },
      boxShadow: {
        ticket: "0 2px 0 #D8D4C8, 0 12px 24px -8px rgba(35, 34, 30, 0.06)",
        card: "0 1px 3px rgba(18, 18, 17, 0.04), 0 6px 16px -4px rgba(18, 18, 17, 0.03)",
      },
    },
  },
  plugins: [],
};
export default config;
