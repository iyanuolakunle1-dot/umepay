/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#EEF0F7',
          100: '#DBDFEF',
          200: '#B4BADB',
          300: '#8B93C2',
          400: '#5D67A3',
          500: '#3E4780',
          600: '#2A3163',
          700: '#1E2450',
          800: '#161A3D',
          900: '#0F1230',
          950: '#0A0C20',
        },
        gold: {
          50: '#FDF7EA',
          100: '#FAECC8',
          400: '#E0AC4A',
          500: '#C6923A',
          600: '#A8762B',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 18, 48, 0.06), 0 1px 3px 0 rgba(15, 18, 48, 0.08)',
        popover: '0 12px 32px -8px rgba(15, 18, 48, 0.28)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.25s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
