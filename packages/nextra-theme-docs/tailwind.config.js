const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,css,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    fontFamily: {
      display: ['inter', 'sans-serif']
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
      blue: colors.blue,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      prime: {
        50: 'var(--primeColor50)',
        100: 'var(--primeColor100)',
        200: 'var(--primeColor200)',
        300: 'var(--primeColor300)',
        400: 'var(--primeColor400)',
        500: 'var(--primeColor500)'
      }
    },
    extend: {
      colors: {
        dark: '#111'
      }
    }
  },
  darkMode: 'class'
}
