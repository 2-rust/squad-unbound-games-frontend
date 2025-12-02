import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sand: "#EAD351",
        ember: "#DD4837",
        midnight: "#12135b",
        slate: "#1c1c28",
        ink: "#0e0e16",
      },
      fontFamily: {
        space: ["var(--font-space-grotesk)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 15px 45px rgba(234, 211, 81, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
