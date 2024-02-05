import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  mdxBaseDir: './mdx',
  mdxOptions: {
    providerImportSource: 'nextra-theme-docs'
  }
})

export default withNextra({
  reactStrictMode: true
})
