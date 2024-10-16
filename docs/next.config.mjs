import path from 'node:path'
import nextra from 'nextra'

/**
 * @type {import('nextra').NextraConfig}
 */
const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true
})

const sep = path.sep === '/' ? '/' : '\\\\'

const ALLOWED_SVG_RE = new RegExp(`components${sep}icons${sep}.+\\.svg$`)

/**
 * @type {import('next').NextConfig}
 */
export default withNextra({
  reactStrictMode: true,
  eslint: {
    // ESLint behaves weirdly in this monorepo.
    ignoreDuringBuilds: true
  },
  redirects: () => [
    {
      source: '/docs/guide/:slug(typescript|latex|tailwind-css|mermaid)',
      destination: '/docs/guide/advanced/:slug',
      permanent: true
    },
    {
      source: '/docs/docs-theme/built-ins/:slug(callout|steps|tabs|bleed)',
      destination: '/docs/guide/built-ins/:slug',
      permanent: true
    },
    {
      source: '/docs/docs-theme/api/use-config',
      destination: '/docs/docs-theme/api',
      permanent: true
    },
    {
      source: '/docs/docs-theme/built-ins',
      destination: '/docs/guide/built-ins',
      permanent: true
    }
  ],
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.('.svg')
    )
    fileLoaderRule.exclude = ALLOWED_SVG_RE

    config.module.rules.push({
      test: ALLOWED_SVG_RE,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: ['removeXMLNS']
            }
          }
        }
      ]
    })
    return config
  },
  experimental: {
    optimizePackageImports: ['@components/icons', 'nextra/components'],
    turbo: {
      rules: {
        './components/icons/*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  }
})
