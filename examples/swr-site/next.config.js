import path from 'node:path'
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

const sep = path.sep === '/' ? '/' : '\\\\'

const ALLOWED_SVG_RE = new RegExp(`_icons${sep}.+\\.svg$`)

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
      fileLoaderRule.exclude = ALLOWED_SVG_RE

      config.module.rules.push({
        test: ALLOWED_SVG_RE,
        use: ['@svgr/webpack']
      })
      return config
    },
    experimental: {
      optimizePackageImports: [
        '@app/_icons'
        // 'nextra/components',
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
