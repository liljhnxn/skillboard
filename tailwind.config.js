/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080D",
        "secondary-bg": "#10101A",
        card: "#141421",
        "card-hover": "#1a1a2e",
        purple: {
          DEFAULT: "#A855F7",
          glow: "rgba(168, 85, 247, 0.35)",
        },
        neon: {
          DEFAULT: "#A3FF5F",
          glow: "rgba(163, 255, 95, 0.35)",
        },
        border: "#29293A",
        "border-glow": "rgba(168, 85, 247, 0.4)",
        text: {
          DEFAULT: "#F5F5F5",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
      boxShadow: {
        "neon-purple": "0 0 25px -5px rgba(168, 85, 247, 0.3)",
        "neon-green": "0 0 25px -5px rgba(163, 255, 95, 0.3)",
        "glass-card": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern": "radial-gradient(circle, rgba(168, 85, 247, 0.08) 1px, transparent 1px)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(168, 85, 247, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(168, 85, 247, 0.5), 0 0 15px rgba(163, 255, 95, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};

