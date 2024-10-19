import bundleAnalyzer from '@next/bundle-analyzer'
import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  latex: true,
  useContentDir: true
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

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
      // rule.exclude doesn't work starting from Next.js 15
      const { test: _test, ...imageLoaderOptions } = config.module.rules.find(
        rule => rule.test?.test?.('.svg')
      )
      config.module.rules.push({
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /svgr/,
            use: ['@svgr/webpack']
          },
          imageLoaderOptions
        ]
      })
      return config
    },
    experimental: {
      optimizePackageImports: [
        // '@app/_icons'
        'nextra/components'
      ]
    }
  })
)
