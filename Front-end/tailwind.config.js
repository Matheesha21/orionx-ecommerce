
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F8F9FA',
          secondary: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F1F3F5',
        },
        border: {
          DEFAULT: '#DEE2E6',
          hover: '#ADB5BD',
        },
        primary: {
          DEFAULT: '#007BFF',
          light: '#339DFF',
          dark: '#0056B3',
        },
        secondary: '#0A2540',
        accent: '#0A2540',
        success: '#28A745',
        warning: '#FFC107',
        danger: '#DC3545',
        'text-primary': '#0A2540',
        'text-secondary': '#495057',
        'text-muted': '#6C757D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 4px 20px rgba(0, 123, 255, 0.12)',
        'glow-lg': '0 8px 30px rgba(0, 123, 255, 0.18)',
        'glow-accent': '0 4px 20px rgba(10, 37, 64, 0.1)',
        'soft': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
