/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          DEFAULT: "hsl(var(--btn-background))",
          hover: "hsl(var(--btn-background-hover))",
        },
        blue: {
          50: "#e6f1fe",
          100: "#cce3fd",
          200: "#99c7fb",
          300: "#66aaf9",
          400: "#338ef7",
          500: "#006FEE",
          600: "#005bc4",
          700: "#004493",
          800: "#002e62",
          900: "#001731",
        },
        pink: "#ec4899", // Use Tailwind's pink color code
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true, // Ensure common colors from NextUI are included
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#333", 
            secondary: {
              foreground: "#FFFFFF",
              background: "#2a81c0", // Green for light mode
              DEFAULT: "#2a81c0",
            },
          },
        },
        dark: {
          colors: {
            background: "#1a1a1a",
            foreground: "#f5f5f5",
            secondary: { background: "#17c964", foreground: "#17c964" }, // Pink for dark mode
          },
        },
      },
    }),
  ],
};
