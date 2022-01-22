export const cnPageMap: any[] = [
  {
    name: 'blog',
    children: [
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Announcing SWR 1.0'
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Announcing SWR 1.0'
        },
        locale: 'es-ES'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'SWR 1.0 の発表'
        },
        locale: 'ja'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Announcing SWR 1.0'
        },
        locale: 'ko'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Представляем SWR 1.0'
        },
        locale: 'ru'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'SWR 1.0 发布'
        },
        locale: 'zh-CN'
      },
      {
        name: 'swr-v1',
        route: '/blog/swr-v1',
        frontMatter: {
          image:
            'https://assets.vercel.com/image/upload/v1630059453/swr/v1.png',
          description:
            '大约两年前，我们开源了 SWR，大家喜爱的小型数据请求 React 库。今天，我们迎来了另一个里程碑：SWR 1.0 版本发布。'
        },
        locale: 'zh-CN'
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
            route: '/docs/advanced/cache',
            locale: 'zh-CN'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'Cache',
              performance: 'Performance',
              'react-native': 'React Native'
            },
            locale: 'en-US'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'Cache',
              performance: 'Rendimiento',
              'react-native': 'React Native'
            },
            locale: 'es-ES'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'キャッシュ',
              performance: 'パフォーマンス',
              'react-native': 'React Native'
            },
            locale: 'ja'
          },
          {
            name: 'meta.json',
            meta: {
              cache: '캐시',
              performance: '성능',
              'react-native': 'React Native'
            },
            locale: 'ko'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'Кеш',
              performance: 'Производительность',
              'react-native': 'React Native'
            },
            locale: 'ru'
          },
          {
            name: 'meta.json',
            meta: {
              cache: '缓存',
              performance: '性能',
              'react-native': 'React Native'
            },
            locale: 'zh-CN'
          },
          {
            name: 'performance',
            route: '/docs/advanced/performance',
            locale: 'zh-CN'
          },
          {
            name: 'react-native',
            route: '/docs/advanced/react-native',
            locale: 'zh-CN'
          }
        ],
        route: '/docs/advanced'
      },
      {
        name: 'arguments',
        route: '/docs/arguments',
        locale: 'zh-CN'
      },
      {
        name: 'change-log',
        route: '/docs/change-log',
        locale: 'zh-CN'
      },
      {
        name: 'conditional-fetching',
        route: '/docs/conditional-fetching',
        locale: 'zh-CN'
      },
      {
        name: 'data-fetching',
        route: '/docs/data-fetching',
        locale: 'zh-CN'
      },
      {
        name: 'error-handling',
        route: '/docs/error-handling',
        locale: 'zh-CN'
      },
      {
        name: 'getting-started',
        route: '/docs/getting-started',
        locale: 'zh-CN'
      },
      {
        name: 'global-configuration',
        route: '/docs/global-configuration',
        locale: 'zh-CN'
      },
      {
        name: 'meta.json',
        meta: {
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
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': 'Comienza',
          options: 'Opciones',
          'global-configuration': 'Configuración Global',
          'data-fetching': 'Obtención De Datos',
          'error-handling': 'Gestión De Errores',
          revalidation: 'Revalidación Automática',
          'conditional-fetching': 'Obtención De Datos Condicional',
          arguments: 'Argumentos',
          mutation: 'Mutación',
          pagination: 'Paginación',
          prefetching: 'Prefetching',
          'with-nextjs': 'Next.js SSG and SSR',
          typescript: 'Typescript',
          suspense: 'Suspense',
          middleware: 'Middleware',
          advanced: 'Avanzado',
          'change-log': 'Registro de cambios'
        },
        locale: 'es-ES'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': 'はじめに',
          options: 'オプション',
          'global-configuration': 'グローバルな設定',
          'data-fetching': 'データの取得',
          'error-handling': 'エラーハンドリング',
          revalidation: '自動再検証',
          'conditional-fetching': '条件付きフェッチ',
          arguments: '引数',
          mutation: 'ミューテーション',
          pagination: 'ページネーション',
          prefetching: 'プリフェッチ',
          'with-nextjs': 'Next.js の SSG と SSR',
          typescript: 'Typescript',
          suspense: 'サスペンス',
          middleware: 'ミドルウェア',
          advanced: '高度な使い方',
          'change-log': '変更履歴'
        },
        locale: 'ja'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': '시작하기',
          options: '옵션',
          'global-configuration': '전역 설정',
          'data-fetching': '데이터 가져오기',
          'error-handling': '에러 처리',
          revalidation: '자동 갱신',
          'conditional-fetching': '조건부 데이터 가져오기',
          arguments: '인자',
          mutation: '뮤테이션',
          pagination: '페이지네이션',
          prefetching: '프리패칭',
          'with-nextjs': 'Next.js SSG 및 SSR',
          typescript: 'Typescript',
          suspense: '서스펜스',
          middleware: 'Middleware',
          advanced: '고급',
          'change-log': '변경 로그'
        },
        locale: 'ko'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': 'Начало работы',
          options: 'Опции',
          'global-configuration': 'Глобальная конфигурация',
          'data-fetching': 'Выборка данных',
          'error-handling': 'Обработка ошибок',
          revalidation: 'Авто-ревалидация',
          'conditional-fetching': 'Условная выборка данных',
          arguments: 'Аргументы',
          mutation: 'Мутация',
          pagination: 'Пагинация',
          prefetching: 'Пред-выборка',
          'with-nextjs': 'Next.js SSG и SSR',
          typescript: 'Typescript',
          suspense: 'Задержка (Suspense)',
          middleware: 'Промежуточное ПО (Middleware)',
          advanced: 'Продвинутые',
          'change-log': 'Журнал изменений'
        },
        locale: 'ru'
      },
      {
        name: 'meta.json',
        meta: {
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
        },
        locale: 'zh-CN'
      },
      {
        name: 'middleware',
        route: '/docs/middleware',
        locale: 'zh-CN'
      },
      {
        name: 'mutation',
        route: '/docs/mutation',
        locale: 'zh-CN'
      },
      {
        name: 'options',
        route: '/docs/options',
        locale: 'zh-CN'
      },
      {
        name: 'pagination',
        route: '/docs/pagination',
        locale: 'zh-CN'
      },
      {
        name: 'prefetching',
        route: '/docs/prefetching',
        locale: 'zh-CN'
      },
      {
        name: 'revalidation',
        route: '/docs/revalidation',
        locale: 'zh-CN'
      },
      {
        name: 'suspense',
        route: '/docs/suspense',
        locale: 'zh-CN'
      },
      {
        name: 'with-nextjs',
        route: '/docs/with-nextjs',
        locale: 'zh-CN'
      },
      {
        name: 'typescript',
        route: '/docs/typescript',
        locale: 'en-US'
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
        },
        locale: 'zh-CN'
      },
      {
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: '基本用法',
          full: true
        },
        locale: 'zh-CN'
      },
      {
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: '错误处理',
          full: true
        },
        locale: 'zh-CN'
      },
      {
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: '无限加载',
          full: true
        },
        locale: 'zh-CN'
      },
      {
        name: 'meta.json',
        meta: {
          basic: 'Basic Usage',
          auth: 'Authentication',
          'infinite-loading': 'Infinite Loading',
          'error-handling': 'Error Handling',
          ssr: 'Next.js SSR'
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          basic: 'Uso Básico',
          auth: 'Autenticación',
          'infinite-loading': 'Carga Infinita',
          'error-handling': 'Manejo De Errores',
          ssr: 'Next.js SSR'
        },
        locale: 'es-ES'
      },
      {
        name: 'meta.json',
        meta: {
          basic: '基本的な使用法',
          auth: '認証',
          'infinite-loading': '無限ローディング',
          'error-handling': 'エラーハンドリング',
          ssr: 'Next.js SSR'
        },
        locale: 'ja'
      },
      {
        name: 'meta.json',
        meta: {
          basic: '기본 사용법',
          auth: '인증',
          'infinite-loading': '인피니트 로딩',
          'error-handling': '에러 처리',
          ssr: 'Next.js SSR'
        },
        locale: 'ko'
      },
      {
        name: 'meta.json',
        meta: {
          basic: 'Основное использование',
          auth: 'Аутентификация',
          'infinite-loading': 'Бесконечная загрузка',
          'error-handling': 'Обработка ошибок',
          ssr: 'Next.js SSR'
        },
        locale: 'ru'
      },
      {
        name: 'meta.json',
        meta: {
          basic: '基本用法',
          auth: '身份验证',
          'infinite-loading': '无限加载',
          'error-handling': '错误处理',
          ssr: 'Next.js SSR'
        },
        locale: 'zh-CN'
      },
      {
        name: 'ssr',
        route: '/examples/ssr',
        frontMatter: {
          title: 'Next.js SSR',
          full: true
        },
        locale: 'en-US'
      }
    ],
    route: '/examples'
  },
  {
    name: 'index',
    route: '/',
    frontMatter: {
      title: '用于数据请求的 React Hooks 库'
    },
    locale: 'zh-CN'
  },
  {
    name: 'meta.json',
    meta: {
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
    },
    locale: 'en-US'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: 'Introducción',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'Docs',
        type: 'nav'
      },
      examples: {
        title: 'Ejemplos',
        type: 'nav'
      },
      blog: {
        title: 'Blog',
        type: 'nav'
      }
    },
    locale: 'es-ES'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: '前書き',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'ドキュメント',
        type: 'nav'
      },
      examples: {
        title: '例',
        type: 'nav'
      },
      blog: {
        title: 'ブログ',
        type: 'nav'
      }
    },
    locale: 'ja'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: '소개',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: '문서',
        type: 'nav'
      },
      examples: {
        title: '예시',
        type: 'nav'
      },
      blog: {
        title: '블로그',
        type: 'nav'
      }
    },
    locale: 'ko'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: 'Введение',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'Документация',
        type: 'nav'
      },
      examples: {
        title: 'Примеры',
        type: 'nav'
      },
      blog: {
        title: 'Блог',
        type: 'nav'
      }
    },
    locale: 'ru'
  },
  {
    name: 'meta.json',
    meta: {
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
    },
    locale: 'zh-CN'
  }
]

