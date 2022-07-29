module.exports = ctx => ({
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    ctx.env === 'production' ? require('cssnano') : false
  ]
})
