import { fc, reactNode } from 'nextra/schemas'
import type { FC, ReactNode } from 'react'
import { z } from 'zod'
import type { NavBarProps } from './components/navbar'
import type { TOCProps } from './components/toc'

const i18nSchema = /* @__PURE__ */ (() =>
  z.array(
    z.strictObject({
      direction: z.enum(['ltr', 'rtl']).optional(),
      locale: z.string(),
      name: z.string()
    })
  ))()

export const themeOptionsSchema = /* @__PURE__ */ (() =>
  z.strictObject({
    light: z.string(),
    dark: z.string(),
    system: z.string()
  }))()

export const themeSchema = /* @__PURE__ */ (() =>
  z.strictObject({
    banner: z.strictObject({
      content: z.custom<ReactNode | FC>(...reactNode).optional(),
      dismissible: z.boolean(),
      key: z.string()
    }),
    backgroundColor: z.strictObject({
      dark: z.string(),
      light: z.string()
    }),
    chat: z.strictObject({
      icon: z.custom<ReactNode | FC>(...reactNode),
      link: z.string().startsWith('https://').optional()
    }),
    components: z.record(z.custom<FC>(...fc)).optional(),
    darkMode: z.boolean(),
    direction: z.enum(['ltr', 'rtl']),
    docsRepositoryBase: z.string().startsWith('https://'),
    editLink: z.strictObject({
      component: z
        .custom<
          FC<{
            children: ReactNode
            className?: string
            filePath?: string
          }>
        >(...fc)
        .or(z.null()),
      content: z.custom<ReactNode | FC>(...reactNode)
    }),
    faviconGlyph: z.string().optional(),
    feedback: z.strictObject({
      content: z.custom<ReactNode | FC>(...reactNode),
      labels: z.string(),
      useLink: z.function().returns(z.string())
    }),
    footer: z.strictObject({
      component: z.custom<ReactNode | FC<{ menu: boolean }>>(...reactNode),
      content: z.custom<ReactNode | FC>(...reactNode)
    }),
    gitTimestamp: z.custom<ReactNode | FC<{ timestamp: Date }>>(...reactNode),
    head: z.custom<ReactNode | FC>(...reactNode),
    i18n: i18nSchema,
    logo: z.custom<ReactNode | FC>(...reactNode),
    logoLink: z.boolean().or(z.string()),
    main: z.custom<FC<{ children: ReactNode }>>(...fc).optional(),
    navbar: z.strictObject({
      component: z.custom<ReactNode | FC<NavBarProps>>(...reactNode),
      extraContent: z.custom<ReactNode | FC>(...reactNode).optional()
    }),
    navigation: z.boolean().or(
      z.strictObject({
        next: z.boolean(),
        prev: z.boolean()
      })
    ),
    nextThemes: z.strictObject({
      defaultTheme: z.string(),
      forcedTheme: z.string().optional(),
      storageKey: z.string()
    }),
    notFound: z.strictObject({
      content: z.custom<ReactNode | FC>(...reactNode),
      labels: z.string()
    }),
    color: z.strictObject({
      hue: z.number().or(
        z.strictObject({
          dark: z.number(),
          light: z.number()
        })
      ),
      saturation: z.number().or(
        z.strictObject({
          dark: z.number(),
          light: z.number()
        })
      )
    }),
    project: z.strictObject({
      icon: z.custom<ReactNode | FC>(...reactNode),
      link: z.string().startsWith('https://').optional()
    }),
    search: z.strictObject({
      component: z.custom<ReactNode | FC<{ className?: string }>>(...reactNode),
      emptyResult: z.custom<ReactNode | FC>(...reactNode),
      error: z.string().or(z.function().returns(z.string())),
      loading: z.custom<ReactNode | FC>(...reactNode),
      // Can't be React component
      placeholder: z.string().or(z.function().returns(z.string()))
    }),
    sidebar: z.strictObject({
      autoCollapse: z.boolean().optional(),
      defaultMenuCollapseLevel: z.number().min(1).int(),
      toggleButton: z.boolean()
    }),
    themeSwitch: z.strictObject({
      component: z.custom<
        ReactNode | FC<{ lite?: boolean; className?: string }>
      >(...reactNode),
      useOptions: themeOptionsSchema.or(
        z.function().returns(themeOptionsSchema)
      )
    }),
    toc: z.strictObject({
      backToTop: z.boolean(),
      component: z.custom<ReactNode | FC<TOCProps>>(...reactNode),
      extraContent: z.custom<ReactNode | FC>(...reactNode),
      float: z.boolean(),
      title: z.custom<ReactNode | FC>(...reactNode)
    })
  }))()

export const publicThemeSchema = /* @__PURE__ */ (() =>
  themeSchema.deepPartial().extend({
    // to have `locale` and `text` as required properties
    i18n: i18nSchema.optional()
  }))()
