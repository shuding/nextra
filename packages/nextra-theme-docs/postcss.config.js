module.exports = (ctx) => ({
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ctx.env === 'production' ? require('cssnano') : false
  ]
})
