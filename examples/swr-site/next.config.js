import bundleAnalyzer from '@next/bundle-analyzer'
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
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
  latex: true
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

/**
 * @type {import('next').NextConfig}
 */
export default withBundleAnalyzer(
  withNextra({
    eslint: {
      // Eslint behaves weirdly in this monorepo.
      ignoreDuringBuilds: true
    },
    i18n: {
      locales: ['en', 'es', 'ru'],
      defaultLocale: 'en'
    }, // basePath: "/some-base-path",
    distDir: './.next', // Nextra supports custom `nextConfig.distDir`
    redirects: () => [
      // {
      //   source: "/docs.([a-zA-Z-]+)",
      //   destination: "/docs/getting-started",
      //   statusCode: 301,
      // },
      // {
      //   source: "/advanced/performance",
      //   destination: "/docs/advanced/performance",
      //   statusCode: 301,
      // },
      // {
      //   source: "/advanced/cache",
      //   destination: "/docs/advanced/cache",
      //   statusCode: 301,
      // },
      // {
      //   source: "/docs/cache",
      //   destination: "/docs/advanced/cache",
      //   statusCode: 301,
      // },
      {
        source: '/change-log',
        destination: '/docs/change-log',
        statusCode: 301
      },
      {
        source: '/blog/swr-1',
        destination: '/blog/swr-v1',
        statusCode: 301
      },
      {
        source: '/docs.([a-zA-Z-]+)',
        destination: '/docs/getting-started',
        statusCode: 302
      },
      {
        source: '/docs',
        destination: '/docs/getting-started',
        statusCode: 302
      },
      {
        source: '/examples',
        destination: '/examples/basic',
        statusCode: 302
      },
      {
        source: '/',
        destination: '/en',
        permanent: true
      }
    ],
    reactStrictMode: true
  })
)
