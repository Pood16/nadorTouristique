/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0A2540',
          700: '#1A4A7A',
          500: '#2D7DD2',
          300: '#7FB3E8',
          100: '#E8F2FC',
        },
        secondary: {
          900: '#7C2D12',
          700: '#C2410C',
          500: '#D97706',
          300: '#FCD34D',
          100: '#FEF9EE',
        },
        accent: {
          700: '#3D6B35',
          500: '#4D8B3E',
          300: '#86EFAC',
          100: '#F0FDF4',
        },
        gold: {
          500: '#B7860B',
          300: '#F0C040',
        },
        neutral: {
          950: '#0D0D0D',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        color: '0 4px 16px rgba(26, 74, 122, 0.20)',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
};
