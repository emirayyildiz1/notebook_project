/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'Georgia', 'serif'],
        caveat: ['Caveat', 'cursive'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        parchment: {
          50:  '#fdf9f0',
          100: '#faf3e0',
          200: '#f5e8c8',
          300: '#eedcae',
          400: '#e6cd92',
          500: '#dbbf74',
          600: '#c9a84c',
          700: '#a8883a',
          800: '#876b2d',
          900: '#6b5324',
        },
        ink: {
          light: '#5c4a3a',
          DEFAULT: '#3d2b1f',
          dark: '#1a0f08',
        },
        spine: '#8b5e3c',
        leather: '#6b3a2a',
      },
      boxShadow: {
        'book': '0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'page': '4px 0 15px rgba(0,0,0,0.15), 2px 0 6px rgba(0,0,0,0.1)',
        'page-left': '-4px 0 15px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'paper-lines': 'repeating-linear-gradient(transparent, transparent 27px, #d6c4a0 27px, #d6c4a0 28px)',
      },
    },
  },
  plugins: [],
}
