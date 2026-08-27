import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        task: {
          bg: "#f8fafc",
          ink: "#0f172a",
          primary: "#4f46e5",
          green: "#0f766e",
          orange: "#c2410c"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
