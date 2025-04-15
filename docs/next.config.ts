import nextra from 'nextra'

// @ts-expect-error -- fixme
function isExportNode(node, varName: string) {
  if (node.type !== 'mdxjsEsm') return false
  const [n] = node.data.estree.body

  if (n.type !== 'ExportNamedDeclaration') return false

  const name = n.declaration?.declarations?.[0].id.name
  if (!name) return false

  return name === varName
}

const DEFAULT_PROPERTY_PROPS = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
}

// @ts-expect-error -- fixme
export function createAstObject(obj) {
  return {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([key, value]) => ({
      ...DEFAULT_PROPERTY_PROPS,
      key: { type: 'Identifier', name: key },
      value:
        value && typeof value === 'object' ? value : { type: 'Literal', value }
    }))
  }
}

type NextraParams = Parameters<typeof nextra>[0]
type MdxOptions = NonNullable<NextraParams['mdxOptions']>
type RehypePlugin = NonNullable<MdxOptions['rehypePlugins']>[0]

// eslint-disable-next-line unicorn/consistent-function-scoping
const rehypeOpenGraphImage: RehypePlugin = () => (ast: any) => {
  // @ts-expect-error -- fixme
  const frontMatterNode = ast.children.find(node =>
    isExportNode(node, 'metadata')
  )
  if (!frontMatterNode) {
    return
  }
  const { properties } =
    frontMatterNode.data.estree.body[0].declaration.declarations[0].init
  // @ts-expect-error -- fixme
  const title = properties.find(o => o.key.value === 'title')?.value.value
  if (!title) {
    return
  }
  const [prop] = createAstObject({
    openGraph: createAstObject({
      images: `https://nextra.site/og?title=${title}`
    })
  }).properties
  properties.push(prop)
}

const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePlugins: [
      // Provide only on `build` since turbopack on `dev` supports only serializable values
      process.env.NODE_ENV === 'production' && rehypeOpenGraphImage
    ].filter(v => !!v)
  },
  whiteListTagsStyling: ['figure', 'figcaption']
})

const nextConfig = withNextra({
  reactStrictMode: true,
  eslint: {
    // ESLint behaves weirdly in this monorepo.
    ignoreDuringBuilds: true
  },
  redirects: async () => [
    {
      source: '/docs/guide/:slug(typescript|latex|tailwind-css|mermaid)',
      destination: '/docs/advanced/:slug',
      permanent: true
    },
    {
      source: '/docs/docs-theme/built-ins/:slug(callout|steps|tabs|bleed)',
      destination: '/docs/built-ins/:slug',
      permanent: true
    },
    {
      source: '/docs/docs-theme/api/use-config',
      destination: '/docs/docs-theme/api',
      permanent: true
    },
    {
      source: '/docs/guide/advanced/:slug',
      destination: '/docs/advanced/:slug',
      permanent: true
    },
    {
      source: '/docs/docs-theme/theme-configuration',
      destination: '/docs/docs-theme/built-ins/layout',
      permanent: true
    },
    {
      source: '/docs/docs-theme/page-configuration',
      destination: '/docs/file-conventions/meta-file',
      permanent: true
    },
    {
      source: '/docs/guide/organize-files',
      destination: '/docs/file-conventions',
      permanent: true
    },
    {
      source: '/docs/advanced/playground',
      destination: '/docs/built-ins/playground',
      permanent: true
    }
  ],
  webpack(config) {
    // rule.exclude doesn't work starting from Next.js 15
    const { test: _test, ...imageLoaderOptions } = config.module.rules.find(
      // @ts-expect-error -- fixme
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
  turbopack: {
    rules: {
      './components/icons/*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  experimental: {
    optimizePackageImports: ['@components/icons']
  }
})

export default nextConfig
