// tailwind.config.js
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
        primary: {
          DEFAULT: "#2222c1",
          dark: "#004493",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true, // Ajoute les couleurs communes de NextUI
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#481878", // Utilise la couleur primaire définie
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#004493", // Utilise la couleur primaire définie pour le mode sombre
            },
          },
        },
      },
    }),
  ],
};
