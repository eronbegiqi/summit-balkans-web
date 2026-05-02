import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./emails/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── New brand system ───────────────────────────────────────────────
        brand: {
          DEFAULT: "#2e8a57",
          50: "#E8F5EE",
          100: "#C5E5D2",
          500: "#2e8a57",
          700: "#1F6741",
          900: "#0F3322",
        },
        accent: {
          DEFAULT: "#D4A574",
          50: "#FAF3E9",
          100: "#F0E0C9",
          500: "#D4A574",
          700: "#B0824F",
        },
        difficulty: {
          1: "#65B741",
          2: "#A4C639",
          3: "#F4A03E",
          4: "#E66B3D",
          5: "#D43A3A",
        },
        // ─── Core neutrals ─────────────────────────────────────────────────
        bone: "#F5F2EC",
        ink: "#0E1310",
        mist: "#C9CFC8",
        warning: "#E8B254",
        // ─── Legacy aliases (keep for existing components) ──────────────────
        forest: "#3B4A2E",
        terra: "#B45D3C",
        divider: "#C9CFC8",
        gold: "#E8B254",
        dark: "#0E1310",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "1320px",
      },
      borderRadius: {
        card: "12px",
        "card-hero": "24px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "fade-up": "fade-up 0.6s ease forwards",
        "slide-up": "slide-up 0.4s ease forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
