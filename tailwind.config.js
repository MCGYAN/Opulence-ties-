/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Poppins', 'Georgia', 'sans-serif'],
      },
      boxShadow: {
        boutique: '0 8px 40px rgba(0, 0, 0, 0.12)',
        'boutique-lg': '0 20px 60px rgba(0, 0, 0, 0.18)',
        'boutique-glow': '0 0 0 1px rgba(218, 165, 32, 0.35), 0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        boutique: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeInBackdrop: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmerLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in-backdrop': 'fadeInBackdrop 0.3s ease-out forwards',
        'shimmer-line': 'shimmerLine 2.5s ease-in-out infinite',
      },
      colors: {
        brand: {
          plum: '#111111',
          burgundy: '#DC2626',
          rose: '#DAA520',
          sage: '#C9A227',
          cream: '#FFFFFF',
          mocha: '#6B7280',
          latte: '#F5F5F5',
          ivory: '#FFFFFF',
          gold: '#DAA520',
          nude: '#F3F4F6',
          brown: '#B8860B',
          black: '#000000',
          champagne: '#F7F7F7',
          footer: '#000000',
          DEFAULT: '#DAA520',
          light: '#FFF8E7',
          dark: '#111111',
          accent: '#DC2626',
          muted: '#FAFAFA',
        },
      },
    },
  },
  plugins: [],
};
