module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.md', './.nextra/**/*.js', './nextra.config.js'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      display: ['inter', 'sans-serif'],
    },
    letterSpacing: {
      tight: '-0.015em'
    }
  }
}
