import type { PageMapItem } from 'nextra'
import { Search } from 'nextra/components'
import { element, reactNode } from 'nextra/schemas'
import { Fragment } from 'react'
import { z } from 'zod'
import { LastUpdated } from './components'

const attributeSchema = z
  .custom<
    'class' | `data-${string}`
  >(value => value === 'class' || value.startsWith('data-'))
  .meta({ type: "'class' | `data-${string}`" })

const feedbackSchema = z.strictObject({
  content: reactNode.default('Question? Give us feedback').meta({
    description: 'Content of the feedback link.'
  }),
  labels: z.string().default('feedback').meta({
    description: 'Labels that can be added to the new created issue.'
  }),
  link: z
    .string()
    .optional()
    .meta({
      description: `Feedback link URL.

By default, it's a link to the issue creation form of the docs repository, with the current page title prefilled:
[example](https://github.com/shuding/nextra/issues/new?title=Feedback%20for%20%E2%80%9CTheme%20Configuration%E2%80%9D&labels=feedback).`
    })
})

const nextThemesSchema = z.strictObject({
  attribute: z
    .union([attributeSchema, z.array(attributeSchema)])
    .default('class'),
  defaultTheme: z.string().default('system'),
  disableTransitionOnChange: z.boolean().default(true),
  forcedTheme: z.string().optional(),
  storageKey: z.string().default('theme')
})

const sidebarSchema = z.strictObject({
  autoCollapse: z.boolean().optional().meta({
    description:
      'If `true`, automatically collapse inactive folders above `defaultMenuCollapseLevel`.'
  }),
  defaultMenuCollapseLevel: z.number().int().min(1).default(2).meta({
    description:
      'Specifies the folder level at which the menu on the left is collapsed by default.'
  }),
  defaultOpen: z.boolean().default(true).meta({
    description: 'Hide/show sidebar by default.'
  }),
  toggleButton: z.boolean().default(true).meta({
    description: 'Hide/show sidebar toggle button.'
  })
})

const themeSwitchSchema = z.strictObject({
  dark: z.string().default('Dark'),
  light: z.string().default('Light'),
  system: z.string().default('System')
})

const tocSchema = z.strictObject({
  backToTop: reactNode.default('Scroll to top').meta({
    description: 'Text of back to top button.'
  }),
  extraContent: reactNode
    // @TODO added in zod v4
    .optional()
    .meta({
      description: 'Display extra content below the TOC content.'
    }),
  float: z.boolean().default(true).meta({
    description: 'Float the TOC next to the content.'
  }),
  title: reactNode.default('On This Page').meta({
    description: 'Title of the TOC sidebar.'
  })
})

export const LayoutPropsSchema = z.strictObject({
  banner: reactNode
    // @TODO added in zod v4
    .optional()
    .meta({
      description:
        'Rendered [`<Banner>` component](/docs/built-ins/banner). E.g. `<Banner {...bannerProps} />`'
    }),
  children: reactNode,
  darkMode: z.boolean().default(true).meta({
    description: 'Show or hide the dark mode select button.'
  }),
  docsRepositoryBase: z
    .string()
    .startsWith('https://')
    .default('https://github.com/shuding/nextra')
    .meta({
      description: 'URL of the documentation repository.'
    }),
  editLink: reactNode.default('Edit this page').meta({
    description: 'Content of the edit link.'
  }),
  feedback: feedbackSchema.default(feedbackSchema.parse({})),
  footer: reactNode
    // @TODO added in zod v4
    .optional()
    .meta({
      description:
        'Rendered [`<Footer>` component](/docs/docs-theme/built-ins/footer). E.g. `<Footer {...footerProps} />`'
    }),
  i18n: z
    .array(
      z.strictObject({
        locale: z.string().meta({
          description: 'Locale from `i18n.locales` field in `next.config` file.'
        }),
        name: z.string().meta({
          description: 'Locale name in dropdown.'
        })
      })
    )
    .default([])
    .meta({
      description:
        'Options to configure the language dropdown for [the i18n docs website](/docs/guide/i18n).'
    }),
  lastUpdated: element
    .default(<LastUpdated />)
    .refine(el => el.type !== Fragment && typeof el.type !== 'string', {
      error: `\`Layout#lastUpdated\` must be a \`<LastUpdated />\` component:

\`\`\`js
import { Layout, LastUpdated } from 'nextra-theme-docs'

<Layout
  lastUpdated={<LastUpdated locale="YOUR_LOCALE">YOUR_CONTENT</LastUpdated>}
>
  {children}
</Layout>
\`\`\`
`
    })
    .meta({
      default: '<LastUpdated />',
      description: 'Component to render the last updated info.'
    }),
  navbar: reactNode
    // @TODO added in zod v4
    .optional()
    .meta({
      description:
        'Rendered [`<Navbar>` component](/docs/docs-theme/built-ins/navbar). E.g. `<Navbar {...navbarProps} />`'
    }),
  navigation: z
    .union([
      z.boolean(),
      z.strictObject({
        next: z.boolean(),
        prev: z.boolean()
      })
    ])
    .default(true)
    .overwrite(v => (typeof v === 'boolean' ? { next: v, prev: v } : v))
    .meta({
      description: 'Enable or disable navigation link.'
    }),
  nextThemes: nextThemesSchema.default(nextThemesSchema.parse({})).meta({
    description:
      'Configuration for the [next-themes](https://github.com/pacocoursey/next-themes#themeprovider) package.'
  }),
  pageMap: z
    .array(
      z.custom<PageMapItem>().meta({
        type: 'import("nextra").PageMapItem'
      })
    )
    .meta({
      description: "Page map list. Result of `getPageMap(route = '/')` call."
    }),
  search: reactNode.default(<Search />).meta({
    default: '<Search />',
    description:
      'Rendered [`<Search>` component](/docs/built-ins/search). E.g. `<Search {...searchProps} />`'
  }),
  sidebar: sidebarSchema.default(sidebarSchema.parse({})),
  themeSwitch: themeSwitchSchema.default(themeSwitchSchema.parse({})).meta({
    description: 'Translation of options in the theme switch.'
  }),
  toc: tocSchema.default(tocSchema.parse({}))
})
