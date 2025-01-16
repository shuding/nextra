import { LinkArrowIcon } from 'nextra/icons'
import type { FC, ReactNode } from 'react'
import { useMDXComponents } from '../mdx-components'

// eslint-disable-next-line react-hooks/rules-of-hooks -- isn't react hook
const { code: Code } = useMDXComponents()

const ExternalLink: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Code>{children}</Code>&thinsp;
      <LinkArrowIcon
        // based on font-size
        height="1em"
        className="x:inline x:align-baseline x:shrink-0"
      />
    </>
  )
}

export default {
  index: {
    type: 'page',
    display: 'hidden'
  },
  docs: {
    type: 'page',
    title: 'Documentation',
    items: {
      index: '',
      'file-conventions': {
        items: {
          _: {
            type: 'separator',
            title: 'Files'
          },
          'page-file': <Code>page.mdx</Code>,
          'meta-file': <Code>_meta.js</Code>,
          'mdx-components-file': <Code>mdx-components.js</Code>,
          _2: {
            href: 'https://nextjs.org/docs/app/api-reference/file-conventions/page',
            title: <ExternalLink>page.jsx</ExternalLink>
          },
          _3: {
            href: 'https://nextjs.org/docs/app/api-reference/file-conventions/layout',
            title: <ExternalLink>layout.jsx</ExternalLink>
          },
          _4: {
            type: 'separator',
            title: 'Top-Level Folders'
          },
          'content-directory': <Code>content</Code>,
          'src-directory': <Code>src</Code>,
          _5: {
            href: 'https://nextjs.org/docs/app/getting-started/installation#create-the-app-directory',
            title: <ExternalLink>app</ExternalLink>
          },
          _6: {
            href: 'https://nextjs.org/docs/app/building-your-application/optimizing/static-assets',
            title: <ExternalLink>public</ExternalLink>
          }
        }
      },
      guide: {
        items: {
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
        items: {
          start: '',
          'built-ins': {
            items: {
              layout: ''
            }
          }
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
        href: 'https://the-guild.dev/blog/nextra-4?utm_source=nextra.site&utm_campaign=sidebar&utm_content=sidebar_link#nextra-theme-docs-changes'
      }
    }
  },
  versions: {
    type: 'menu',
    title: 'Versions',
    items: {
      _3: {
        title: 'Nextra v3 Docs',
        href: 'https://nextra-v2-7hslbun8z-shud.vercel.app'
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
