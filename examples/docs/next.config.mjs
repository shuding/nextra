import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './src/theme.config.tsx',
  unstable_staticImage: true
})

export default withNextra({
  reactStrictMode: true
})
