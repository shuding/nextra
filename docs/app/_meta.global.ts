export default {
  index: {
    type: 'page',
    display: 'hidden'
  },
  docs: {
    type: 'folder',
    items: {
      index: '',
      guide: {
        type: 'folder',
        items: {
          'organize-files': '',
          markdown: '',
          'syntax-highlighting': '',
          link: '',
          image: '',
          ssg: '',
          i18n: '',
          'custom-css': '',
          'static-exports': '',
          search: '',
          'github-alert-syntax': '',
          turbopack: ''
        }
      },
      advanced: {
        type: 'folder',
        items: {
          npm2yarn: '',
          mermaid: '',
          'tailwind-css': '',
          latex: '',
          table: '',
          typescript: '',
          remote: '',
          playground: {
            theme: {
              layout: 'full'
            }
          }
        }
      },
      'built-ins': {
        type: 'folder',
        items: {
          _: {
            type: 'separator',
            title: 'Layout Components'
          },
          banner: '',
          head: '',
          search: '',
          __: {
            type: 'separator',
            title: 'Content Components'
          }
        }
      },
      _: {
        type: 'separator',
        title: 'Themes'
      },
      'docs-theme': {
        type: 'folder',
        items: {
          start: '',
          'page-configuration': '',
          'built-ins': ''
        }
      },
      'blog-theme': '',
      'custom-theme': '',
      __: {
        type: 'separator',
        title: 'More'
      },
      'about-link': {
        title: 'About Nextra',
        href: '/about'
      },
      'next.js-link': {
        title: 'Next.js Docs',
        href: 'https://nextjs.org?utm_source=nextra.site&utm_medium=referral&utm_campaign=sidebar'
      },
      'migration-from-v3': {
        title: 'Migration from Nextra v3',
        href: 'https://the-guild.dev/blog/nextra-4?utm_source=nextra.site&utm_campaign=sidebar&utm_content=sidebar_link'
      },
    }
  },
  versions: {
    type: 'menu',
    title: 'Versions',
    items: {
      _3: {
        title: 'Nextra v3 Docs',
        href: 'https://nextra-v2-pyibc76cq-shud.vercel.app'
      },
      _2: {
        title: 'Nextra v2 Docs',
        href: 'https://nextra-v2-oe0zrpzjp-shud.vercel.app'
      }
    }
  },
  blog: {
    type: 'page',
    theme: {
      typesetting: 'article'
    }
  },
  about: {
    type: 'page',
    theme: {
      typesetting: 'article'
    }
  },
  showcase: {
    type: 'page',
    theme: {
      typesetting: 'article',
      layout: 'full',
      timestamp: false
    }
  },
  sponsors: {
    type: 'page',
    theme: {
      typesetting: 'article',
      layout: 'full',
      timestamp: false
    }
  }
}
