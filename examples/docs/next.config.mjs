import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  useContentDir: true,
  mdxOptions: {
    providerImportSource: 'nextra-theme-docs'
  }
})

export default withNextra({
  reactStrictMode: true
})
