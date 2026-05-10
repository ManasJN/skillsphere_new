/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#060d1f', 2: '#0b1630', 3: '#111e3a' },
        card:   { DEFAULT: '#111e3a', 2: '#162040' },
        border: { DEFAULT: '#1e2d4a', 2: '#253552' },
        indigo: { DEFAULT: '#4f46e5', 2: '#6366f1' },
        cyan:   { DEFAULT: '#06b6d4' },
        purple: { DEFAULT: '#8b5cf6' },
        pink:   { DEFAULT: '#ec4899' },
        emerald:{ DEFAULT: '#10b981' },
        amber:  { DEFAULT: '#f59e0b' },
        rose:   { DEFAULT: '#ef4444' },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow:       '0 0 40px rgba(79,70,229,.18)',
        'glow-cyan':'0 0 40px rgba(6,182,212,.18)',
      },
      animation: {
        'fade-in':   'fadeIn .3s ease forwards',
        'slide-up':  'slideUp .4s ease forwards',
        'pulse-slow':'pulse 3s cubic-bezier(.4,0,.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [],
};
