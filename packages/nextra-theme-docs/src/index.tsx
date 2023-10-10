import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import 'focus-visible'
import { useRouter } from 'nextra/hooks'
import { MDXProvider } from 'nextra/mdx'
import './polyfill'
import { useEffect } from 'react'
import { Banner, Head } from './components'
import { PartialDocsThemeConfig } from './constants'
import { ActiveAnchorProvider, ConfigProvider, useConfig } from './contexts'
import { getComponents } from './mdx-components'
import { useThemeConfigStore } from './stores'
import { renderComponent } from './utils'

function InnerLayout({ children }: { children: ReactNode }): ReactElement {
  const config = useConfig()
  const { locale } = useRouter()

  const { direction } = config.i18n.find(l => l.locale === locale) || config
  const dir = direction === 'rtl' ? 'rtl' : 'ltr'

  const { activeThemeContext: themeContext, topLevelNavbarItems } =
    config.normalizePagesResult

  const components = getComponents({
    isRawLayout: themeContext.layout === 'raw',
    components: config.components
  })

  return (
    // This makes sure that selectors like `[dir=ltr] .nextra-container` work
    // before hydration as Tailwind expects the `dir` attribute to exist on the
    // `html` element.
    <div dir={dir}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${dir}')`
        }}
      />
      <Head />
      <Banner />
      {themeContext.navbar &&
        renderComponent(config.navbar.component, {
          items: topLevelNavbarItems
        })}
      <ActiveAnchorProvider>
        <MDXProvider disableParentContext components={components}>
          {children}
        </MDXProvider>
      </ActiveAnchorProvider>
      {themeContext.footer &&
        renderComponent(config.footer.component, { menu: config.hideSidebar })}
    </div>
  )
}

export default function Layout({
  children,
  ...context
}: NextraThemeLayoutProps): ReactElement {
  const { setThemeConfig } = useThemeConfigStore()

  useEffect(() => {
    setThemeConfig(context.themeConfig)
  }, [context.themeConfig, setThemeConfig])

  return (
    <ConfigProvider value={context}>
      <InnerLayout>{children}</InnerLayout>
    </ConfigProvider>
  )
}

export { useConfig, PartialDocsThemeConfig as DocsThemeConfig }
export { useTheme } from 'next-themes'
export { Link } from './mdx-components'
export {
  Bleed,
  Collapse,
  NotFoundPage,
  Navbar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch,
  LocaleSwitch
} from './components'
