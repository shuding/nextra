const colors = require('tailwindcss/colors')

const makePrimaryColor =
  l =>
  ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(--nextra-primary-hue) 100% ${l}%)`
    }
    return `hsl(var(--nextra-primary-hue) 100% ${l}% / ${opacityValue})`
  }

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'nx-',
  content: [
    './src/**/*.tsx',
    '../nextra/src/icons/*.tsx',
    '../nextra/src/components/*.tsx'
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem'
    },
    letterSpacing: {
      tight: '-0.015em'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: colors.gray,
      slate: colors.slate,
      neutral: colors.neutral,
      red: colors.red,
      orange: colors.orange,
      blue: colors.blue,
      yellow: colors.yellow,
      primary: {
        50: makePrimaryColor(97),
        100: makePrimaryColor(94),
        200: makePrimaryColor(86),
        300: makePrimaryColor(77),
        400: makePrimaryColor(66),
        500: makePrimaryColor(50),
        600: makePrimaryColor(45),
        700: makePrimaryColor(39),
        750: makePrimaryColor(35),
        800: makePrimaryColor(32),
        900: makePrimaryColor(24)
      }
    },
    extend: {
      colors: {
        dark: '#111'
      }
    }
  },
  darkMode: ['class', 'html[class~="dark"]']
}
