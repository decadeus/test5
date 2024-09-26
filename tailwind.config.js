const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'spin-pause': {
          '0%': { transform: 'rotate(0deg)' },
          '33.33%': { transform: 'rotate(360deg)' }, // Full rotation at 33.33%
          '100%': { transform: 'rotate(360deg)' },   // Fixed at 360deg for the remaining 66.67%
        },
       
       
      },
      animation: {
        'spin-pause': 'spin-pause 3s linear infinite',
       
       
      },
      colors: {
        primary: {
          DEFAULT: "#2222c1",
          dark: "#004493",
        },
      },
      fontFamily: {
        kenia: ["var(--font-kenia)"],
        satisfy: ["var(--font-satisfy)"],
        macondo: ["var(--font-macondo)"] // Correctly place inside extend
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true, // Adds common colors from NextUI
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#481878", // Primary color for light theme
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#004493", // Primary color for dark theme
            },
          },
        },
      },
    }),
  ],
};
