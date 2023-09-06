import type { PageMapItem } from '../../../src/types'

export const cnPageMap: PageMapItem[] = [
  {
    kind: 'Folder',
    name: 'blog',
    children: [
      {
        kind: 'Meta',
        data: {
          'swr-v1': 'SWR 1.0 发布'
        }
      },
      {
        kind: 'MdxPage',
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
    kind: 'Folder',
    name: 'docs',
    children: [
      {
        kind: 'Folder',
        name: 'advanced',
        children: [
          {
            kind: 'MdxPage',
            name: 'cache',
            route: '/docs/advanced/cache'
          },
          {
            kind: 'Meta',
            data: {
              cache: '缓存',
              performance: '性能',
              'react-native': 'React Native'
            }
          },
          {
            kind: 'MdxPage',
            name: 'performance',
            route: '/docs/advanced/performance'
          },
          {
            kind: 'MdxPage',
            name: 'react-native',
            route: '/docs/advanced/react-native'
          }
        ],
        route: '/docs/advanced'
      },
      {
        kind: 'MdxPage',
        name: 'arguments',
        route: '/docs/arguments'
      },
      {
        kind: 'MdxPage',
        name: 'change-log',
        route: '/docs/change-log'
      },
      {
        kind: 'MdxPage',
        name: 'conditional-fetching',
        route: '/docs/conditional-fetching'
      },
      {
        kind: 'MdxPage',
        name: 'data-fetching',
        route: '/docs/data-fetching'
      },
      {
        kind: 'MdxPage',
        name: 'error-handling',
        route: '/docs/error-handling'
      },
      {
        kind: 'MdxPage',
        name: 'getting-started',
        route: '/docs/getting-started'
      },
      {
        kind: 'MdxPage',
        name: 'global-configuration',
        route: '/docs/global-configuration'
      },
      {
        kind: 'Meta',
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
        kind: 'MdxPage',
        name: 'middleware',
        route: '/docs/middleware'
      },
      {
        kind: 'MdxPage',
        name: 'mutation',
        route: '/docs/mutation'
      },
      {
        kind: 'MdxPage',
        name: 'options',
        route: '/docs/options'
      },
      {
        kind: 'MdxPage',
        name: 'pagination',
        route: '/docs/pagination'
      },
      {
        kind: 'MdxPage',
        name: 'prefetching',
        route: '/docs/prefetching'
      },
      {
        kind: 'MdxPage',
        name: 'revalidation',
        route: '/docs/revalidation'
      },
      {
        kind: 'MdxPage',
        name: 'suspense',
        route: '/docs/suspense'
      },
      {
        kind: 'MdxPage',
        name: 'with-nextjs',
        route: '/docs/with-nextjs'
      }
    ],
    route: '/docs'
  },
  {
    kind: 'Folder',
    name: 'examples',
    children: [
      {
        kind: 'MdxPage',
        name: 'auth',
        route: '/examples/auth',
        frontMatter: {
          title: '身份验证',
          full: true
        }
      },
      {
        kind: 'MdxPage',
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: '基本用法',
          full: true
        }
      },
      {
        kind: 'MdxPage',
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: '错误处理',
          full: true
        }
      },
      {
        kind: 'MdxPage',
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: '无限加载',
          full: true
        }
      },
      {
        kind: 'Meta',
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
    kind: 'MdxPage',
    name: 'index',
    route: '/',
    frontMatter: {
      title: '用于数据请求的 React Hooks 库'
    }
  },
  {
    kind: 'Meta',
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
    kind: 'Folder',
    name: 'blog',
    children: [
      {
        kind: 'Meta',
        data: {
          'swr-v1': 'Announcing SWR 1.0'
        }
      },
      {
        kind: 'MdxPage',
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
    kind: 'Folder',
    name: 'docs',
    children: [
      {
        kind: 'Folder',
        name: 'advanced',
        children: [
          {
            kind: 'MdxPage',
            name: 'cache',
            route: '/docs/advanced/cache'
          },
          {
            kind: 'Meta',
            data: {
              cache: 'Cache',
              performance: 'Performance',
              'react-native': 'React Native'
            }
          },
          {
            kind: 'MdxPage',
            name: 'performance',
            route: '/docs/advanced/performance'
          },
          {
            kind: 'MdxPage',
            name: 'react-native',
            route: '/docs/advanced/react-native'
          }
        ],
        route: '/docs/advanced'
      },
      {
        kind: 'MdxPage',
        name: 'arguments',
        route: '/docs/arguments'
      },
      {
        kind: 'MdxPage',
        name: 'change-log',
        route: '/docs/change-log'
      },
      {
        kind: 'MdxPage',
        name: 'conditional-fetching',
        route: '/docs/conditional-fetching'
      },
      {
        kind: 'MdxPage',
        name: 'data-fetching',
        route: '/docs/data-fetching'
      },
      {
        kind: 'MdxPage',
        name: 'error-handling',
        route: '/docs/error-handling'
      },
      {
        kind: 'MdxPage',
        name: 'getting-started',
        route: '/docs/getting-started'
      },
      {
        kind: 'MdxPage',
        name: 'global-configuration',
        route: '/docs/global-configuration'
      },
      {
        kind: 'Meta',
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
        kind: 'MdxPage',
        name: 'middleware',
        route: '/docs/middleware'
      },
      {
        kind: 'MdxPage',
        name: 'mutation',
        route: '/docs/mutation'
      },
      {
        kind: 'MdxPage',
        name: 'options',
        route: '/docs/options'
      },
      {
        kind: 'MdxPage',
        name: 'pagination',
        route: '/docs/pagination'
      },
      {
        kind: 'MdxPage',
        name: 'prefetching',
        route: '/docs/prefetching'
      },
      {
        kind: 'MdxPage',
        name: 'revalidation',
        route: '/docs/revalidation'
      },
      {
        kind: 'MdxPage',
        name: 'suspense',
        route: '/docs/suspense'
      },
      {
        kind: 'MdxPage',
        name: 'typescript',
        route: '/docs/typescript'
      },
      {
        kind: 'MdxPage',
        name: 'with-nextjs',
        route: '/docs/with-nextjs'
      }
    ],
    route: '/docs'
  },
  {
    kind: 'Folder',
    name: 'examples',
    children: [
      {
        kind: 'MdxPage',
        name: 'auth',
        route: '/examples/auth',
        frontMatter: {
          title: 'Authentication',
          full: true
        }
      },
      {
        kind: 'MdxPage',
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: 'Basic Usage',
          full: true
        }
      },
      {
        kind: 'MdxPage',
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: 'Error Handling',
          full: true
        }
      },
      {
        kind: 'MdxPage',
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: 'Infinite Loading',
          full: true
        }
      },
      {
        kind: 'Meta',
        data: {
          basic: 'Basic Usage',
          auth: 'Authentication',
          'infinite-loading': 'Infinite Loading',
          'error-handling': 'Error Handling',
          ssr: 'Next.js SSR'
        }
      },
      {
        kind: 'MdxPage',
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
    kind: 'MdxPage',
    name: 'index',
    route: '/',
    frontMatter: {
      title: 'React Hooks for Data Fetching'
    }
  },
  {
    kind: 'Meta',
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
