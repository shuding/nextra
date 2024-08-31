import type { PageMapItem } from '../../../src/types'

export const cnPageMap: PageMapItem[] = [
  {
    name: 'blog',
    children: [
      {
        data: {
          'swr-v1': 'SWR 1.0 发布'
        }
      },
      {
        name: 'swr-v1',
        route: '/blog/swr-v1',
        frontMatter: {
          image:
            'https://assets.vercel.com/image/upload/v1630059453/swr/v1.png',
          description:
            '大约两年前，我们开源了 SWR，大家喜爱的小型数据请求 React 库。今天，我们迎来了另一个里程碑：SWR 1.0 版本发布。'
        }
      }
    ],
    route: '/blog'
  },
  {
    name: 'docs',
    children: [
      {
        name: 'advanced',
        children: [
          {
            name: 'cache',
            route: '/docs/advanced/cache'
          },
          {
            data: {
              cache: '缓存',
              performance: '性能',
              'react-native': 'React Native'
            }
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
        data: {
          'getting-started': '入门',
          options: '选项',
          'global-configuration': '全局配置',
          'data-fetching': '数据请求',
          'error-handling': '错误处理',
          revalidation: '自动重新请求',
          'conditional-fetching': '条件数据请求',
          arguments: '传入参数',
          mutation: '数据更改',
          pagination: '分页',
          prefetching: '预请求',
          'with-nextjs': 'Next.js SSG 和 SSR',
          typescript: 'Typescript',
          suspense: 'Suspense',
          middleware: '中间件',
          advanced: '高级',
          'change-log': '更新日志'
        }
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
        name: 'auth',
        route: '/examples/auth',
        frontMatter: {
          title: '身份验证',
          full: true
        }
      },
      {
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: '基本用法',
          full: true
        }
      },
      {
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: '错误处理',
          full: true
        }
      },
      {
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: '无限加载',
          full: true
        }
      },
      {
        data: {
          basic: '基本用法',
          auth: '身份验证',
          'infinite-loading': '无限加载',
          'error-handling': '错误处理',
          ssr: 'Next.js SSR'
        }
      }
    ],
    route: '/examples'
  },
  {
    name: 'index',
    route: '/',
    frontMatter: {
      title: '用于数据请求的 React Hooks 库'
    }
  },
  {
    data: {
      index: {
        title: '简介',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: '文档',
        type: 'nav'
      },
      examples: {
        title: '示例',
        type: 'nav'
      },
      blog: {
        title: '博客',
        type: 'nav'
      }
    }
  }
]

export const usPageMap: PageMapItem[] = [
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
        name: 'advanced',
        children: [
          {
            name: 'cache',
            route: '/docs/advanced/cache'
          },
          {
            data: {
              cache: 'Cache',
              performance: 'Performance',
              'react-native': 'React Native'
            }
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
        name: 'auth',
        route: '/examples/auth',
        frontMatter: {
          title: 'Authentication',
          full: true
        }
      },
      {
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: 'Basic Usage',
          full: true
        }
      },
      {
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: 'Error Handling',
          full: true
        }
      },
      {
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: 'Infinite Loading',
          full: true
        }
      },
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
        name: 'ssr',
        route: '/examples/ssr',
        frontMatter: {
          title: 'Next.js SSR',
          full: true
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
  },
  {
    data: {
      index: {
        title: 'Introduction',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'Docs',
        type: 'nav'
      },
      examples: {
        title: 'Examples',
        type: 'nav'
      },
      blog: {
        title: 'Blog',
        type: 'nav'
      }
    }
  }
]
