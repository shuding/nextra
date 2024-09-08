/** @type {import('postcss').Postcss} */
export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-lightningcss': {
      browsers: '>= .25%'
    }
  }
}
