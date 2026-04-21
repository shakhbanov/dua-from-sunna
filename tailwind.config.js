/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        arabic: ['"Scheherazade New"', 'serif'],
        serif: ['Amiri', 'serif'],
        calligraphy: ['"Aref Ruqaa"', 'serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          text: 'var(--accent-text)',
        },
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(var(--accent-rgb), 0.15)',
      },
    },
  },
  plugins: [],
};
