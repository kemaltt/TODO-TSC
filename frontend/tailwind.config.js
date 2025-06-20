/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'theme-toggle': 'theme-toggle 0.3s ease-in-out',
      },
      keyframes: {
        'theme-toggle': {
          '0%': { transform: 'scale(1) rotate(0)' },
          '50%': { transform: 'scale(0.8) rotate(180deg)' },
          '100%': { transform: 'scale(1) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
