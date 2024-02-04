import path from 'node:path'
import bundleAnalyzer from '@next/bundle-analyzer'
import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  transform(content, { route }) {
    if (route.startsWith('/en/docs/advanced/dynamic-markdown-import')) {
      return `
${content}
export function getStaticProps() {
  return {
    props: {
      foo: 'from nextra config'
    }
  }
}`
    }
    return content
  },
  transformPageMap(pageMap, locale) {
    if (locale === 'en') {
      pageMap = [
        ...pageMap,
        {
          name: 'virtual-page',
          route: '/en/virtual-page',
          frontMatter: { sidebarTitle: 'Virtual Page' }
        }
      ]
    }
    return pageMap
  },
  latex: true,
  mdxBaseDir: './mdx'
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const sep = path.sep === '/' ? '/' : '\\\\'

const ALLOWED_SVG_REGEX = new RegExp(`_icons${sep}.+\\.svg$`)

/**
 * @type {import('next').NextConfig}
 */
export default withBundleAnalyzer(
  withNextra({
    reactStrictMode: true,
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true
    },
    i18n: {
      locales: ['en', 'es', 'ru'],
      defaultLocale: 'en'
    },
    redirects: () => [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        statusCode: 302
      }
    ],
    webpack(config) {
      const fileLoaderRule = config.module.rules.find(rule =>
        rule.test?.test?.('.svg')
      )
      fileLoaderRule.exclude = ALLOWED_SVG_REGEX

      config.module.rules.push({
        test: ALLOWED_SVG_REGEX,
        use: ['@svgr/webpack']
      })
      return config
    }
  })
)
