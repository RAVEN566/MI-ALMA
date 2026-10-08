/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Celestial Midnight Palette
        midnight: {
          950: '#070913',
          900: '#0b0f1d',
          850: '#11162b',
          800: '#181f3a',
          700: '#232b4f',
          600: '#323c68',
        },
        // Celestial Purples & Lavenders
        twilight: {
          900: '#3b2269',
          800: '#4f2d8d',
          700: '#693bb4',
          600: '#8450d8',
          500: '#9f6af5',
          400: '#be95fb',
          300: '#d7bcfe',
          200: '#ecddfe',
          100: '#f6efff',
        },
        // Starlight Golds & Ambers
        starlight: {
          500: '#e5ad23',
          400: '#f6c343',
          300: '#ffd96e',
          200: '#ffe8a3',
          100: '#fff6d7',
        },
        // Astral Moon Silver & Blues
        astral: {
          900: '#0f2742',
          700: '#1d4875',
          500: '#387bbd',
          400: '#5c9ce2',
          300: '#89bcf5',
          200: '#bad9fb',
          100: '#e1eeff',
        },
        // Aurora Teals
        aurora: {
          500: '#1fa397',
          400: '#2ec4b6',
          300: '#5eead4',
          200: '#99f6e4',
          100: '#ccfbf1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        celestial: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(159, 106, 245, 0.25)',
        'glow-md': '0 0 25px -4px rgba(159, 106, 245, 0.35)',
        'glow-gold': '0 0 25px -4px rgba(246, 195, 67, 0.35)',
        'glow-teal': '0 0 25px -4px rgba(46, 196, 182, 0.35)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
