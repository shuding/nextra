/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss')
  ]
}
