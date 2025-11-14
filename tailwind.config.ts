import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        soil: {
          900: "#04060f",
          800: "#080b1a",
          700: "#0f172a",
        },
        hyphae: {
          primary: "#7c3aed",
          water: "#22d3ee",
          carbon: "#f8fafc",
          nutrient: "#bef264",
        },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      dropShadow: {
        hyphae: "0 0 25px rgba(99,102,241,0.55)",
      },
      boxShadow: {
        panel: "0 35px 120px rgba(15,23,42,0.55)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
