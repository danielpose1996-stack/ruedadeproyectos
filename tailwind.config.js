/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          dark: '#172E6E',
          light: '#EFF3FB',
          50: '#F0F4FF',
          100: '#DBE4FE',
          200: '#BFCFFC',
          300: '#93AAF8',
          400: '#607BF3',
          500: '#3B5AED',
          600: '#1E3A8A',
          700: '#172E6E',
          800: '#0F1F4D',
          900: '#0A1633',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
        accent: '#60A5FA',
        surface: '#FFFFFF',
        'bg-base': '#F8FAFC',
        'border-color': '#E2E8F0',
        status: {
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        'micro': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
      },
      borderRadius: {
        'card': '16px',
        'btn': '10px',
        'input': '10px',
        'modal': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(30, 58, 138, 0.04), 0 1px 2px -1px rgba(30, 58, 138, 0.04)',
        'card': '0 4px 16px -2px rgba(30, 58, 138, 0.06), 0 2px 6px -2px rgba(30, 58, 138, 0.04)',
        'elevated': '0 8px 30px -4px rgba(30, 58, 138, 0.08), 0 4px 10px -4px rgba(30, 58, 138, 0.04)',
        'btn': '0 2px 8px -1px rgba(30, 58, 138, 0.12)',
        'btn-hover': '0 4px 14px -2px rgba(30, 58, 138, 0.18)',
        'modal': '0 20px 60px -12px rgba(30, 58, 138, 0.15), 0 8px 20px -8px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-up-delay-1': 'slide-up 0.5s ease-out 0.08s both',
        'slide-up-delay-2': 'slide-up 0.5s ease-out 0.16s both',
        'slide-up-delay-3': 'slide-up 0.5s ease-out 0.24s both',
        'zoom-in': 'zoom-in 0.5s ease-out 0.2s both',
      },
    },
  },
  plugins: [],
}
