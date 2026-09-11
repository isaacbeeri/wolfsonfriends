/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wolfson: {
          navy: '#0C2A4A',
          blue: '#164E87',
          sky: '#0284C7',
          cyan: '#0EA5E9',
          yellow: '#F59E0B',
          amber: '#FBBF24',
          red: '#DC2626',
          coral: '#EF4444',
          green: '#15803D',
          emerald: '#16A34A',
          sand: '#F8F9FA',
          slate: '#334155'
        }
      },
      fontFamily: {
        sans: ['Assistant', 'Rubik', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
