/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bella: {
          bg: '#FAF8F5',
          900: '#1c1917',
          500: '#78716c',
          200: '#e7e5e4',
          clay: '#C08552',
        },
      },
    },
  },
  plugins: [],
};
