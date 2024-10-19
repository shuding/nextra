import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  useContentDir: true
})

export default withNextra({
  reactStrictMode: true
})
