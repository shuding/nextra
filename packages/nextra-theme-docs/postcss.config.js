/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-lightningcss': {
      browsers: '>= .25% and not dead and not op_mini all'
    }
  }
}
