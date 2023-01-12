/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-lightningcss': {
      browsers: '>= .25%'
    }
  }
}
