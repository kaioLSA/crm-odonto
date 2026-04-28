/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0f0f0f',
        'surface-2': '#181818',
        border: '#282828',
        /* Neutral text — override slate's blue tint */
        zinc: {
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        primary: {
          DEFAULT: '#C9A84C',
          50:  '#fdfbf3',
          100: '#faf4e1',
          200: '#f3e4b3',
          300: '#e8cc7a',
          400: '#D4AF37',
          500: '#C9A84C',
          600: '#B8960C',
          700: '#9a7c0a',
          800: '#7a6208',
          900: '#5a4806',
        },
        accent: {
          DEFAULT: '#D4AF37',
          400: '#e8cc7a',
          500: '#D4AF37',
          600: '#B8960C',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(212, 175, 55, 0.3), 0 8px 28px -8px rgba(212, 175, 55, 0.5)',
        'glow-sm': '0 0 12px -2px rgba(212, 175, 55, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
