import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import 'focus-visible'
import { SkipNavContent } from '@reach/skip-nav'
import { ThemeProvider } from 'next-themes'
import innerText from 'react-innertext'
import cn from 'classnames'

import flatten from './utils/flatten'
import cleanupAndReorder from './utils/cleanup-and-reorder'

import Head from './head'
import Navbar from './navbar'
import Footer from './footer'
import Theme from './misc/theme'
import DocsSidebar from './docs-sidebar'
import { ActiveAnchor } from './misc/active-anchor'
import defaultConfig from './misc/default.config'
import { getFSRoute } from './utils/get-fs-route'

const titleType = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

function useDirectoryInfo(pageMap) {
  const { locale, defaultLocale, asPath } = useRouter()

  return useMemo(() => {
    const fsPath = getFSRoute(asPath, locale).split('#')[0]
    const directories = cleanupAndReorder(pageMap, locale, defaultLocale)
    const flatDirectories = flatten(directories)
    const currentIndex = flatDirectories.findIndex(dir => dir.route === fsPath)
    const layoutType = flatDirectories[currentIndex].type || 'docs'

    return {
      directories,
      flatDirectories,
      currentIndex,
      layoutType
    }
  }, [pageMap, locale, defaultLocale, asPath])
}

const Layout = ({ filename, config: _config, pageMap, meta, children }) => {
  const { route, locale } = useRouter()
  const config = Object.assign({}, defaultConfig, _config)
  const {
    directories,
    flatDirectories,
    currentIndex,
    layoutType
  } = useDirectoryInfo(pageMap)

  console.log(layoutType)

  const filepath = route.slice(0, route.lastIndexOf('/') + 1)
  const filepathWithName = filepath + filename
  const titles = React.Children.toArray(children).filter(
    child => child.props && titleType.includes(child.props.mdxType)
  )
  const titleEl = titles.find(
    child => child.props && child.props.mdxType === 'h1'
  )
  const title =
    meta.title || (titleEl ? innerText(titleEl.props.children) : 'Untitled')
  const anchors = titles
    .filter(child => child.props && child.props.mdxType === 'h2')
    .map(child => child.props.children)

  const isRTL = useMemo(() => {
    if (!config.i18n) return config.direction === 'rtl' || null
    const localeConfig = config.i18n.find(l => l.locale === locale)
    return localeConfig && localeConfig.direction === 'rtl'
  }, [config.i18n, locale])

  return (
    <React.Fragment>
      <Head config={config} title={title} locale={locale} />
      <div
        className={cn('nextra-container main-container flex flex-col', {
          rtl: isRTL
        })}
      >
        <Navbar config={config} locale={locale} isRTL={isRTL} />
        <ActiveAnchor>
          <div className="flex flex-1 h-full">
            <DocsSidebar
              config={config}
              directories={directories}
              anchors={anchors}
            />
            <SkipNavContent />
            {meta.full ? (
              <article className="relative pt-16 w-full overflow-x-hidden">
                {children}
              </article>
            ) : (
              <article className="docs-container relative pt-20 pb-16 px-6 md:px-8 w-full max-w-full overflow-x-hidden">
                <main className="max-w-screen-md mx-auto">
                  <Theme>{children}</Theme>
                  <Footer
                    config={config}
                    flatDirectories={flatDirectories}
                    currentIndex={currentIndex}
                    filepathWithName={filepathWithName}
                    isRTL={isRTL}
                  />
                </main>
              </article>
            )}
          </div>
        </ActiveAnchor>
      </div>
    </React.Fragment>
  )
}

export default (opts, config) => props => {
  return (
    <ThemeProvider attribute="class">
      <Layout config={config} {...opts} {...props} />
    </ThemeProvider>
  )
}
