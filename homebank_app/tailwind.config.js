module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      serif: [
        'Benne'
      ],
    },
    colors: {
      emerald: {
        light: '#c1ddd8',
        DEFAULT: '#9edfd7',
        dark: '#9edfd7'
      },
      accent: {
        neutral: '#000000',
        DEFAULT: '#000000',
        secondary: '#000000'
      }
    },
    container: {
      center: true
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
