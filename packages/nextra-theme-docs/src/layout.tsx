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

const feedbackSchema = z.strictObject({
  content: reactNode.default('Question? Give us feedback')
    .describe(`Content of the feedback link.
@remarks \`ReactNode\``),
  labels: z
    .string()
    .default('feedback')
    .describe('Labels that can be added to the new created issue.'),
  link: z.string().optional().describe(`Feedback link URL.

By default, it's a link to the issue creation form of the docs repository, with the current page title prefilled:
[example](https://github.com/shuding/nextra/issues/new?title=Feedback%20for%20%E2%80%9CTheme%20Configuration%E2%80%9D&labels=feedback).`)
})

const nextThemesSchema = z.strictObject({
  attribute: z
    .union([attributeSchema, z.array(attributeSchema)])
    .default('class'),
  defaultTheme: z.string().optional(),
  disableTransitionOnChange: z.boolean().default(true),
  forcedTheme: z.string().optional(),
  storageKey: z.string().optional()
})

const sidebarSchema = z.strictObject({
  autoCollapse: z
    .boolean()
    .optional()
    .describe(
      'If true, automatically collapse inactive folders above `defaultMenuCollapseLevel`.'
    ),
  defaultMenuCollapseLevel: z
    .number()
    .int()
    .min(1)
    .default(2)
    .describe(
      'Specifies the folder level at which the menu on the left is collapsed by default.'
    ),
  defaultOpen: z
    .boolean()
    .default(true)
    .describe('Hide/show sidebar by default.'),
  toggleButton: z
    .boolean()
    .default(true)
    .describe('Hide/show sidebar toggle button.')
})

const themeSwitchSchema = z.strictObject({
  dark: z.string().default('Dark'),
  light: z.string().default('Light'),
  system: z.string().default('System')
})

const tocSchema = z.strictObject({
  backToTop: reactNode
    .default('Scroll to top')
    .describe('Text of back to top button.\n@remarks `ReactNode`'),
  extraContent: reactNode.describe(
    'Display extra content below the TOC content.\n@remarks `ReactNode`'
  ),
  float: z
    .boolean()
    .default(true)
    .describe('Float the TOC next to the content.'),
  title: reactNode
    .default('On This Page')
    .describe('Title of the TOC sidebar.\n@remarks `ReactNode`')
})

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
  feedback: feedbackSchema.default(feedbackSchema.parse({})),
  footer: reactNode.describe(
    `Rendered [\`<Footer>\` component](/docs/docs-theme/built-ins/footer). E.g. \`<Footer {...footerProps} />\`
@remarks \`ReactNode\``
  ),
  i18n: z
    .array(
      z.strictObject({
        locale: z
          .string()
          .describe('Locale from `i18n.locales` field in `next.config` file.'),
        name: z.string().describe('Locale name in dropdown.')
      })
    )
    .default([])
    .describe(
      'Options to configure the language dropdown for [the i18n docs website](/docs/guide/i18n).'
    ),
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
    }).describe(`Component to render the last updated info.
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
    .describe(`Enable or disable navigation link.
@default true`),
  nextThemes: nextThemesSchema.default(nextThemesSchema.parse({})).describe(
    `Configuration for the [next-themes](https://github.com/pacocoursey/next-themes#themeprovider) package.
@default { attribute: "class", defaultTheme: "system", disableTransitionOnChange: true, storageKey: "theme" }
@remarks \`ThemeProviderProps\``
  ),
  pageMap: z.array(z.custom<PageMapItem>())
    .describe(`Page map list. Result of \`getPageMap(route = '/')\` call.
@remarks \`PageMapItem[]\``),
  search: reactNode.default(<Search />).describe(
    `Rendered [\`<Search>\` component](/docs/built-ins/search). E.g. \`<Search {...searchProps} />\`
@remarks \`ReactNode\``
  ),
  sidebar: sidebarSchema.default(sidebarSchema.parse({})),
  themeSwitch: themeSwitchSchema.default(themeSwitchSchema.parse({}))
    .describe(`Translation of options in the theme switch.
@default { dark: "Dark", light: "Light", system: "System" }`),
  toc: tocSchema.default(tocSchema.parse({}))
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