export const usPageMap: any[] = [
  {
    name: 'blog',
    children: [
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Announcing SWR 1.0'
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Announcing SWR 1.0'
        },
        locale: 'es-ES'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'SWR 1.0 の発表'
        },
        locale: 'ja'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Announcing SWR 1.0'
        },
        locale: 'ko'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'Представляем SWR 1.0'
        },
        locale: 'ru'
      },
      {
        name: 'meta.json',
        meta: {
          'swr-v1': 'SWR 1.0 发布'
        },
        locale: 'zh-CN'
      },
      {
        name: 'swr-v1',
        route: '/blog/swr-v1',
        frontMatter: {
          image:
            'https://assets.vercel.com/image/upload/v1630059453/swr/v1.png',
          description:
            'Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR.'
        },
        locale: 'en-US'
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
            route: '/docs/advanced/cache',
            locale: 'en-US'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'Cache',
              performance: 'Performance',
              'react-native': 'React Native'
            },
            locale: 'en-US'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'Cache',
              performance: 'Rendimiento',
              'react-native': 'React Native'
            },
            locale: 'es-ES'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'キャッシュ',
              performance: 'パフォーマンス',
              'react-native': 'React Native'
            },
            locale: 'ja'
          },
          {
            name: 'meta.json',
            meta: {
              cache: '캐시',
              performance: '성능',
              'react-native': 'React Native'
            },
            locale: 'ko'
          },
          {
            name: 'meta.json',
            meta: {
              cache: 'Кеш',
              performance: 'Производительность',
              'react-native': 'React Native'
            },
            locale: 'ru'
          },
          {
            name: 'meta.json',
            meta: {
              cache: '缓存',
              performance: '性能',
              'react-native': 'React Native'
            },
            locale: 'zh-CN'
          },
          {
            name: 'performance',
            route: '/docs/advanced/performance',
            locale: 'en-US'
          },
          {
            name: 'react-native',
            route: '/docs/advanced/react-native',
            locale: 'en-US'
          }
        ],
        route: '/docs/advanced'
      },
      {
        name: 'arguments',
        route: '/docs/arguments',
        locale: 'en-US'
      },
      {
        name: 'change-log',
        route: '/docs/change-log',
        locale: 'en-US'
      },
      {
        name: 'conditional-fetching',
        route: '/docs/conditional-fetching',
        locale: 'en-US'
      },
      {
        name: 'data-fetching',
        route: '/docs/data-fetching',
        locale: 'en-US'
      },
      {
        name: 'error-handling',
        route: '/docs/error-handling',
        locale: 'en-US'
      },
      {
        name: 'getting-started',
        route: '/docs/getting-started',
        locale: 'en-US'
      },
      {
        name: 'global-configuration',
        route: '/docs/global-configuration',
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
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
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': 'Comienza',
          options: 'Opciones',
          'global-configuration': 'Configuración Global',
          'data-fetching': 'Obtención De Datos',
          'error-handling': 'Gestión De Errores',
          revalidation: 'Revalidación Automática',
          'conditional-fetching': 'Obtención De Datos Condicional',
          arguments: 'Argumentos',
          mutation: 'Mutación',
          pagination: 'Paginación',
          prefetching: 'Prefetching',
          'with-nextjs': 'Next.js SSG and SSR',
          typescript: 'Typescript',
          suspense: 'Suspense',
          middleware: 'Middleware',
          advanced: 'Avanzado',
          'change-log': 'Registro de cambios'
        },
        locale: 'es-ES'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': 'はじめに',
          options: 'オプション',
          'global-configuration': 'グローバルな設定',
          'data-fetching': 'データの取得',
          'error-handling': 'エラーハンドリング',
          revalidation: '自動再検証',
          'conditional-fetching': '条件付きフェッチ',
          arguments: '引数',
          mutation: 'ミューテーション',
          pagination: 'ページネーション',
          prefetching: 'プリフェッチ',
          'with-nextjs': 'Next.js の SSG と SSR',
          typescript: 'Typescript',
          suspense: 'サスペンス',
          middleware: 'ミドルウェア',
          advanced: '高度な使い方',
          'change-log': '変更履歴'
        },
        locale: 'ja'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': '시작하기',
          options: '옵션',
          'global-configuration': '전역 설정',
          'data-fetching': '데이터 가져오기',
          'error-handling': '에러 처리',
          revalidation: '자동 갱신',
          'conditional-fetching': '조건부 데이터 가져오기',
          arguments: '인자',
          mutation: '뮤테이션',
          pagination: '페이지네이션',
          prefetching: '프리패칭',
          'with-nextjs': 'Next.js SSG 및 SSR',
          typescript: 'Typescript',
          suspense: '서스펜스',
          middleware: 'Middleware',
          advanced: '고급',
          'change-log': '변경 로그'
        },
        locale: 'ko'
      },
      {
        name: 'meta.json',
        meta: {
          'getting-started': 'Начало работы',
          options: 'Опции',
          'global-configuration': 'Глобальная конфигурация',
          'data-fetching': 'Выборка данных',
          'error-handling': 'Обработка ошибок',
          revalidation: 'Авто-ревалидация',
          'conditional-fetching': 'Условная выборка данных',
          arguments: 'Аргументы',
          mutation: 'Мутация',
          pagination: 'Пагинация',
          prefetching: 'Пред-выборка',
          'with-nextjs': 'Next.js SSG и SSR',
          typescript: 'Typescript',
          suspense: 'Задержка (Suspense)',
          middleware: 'Промежуточное ПО (Middleware)',
          advanced: 'Продвинутые',
          'change-log': 'Журнал изменений'
        },
        locale: 'ru'
      },
      {
        name: 'meta.json',
        meta: {
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
        },
        locale: 'zh-CN'
      },
      {
        name: 'middleware',
        route: '/docs/middleware',
        locale: 'en-US'
      },
      {
        name: 'mutation',
        route: '/docs/mutation',
        locale: 'en-US'
      },
      {
        name: 'options',
        route: '/docs/options',
        locale: 'en-US'
      },
      {
        name: 'pagination',
        route: '/docs/pagination',
        locale: 'en-US'
      },
      {
        name: 'prefetching',
        route: '/docs/prefetching',
        locale: 'en-US'
      },
      {
        name: 'revalidation',
        route: '/docs/revalidation',
        locale: 'en-US'
      },
      {
        name: 'suspense',
        route: '/docs/suspense',
        locale: 'en-US'
      },
      {
        name: 'typescript',
        route: '/docs/typescript',
        locale: 'en-US'
      },
      {
        name: 'with-nextjs',
        route: '/docs/with-nextjs',
        locale: 'en-US'
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
        },
        locale: 'en-US'
      },
      {
        name: 'basic',
        route: '/examples/basic',
        frontMatter: {
          title: 'Basic Usage',
          full: true
        },
        locale: 'en-US'
      },
      {
        name: 'error-handling',
        route: '/examples/error-handling',
        frontMatter: {
          title: 'Error Handling',
          full: true
        },
        locale: 'en-US'
      },
      {
        name: 'infinite-loading',
        route: '/examples/infinite-loading',
        frontMatter: {
          title: 'Infinite Loading',
          full: true
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          basic: 'Basic Usage',
          auth: 'Authentication',
          'infinite-loading': 'Infinite Loading',
          'error-handling': 'Error Handling',
          ssr: 'Next.js SSR'
        },
        locale: 'en-US'
      },
      {
        name: 'meta.json',
        meta: {
          basic: 'Uso Básico',
          auth: 'Autenticación',
          'infinite-loading': 'Carga Infinita',
          'error-handling': 'Manejo De Errores',
          ssr: 'Next.js SSR'
        },
        locale: 'es-ES'
      },
      {
        name: 'meta.json',
        meta: {
          basic: '基本的な使用法',
          auth: '認証',
          'infinite-loading': '無限ローディング',
          'error-handling': 'エラーハンドリング',
          ssr: 'Next.js SSR'
        },
        locale: 'ja'
      },
      {
        name: 'meta.json',
        meta: {
          basic: '기본 사용법',
          auth: '인증',
          'infinite-loading': '인피니트 로딩',
          'error-handling': '에러 처리',
          ssr: 'Next.js SSR'
        },
        locale: 'ko'
      },
      {
        name: 'meta.json',
        meta: {
          basic: 'Основное использование',
          auth: 'Аутентификация',
          'infinite-loading': 'Бесконечная загрузка',
          'error-handling': 'Обработка ошибок',
          ssr: 'Next.js SSR'
        },
        locale: 'ru'
      },
      {
        name: 'meta.json',
        meta: {
          basic: '基本用法',
          auth: '身份验证',
          'infinite-loading': '无限加载',
          'error-handling': '错误处理',
          ssr: 'Next.js SSR'
        },
        locale: 'zh-CN'
      },
      {
        name: 'ssr',
        route: '/examples/ssr',
        frontMatter: {
          title: 'Next.js SSR',
          full: true
        },
        locale: 'en-US'
      }
    ],
    route: '/examples'
  },
  {
    name: 'index',
    route: '/',
    frontMatter: {
      title: 'React Hooks for Data Fetching'
    },
    locale: 'en-US'
  },
  {
    name: 'meta.json',
    meta: {
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
    },
    locale: 'en-US'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: 'Introducción',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'Docs',
        type: 'nav'
      },
      examples: {
        title: 'Ejemplos',
        type: 'nav'
      },
      blog: {
        title: 'Blog',
        type: 'nav'
      }
    },
    locale: 'es-ES'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: '前書き',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'ドキュメント',
        type: 'nav'
      },
      examples: {
        title: '例',
        type: 'nav'
      },
      blog: {
        title: 'ブログ',
        type: 'nav'
      }
    },
    locale: 'ja'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: '소개',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: '문서',
        type: 'nav'
      },
      examples: {
        title: '예시',
        type: 'nav'
      },
      blog: {
        title: '블로그',
        type: 'nav'
      }
    },
    locale: 'ko'
  },
  {
    name: 'meta.json',
    meta: {
      index: {
        title: 'Введение',
        type: 'nav',
        hidden: true
      },
      docs: {
        title: 'Документация',
        type: 'nav'
      },
      examples: {
        title: 'Примеры',
        type: 'nav'
      },
      blog: {
        title: 'Блог',
        type: 'nav'
      }
    },
    locale: 'ru'
  },
  {
    name: 'meta.json',
    meta: {
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
    },
    locale: 'zh-CN'
  }
]
