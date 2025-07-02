const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-600',
    'text-green-900',
    'bg-green-100',
    'border-green-400',
    'text-green-700',
    'bg-blue-100',
    'border-blue-400',
    'text-blue-700',
    'bg-white',
    'rounded-xl',
    'shadow',
    'object-cover',
    'z-0',
    'z-10',
    'h-[340px]',
    'min-h-[400px]',
    'min-h-[300px]',
  ],
  theme: {
    extend: {
      keyframes: {
        'spin-pause': {
          '0%': { transform: 'rotate(0deg)' },
          '33.33%': { transform: 'rotate(360deg)' }, // Full rotation à 1/3
          '100%': { transform: 'rotate(360deg)' },   // Reste fixe ensuite
        },
        fillup: {
          '0%': { height: '0%', backgroundColor: '#16a34a' },
          '50%': { height: '50%', backgroundColor: '#16a34a' },
          '100%': { height: '50%', backgroundColor: '#d1d5db' }, // 50% de h-[200px] = 100px
        },
        fillupFirst: {
          '0%': { width: '200px', backgroundColor: '#16a34a' },
          '30%': { width: '100px', backgroundColor: '#d1d5db' },
          '60%': { width: '100px', backgroundColor: '#d1d5db' },
          '100%': { width: '200px', backgroundColor: '#16a34a' },
        },
        fillupSecond: {
          '0%': { width: '100px', backgroundColor: '#d1d5db' },
          '30%': { width: '200px', backgroundColor: '#16a34a' },
          '60%': { width: '100px', backgroundColor: '#d1d5db' },
          '100%': { width: '100px', backgroundColor: '#d1d5db' },
        },
        fillupThird: {
          '0%': { width: '100px', backgroundColor: '#d1d5db' },
          '30%': { width: '100px', backgroundColor: '#d1d5db' },
          '60%': { width: '200px', backgroundColor: '#16a34a' },
          '100%': { width: '100px', backgroundColor: '#d1d5db' },
        },
      },
      animation: {
        'spin-pause': 'spin-pause 3s linear infinite',
        'fillup-height': 'fillup 14s ease-in-out infinite',
        'fillup-width': 'fillupFirst 10s ease-in-out infinite',
        'fillup-width-delayed': 'fillupSecond 10s ease-in-out infinite',
        'fillup-third': 'fillupThird 10s ease-in-out infinite',
      },
      colors: {
        primary: {
          DEFAULT: '#2222c1',
          dark: '#004493',
        },
        custom: {
          brownc: '#bfae9b',
          brownd: '#9c8164',
        },
      },
      fontFamily: {
        kenia: ['var(--font-kenia)'],
        satisfy: ['var(--font-satisfy)'],
        macondo: ['var(--font-macondo)'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
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
