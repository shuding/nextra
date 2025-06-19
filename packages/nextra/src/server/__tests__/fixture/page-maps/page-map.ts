import type { PageMapItem } from '../../../../types.js'

export const usPageMap: PageMapItem[] = [
  {
    data: {
      index: 'Introduction',
      docs: 'Docs',
      examples: 'Examples',
      blog: 'Blog'
    }
  },
  {
    name: 'blog',
    children: [
      {
        data: {
          'swr-v1': 'Announcing SWR 1.0'
        }
      },
      {
        name: 'swr-v1',
        route: '/blog/swr-v1',
        frontMatter: {
          image:
            'https://assets.vercel.com/image/upload/v1630059453/swr/v1.png',
          description:
            'Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR.'
        }
      }
    ],
    route: '/blog'
  },
  {
    name: 'docs',
    children: [
      {
        data: {
          'getting-started': 'Getting Started',
          options: 'Options',
          'global-configuration': 'Global Configuration',
          'data-fetching': 'Data Fetching',
          'error-handling': 'Error Handling',
          revalidation: 'Auto Revalidation',
          'conditional-fetching': 'Conditional Data Fetching',
          arguments: 'Arguments',
          mutation: 'Mutation',
          pagination: 'Pagination',
          prefetching: 'Prefetching',
          'with-nextjs': 'Next.js SSG and SSR',
          typescript: 'Typescript',
          suspense: 'Suspense',
          middleware: 'Middleware',
          advanced: 'Advanced',
          'change-log': 'Change Log'
        }
      },
      {
        name: 'advanced',
        children: [
          {
            data: {
              cache: 'Cache',
              performance: 'Performance',
              'react-native': 'React Native'
            }
          },
          {
            name: 'cache',
            route: '/docs/advanced/cache'
          },
          {
            name: 'performance',
            route: '/docs/advanced/performance'
          },
          {
            name: 'react-native',
            route: '/docs/advanced/react-native'
          }
        ],
        route: '/docs/advanced'
      },
      {
        name: 'arguments',
        route: '/docs/arguments'
      },
      {
        name: 'change-log',
        route: '/docs/change-log'
      },
      {
        name: 'conditional-fetching',
        route: '/docs/conditional-fetching'
      },
      {
        name: 'data-fetching',
        route: '/docs/data-fetching'
      },
      {
        name: 'error-handling',
        route: '/docs/error-handling'
      },
      {
        name: 'getting-started',
        route: '/docs/getting-started'
      },
      {
        name: 'global-configuration',
        route: '/docs/global-configuration'
      },
      {
        name: 'middleware',
        route: '/docs/middleware'
      },
      {
        name: 'mutation',
        route: '/docs/mutation'
      },
      {
        name: 'options',
        route: '/docs/options'
      },
      {
        name: 'pagination',
        route: '/docs/pagination'
      },
      {
        name: 'prefetching',
        route: '/docs/prefetching'
      },
      {
        name: 'revalidation',
        route: '/docs/revalidation'
      },
      {
        name: 'suspense',
        route: '/docs/suspense'
      },
      {
        name: 'typescript',
        route: '/docs/typescript'
      },
      {
        name: 'with-nextjs',
        route: '/docs/with-nextjs'
      }
    ],
    route: '/docs'
  },
  {
    name: 'examples',
    children: [
      {
        data: {
          basic: 'Basic Usage',
          auth: 'Authentication',
          'infinite-loading': 'Infinite Loading',
          'error-handling': 'Error Handling',
          ssr: 'Next.js SSR'
        }
      },
      {
        name: 'auth',
        route: '/examples/auth',
        frontMatter: {
          title: 'Authentication'
        }
      },
      {
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: 'Basic Usage'
        }
      },
      {
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: 'Error Handling'
        }
      },
      {
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: 'Infinite Loading'
        }
      },
      {
        name: 'ssr',
        route: '/examples/ssr',
        frontMatter: {
          title: 'Next.js SSR'
        }
      }
    ],
    route: '/examples'
  },
  {
    name: 'index',
    route: '/',
    frontMatter: {
      title: 'React Hooks for Data Fetching'
    }
  }
]
