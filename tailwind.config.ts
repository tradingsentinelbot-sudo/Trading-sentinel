import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 02.2 — Tema cromatico
        obsidian: {
          DEFAULT: "#0A0B0D",
          soft: "#0C0E11",
        },
        graphite: {
          DEFAULT: "#15171C",
          light: "#1C1F26",
          border: "#242832",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.03)",
          hover: "rgba(255,255,255,0.05)",
        },
        ink: {
          DEFAULT: "#F4F5F7", // Soft White — testo principale
          muted: "#9AA2AE", // Cool Gray — testo secondario
          faint: "#6B7280",
        },
        sentinel: {
          DEFAULT: "#3D7DFA", // Sentinel Blue — accent primario
          50: "#EAF1FF",
          400: "#5C93FF",
          500: "#3D7DFA",
          600: "#2C63E0",
          700: "#214DB3",
        },
        silver: {
          DEFAULT: "#C7CCD4", // Metallic Silver
          bright: "#E7EBF0",
          dark: "#7F8996",
        },
        amber: {
          DEFAULT: "#D6A84A",
          soft: "#E5C477",
          deep: "#8C6825",
        },
        emerald: {
          DEFAULT: "#18C78F",
          soft: "#65E0B8",
        },
        positive: {
          DEFAULT: "#22C55E", // Emerald Green — uso limitato
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // 02.3 — Gerarchia tipografica
        "hero-desktop": ["4.25rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "hero-mobile": ["2.5rem", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "section-desktop": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "section-mobile": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "body-desktop": ["1.125rem", { lineHeight: "1.6" }],
        "body-mobile": ["1rem", { lineHeight: "1.6" }],
        micro: ["0.875rem", { lineHeight: "1.4" }],
      },
      maxWidth: {
        container: "1280px",
      },
      spacing: {
        "section-y": "140px",
        "section-y-mobile": "80px",
      },
      borderRadius: {
        card: "20px",
        control: "12px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(61,125,250,0.32)",
        "glow-sm": "0 0 20px -6px rgba(61,125,250,0.24)",
        "metal-soft": "0 12px 45px -24px rgba(199,204,212,0.28)",
        "amber-soft": "0 0 34px -16px rgba(214,168,74,0.5)",
        soft: "0 8px 30px -12px rgba(0,0,0,0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fadeUp 700ms cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in": "scaleIn 600ms cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        sentinel: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
