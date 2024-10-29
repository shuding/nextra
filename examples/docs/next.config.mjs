import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  useContentDir: true,
  catchAllBasePath: 'docs'
})

export default withNextra({
  reactStrictMode: true
})
