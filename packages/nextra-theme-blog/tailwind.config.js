const colors = require('tailwindcss/colors')
const docsConfig = require('../nextra-theme-docs/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: docsConfig.prefix,
  content: docsConfig.content,
  theme: {
    colors: {
      ...docsConfig.theme.colors,
      primary: colors.blue
    },
    extend: {
      colors: docsConfig.theme.extend.colors,
      typography: theme => ({
        dark: {
          css: {
            color: theme('colors.gray[300]'),
            '[class~="lead"]': { color: theme('colors.gray[400]') },
            a: { color: theme('colors.gray[100]') },
            strong: { color: theme('colors.gray[100]') },
            'ul > li::before': { backgroundColor: theme('colors.gray[700]') },
            hr: { borderColor: theme('colors.gray[800]') },
            blockquote: {
              color: theme('colors.gray[100]'),
              borderLeftColor: theme('colors.gray[800]')
            },
            h1: { color: theme('colors.gray[100]') },
            h2: { color: theme('colors.gray[100]') },
            h3: { color: theme('colors.gray[100]') },
            h4: { color: theme('colors.gray[100]') },
            code: { color: theme('colors.gray[100]') },
            'a code': { color: theme('colors.gray[100]') },
            pre: {
              color: theme('colors.gray[200]'),
              backgroundColor: theme('colors.gray[800]')
            },
            thead: {
              color: theme('colors.gray[100]'),
              borderBottomColor: theme('colors.gray[700]')
            },
            'tbody tr': { borderBottomColor: theme('colors.gray[800]') }
          }
        }
      })
    }
  },
  variants: {
    extend: {
      typography: ['dark']
    }
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: docsConfig.darkMode
}
