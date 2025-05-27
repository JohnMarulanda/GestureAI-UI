/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tema Negro - Colores Principales
        background: {
          primary: '#0a0a0a', // black
          secondary: '#18181b', // zinc-900
          tertiary: '#27272a', // zinc-800
          hover: '#3f3f46' // zinc-700
        },
        foreground: {
          primary: '#ffffff', // white
          secondary: '#d4d4d8', // zinc-300
          muted: '#a1a1aa', // zinc-400
          contrast: '#000000' // black (para botones primarios)
        },
        border: {
          primary: '#27272a', // zinc-800
          secondary: '#3f3f46' // zinc-700
        },
        accent: {
          hover: '#f4f4f5', // gray-100
          muted: '#71717a' // zinc-500
        },
        // Colores específicos del tema
        zinc: {
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        },
        gray: {
          100: '#f4f4f5'
        }
      },
      boxShadow: {
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'zinc-hover': '0 20px 25px -5px rgba(39, 39, 42, 0.3)'
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, #3f3f46, #18181b, #000000)',
        architectural: 'linear-gradient(to bottom right, #27272a 0%, #18181b 50%, #000000 100%)'
      },
      opacity: {
        15: '0.15',
        85: '0.85'
      },
      transitionDuration: {
        250: '250ms'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.2s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
