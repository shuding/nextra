module.exports = {
  purge: ['./src/**/*.js', './src/**/*.css'],
  theme: {
    fontFamily: {
      display: ['system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"']
    },
    typography: {
      default: {
        css: {
          pre: {
            color: 'inherit',
            backgroundColor: 'whitesmoke',
            border: '1px solid #eaeaea'
          }
        }
      }
    },
    extend: {
      typography: {
        default: {
          css: {
            color: '#000',
            a: {
              color: '#3093ef'
            },
          },
        },
      }
    },
  },
  plugins: [require('@tailwindcss/typography')]
}
