import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.jsx',
  latex: {
    renderer: 'mathjax',
    options: { config: { tex: { macros: { RR: '\\mathbb{R}' } } } }
  },
  search: {
    codeblocks: false
  }
})

export default withNextra({
  reactStrictMode: true
})
