import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-google-sans)", "ui-sans-serif", "system-ui"],
        keyframes: {
          "progress-loading": {
            "0%": { transform: "translateX(-100%)" },
            "50%": { transform: "translateX(0%)" },
            "100%": { transform: "translateX(100%)" },
          },
        },
        animation: {
          "progress-loading": "progress-loading 2s infinite ease-in-out",
        },
      },
    },
  },
};
