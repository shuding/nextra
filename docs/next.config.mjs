import path from 'node:path'
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  search: {
    codeblocks: false
  },
  defaultShowCopyCode: true
})

const sep = path.sep === '/' ? '/' : '\\\\'

const ALLOWED_SVG_REGEX = new RegExp(`components${sep}icons${sep}.+\\.svg$`)

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
      source: '/docs/docs-theme/built-ins/:slug(callout|steps|tabs)',
      destination: '/docs/guide/built-ins/:slug',
      permanent: true
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
