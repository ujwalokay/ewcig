/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(24, 100%, 50%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        background: "hsl(240, 10%, 4%)",
        foreground: "hsl(0, 0%, 98%)",
        card: "hsl(240, 6%, 10%)",
        muted: {
          DEFAULT: "hsl(240, 4%, 16%)",
          foreground: "hsl(240, 5%, 65%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(0, 0%, 98%)",
        },
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
