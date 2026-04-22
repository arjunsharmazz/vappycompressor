/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 20px 50px rgba(59, 130, 246, 0.12)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'soft-grid': 'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};