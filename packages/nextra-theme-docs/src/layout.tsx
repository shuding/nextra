/* eslint sort-keys: error */
import { ThemeProvider } from 'next-themes'
import type { PageMapItem } from 'nextra'
import { Search, SkipNavLink } from 'nextra/components'
import { element, reactNode } from 'nextra/schemas'
import type { FC } from 'react'
import { Fragment } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { LastUpdated } from './components/last-updated'
import { MobileNav } from './components/sidebar'
import { ConfigProvider, ThemeConfigProvider } from './stores'

const attributeSchema = z.custom<'class' | `data-${string}`>(
  value => value === 'class' || value.startsWith('data-')
)

export const LayoutPropsSchema = z.strictObject({
  banner: reactNode.describe(
    `Rendered [\`<Banner>\` component](/docs/built-ins/banner). E.g. \`<Banner {...bannerProps} />\`
@remarks \`ReactNode\``
  ),
  children: reactNode.describe('@remarks `ReactNode`'),
  darkMode: z
    .boolean()
    .default(true)
    .describe('Show or hide the dark mode select button.'),
  docsRepositoryBase: z
    .string()
    .startsWith('https://')
    .default('https://github.com/shuding/nextra')
    .describe('URL of the documentation repository.'),
  editLink: reactNode.default('Edit this page')
    .describe(`Content of the edit link.
@remarks \`ReactNode\``),
  feedback: z
    .strictObject({
      content: reactNode.default('Question? Give us feedback')
        .describe(`Content of the feedback link.
@remarks \`ReactNode\``),
      labels: z
        .string()
        .default('feedback')
        .describe('Labels that can be added to the new created issue.')
    })
    .default({}),
  footer: reactNode.describe(
    `Rendered [\`<Footer>\` component](/docs/docs-theme/built-ins/footer). E.g. \`<Footer {...footerProps} />\`
@remarks \`ReactNode\``
  ),
  i18n: z
    .array(
      z.strictObject({
        locale: z.string().describe('Locale from `i18n.locales` field in `next.config` file.'),
        name: z.string().describe('Locale name in dropdown.')
      })
    )
    .default([]).describe('Options to configure the language dropdown for [the i18n docs website](/docs/guide/i18n).'),
  lastUpdated: element
    .default(<LastUpdated />)
    .refine(el => el.type !== Fragment && typeof el.type !== 'string', {
      message: `\`Layout#lastUpdated\` must be a \`<LastUpdated />\` component:

\`\`\`js
import { Layout, LastUpdated } from 'nextra-theme-docs'

<Layout
  lastUpdated={<LastUpdated locale="YOUR_LOCALE">YOUR_CONTENT</LastUpdated>}
>
  {children}
</Layout>
\`\`\`
`
    }).describe(`Component to render the last updated info.
@default <LastUpdated />
@remarks \`ReactElement\``),
  navbar: reactNode.describe(
    `Rendered [\`<Navbar>\` component](/docs/docs-theme/built-ins/navbar). E.g. \`<Navbar {...navbarProps} />\`
@remarks \`ReactNode\``
  ),
  navigation: z
    .union([
      z.boolean(),
      z.strictObject({
        next: z.boolean(),
        prev: z.boolean()
      })
    ])
    .default(true)
    .transform(v => (typeof v === 'boolean' ? { next: v, prev: v } : v))
    .describe('Enable or disable navigation link.'),
  nextThemes: z
    .strictObject({
      attribute: z
        .union([attributeSchema, z.array(attributeSchema)])
        .default('class'),
      defaultTheme: z.string().optional(),
      disableTransitionOnChange: z.boolean().default(true),
      forcedTheme: z.string().optional(),
      storageKey: z.string().optional()
    })
    .default({})
    .describe(
      `Configuration for the [next-themes](https://github.com/pacocoursey/next-themes#themeprovider) package.
@default { attribute: "class", defaultTheme: "system", disableTransitionOnChange: true, storageKey: "theme" }
@remarks \`ThemeProviderProps\``
    ),
  pageMap: z.array(z.custom<PageMapItem>())
    .describe(`Page map list. Result of \`getPageMap(route = '/')\` call.
@remarks \`PageMapItem[]\``),
  search: reactNode.default(<Search />).describe(
    `Rendered [\`<Search>\` component](/docs/built-ins/search). E.g. \`<Search {...searchProps} />\`
@default <Search />
@remarks \`ReactNode\``
  ),
  sidebar: z
    .strictObject({
      autoCollapse: z.boolean().optional(),
      defaultMenuCollapseLevel: z.number().min(1).int().default(2),
      defaultOpen: z.boolean().default(true),
      toggleButton: z.boolean().default(true)
    })
    .default({}),
  themeSwitch: z
    .strictObject({
      dark: z.string().default('Dark'),
      light: z.string().default('Light'),
      system: z.string().default('System')
    })
    .default({})
    .describe('Translation of options in the theme switch.'),
  toc: z
    .strictObject({
      backToTop: reactNode
        .default('Scroll to top')
        .describe('@remarks `ReactNode`'),
      extraContent: reactNode.describe('@remarks `ReactNode`'),
      float: z.boolean().default(true),
      title: reactNode.default('On This Page').describe('@remarks `ReactNode`')
    })
    .default({})
})

export type ThemeConfigProps = z.infer<typeof LayoutPropsSchema>

type LayoutProps = z.input<typeof LayoutPropsSchema>

export const Layout: FC<LayoutProps> = ({ children, ...themeConfig }) => {
  const { data, error } = LayoutPropsSchema.safeParse(themeConfig)
  if (error) {
    throw fromZodError(error)
  }
  const { footer, navbar, pageMap, nextThemes, banner, ...rest } = data

  return (
    <ThemeConfigProvider value={rest}>
      <ThemeProvider {...nextThemes}>
        <SkipNavLink />
        {banner}
        <ConfigProvider pageMap={pageMap} navbar={navbar} footer={footer}>
          {/*
           * MobileNav should be in layout and not in mdx wrapper, otherwise for non mdx pages will
           * be not rendered
           */}
          <MobileNav />
          {children}
        </ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
