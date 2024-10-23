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

const nextConfig = withBundleAnalyzer(
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
    redirects: async () => [
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
        // Provoke error
        // Could not find the module in the React Client Manifest. This is probably a bug in the React Server Components bundler
        // 'nextra/components'
      ],
      turbo: {
        rules: {
          './app/_icons/*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js'
          }
        }
      }
    }
  })
)

export default nextConfig
