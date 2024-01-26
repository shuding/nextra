import nextra from 'nextra'

const withNextra = nextra({
  mdxOptions: {
    providerImportSource: 'nextra-theme-blog',
  },
  defaultShowCopyCode: true,
  readingTime: true
})

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  experimental: {
    optimizePackageImports: [
      'nextra/components',
      // 'nextra/hooks'
    ]
  }
})
