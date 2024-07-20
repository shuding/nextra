import path from 'path'
import nextra from 'nextra'

const withNextra = nextra({
  mdxOptions: {
    providerImportSource: path.join(process.cwd(), 'mdx-components')
    // or providerImportSource: 'nextra-theme-blog'
  },
  defaultShowCopyCode: true,
  readingTime: true
})

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  experimental: {
    optimizePackageImports: ['nextra/components', 'nextra-theme-blog']
  }
})
