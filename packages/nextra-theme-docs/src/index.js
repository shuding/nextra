import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import slugify from '@sindresorhus/slugify'
import 'focus-visible'
import { SkipNavContent } from '@reach/skip-nav'
import { ThemeProvider } from 'next-themes'
import innerText from 'react-innertext'

import flatten from './utils/flatten'
import reorderBasedOnMeta from './utils/reorder'

import Search from './search'
import GitHubIcon from './github-icon'
import ArrowRight from './arrow-right'
import ThemeSwitch from './theme-switch'

import Theme from './misc/theme'
import defaultConfig from './misc/default.config'

const TreeState = new Map()
const titleType = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const MenuContext = createContext(false)

function Folder({ item, anchors }) {
  const route = useRouter().route + '/'
  const active = route.startsWith(item.route + '/')
  const open = TreeState[item.route] ?? true
  const [_, render] = useState(false)

  useEffect(() => {
    if (active) {
      TreeState[item.route] = true
    }
  }, [active])

  return (
    <li className={open ? 'active' : ''}>
      <button
        onClick={() => {
          if (active) return
          TreeState[item.route] = !open
          render((x) => !x)
        }}
      >
        {item.title}
      </button>
      <div
        style={{
          display: open ? undefined : 'none',
        }}
      >
        <Menu dir={item.children} base={item.route} anchors={anchors} />
      </div>
    </li>
  )
}

function File({ item, anchors }) {
  const { setMenu } = useContext(MenuContext)
  const route = useRouter().route + '/'
  const active = route.startsWith(item.route + '/')

  const title = item.title
  // if (item.title.startsWith('> ')) {
  // title = title.substr(2)
  if (anchors && anchors.length) {
    if (active) {
      return (
        <li className={active ? 'active' : ''}>
          <Link href={item.route}>
            <a>{title}</a>
          </Link>
          <ul>
            {anchors.map((anchor) => {
              const anchorText = innerText(anchor) || ''
              const slug = slugify(anchorText)

              return (
                <a
                  href={'#' + slug}
                  key={`a-${slug}`}
                  onClick={() => setMenu(false)}
                >
                  <span className="flex">
                    <span className="mr-2 opacity-25">#</span>
                    <span className="inline-block">{anchorText}</span>
                  </span>
                </a>
              )
            })}
          </ul>
        </li>
      )
    }
  }

  return (
    <li className={active ? 'active' : ''}>
      <Link href={item.route}>
        <a onClick={() => setMenu(false)}>{title}</a>
      </Link>
    </li>
  )
}

function Menu({ dir, anchors }) {
  return (
    <ul>
      {dir.map((item) => {
        if (item.children) {
          return <Folder key={item.name} item={item} anchors={anchors} />
        }
        return <File key={item.name} item={item} anchors={anchors} />
      })}
    </ul>
  )
}

function Sidebar({ show, directories, anchors }) {
  return (
    <aside
      className={`h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:border-r dark:border-gray-800 md:block fixed md:sticky z-10 transition-colors duration-200 ${
        show ? '' : 'hidden'
      }`}
      style={{
        top: '4rem',
        height: 'calc(100vh - 4rem)',
      }}
    >
      <div className="sidebar w-full p-4 pb-40 md:pb-16 h-full overflow-y-auto">
        <Menu dir={directories} anchors={anchors} />
      </div>
    </aside>
  )
}

const NextLink = ({ config, flatDirectories, currentIndex }) => {
  let next = flatDirectories[currentIndex + 1]

  if (!config.nextLinks || !next) {
    return null
  }

  return (
    <Link href={next.route}>
      <a className="text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center ml-2">
        {next.title}
        <ArrowRight className="inline ml-1 flex-shrink-0" />
      </a>
    </Link>
  )
}

const PrevLink = ({ config, flatDirectories, currentIndex }) => {
  let prev = flatDirectories[currentIndex - 1]

  if (!config.prevLinks || !prev) {
    return null
  }

  return (
    <Link href={prev.route}>
      <a className="text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center mr-2">
        <ArrowRight className="transform rotate-180 inline mr-1 flex-shrink-0" />
        {prev.title}
      </a>
    </Link>
  )
}

const Layout = ({ filename, config: _config, pageMap, meta, children }) => {
  const [menu, setMenu] = useState(false)
  const router = useRouter()
  const { route, pathname } = router

  const directories = useMemo(() => reorderBasedOnMeta(pageMap), [pageMap])
  const flatDirectories = useMemo(() => flatten(directories), [directories])
  const config = Object.assign({}, defaultConfig, _config)

  const filepath = route.slice(0, route.lastIndexOf('/') + 1)
  const filepathWithName = filepath + filename
  const titles = React.Children.toArray(children).filter((child) =>
    titleType.includes(child.props.mdxType)
  )
  const titleEl =
    titles.find((child) => child.props.mdxType === 'h1')
  const title = meta.title || (titleEl ? innerText(titleEl.props.children) : 'Untitled')
  const anchors = titles
    .filter((child) => child.props.mdxType === 'h2')
    .map((child) => child.props.children)

  useEffect(() => {
    if (menu) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [menu])

  const currentIndex = useMemo(() => flatDirectories.findIndex(
    (dir) => dir.route === pathname
  ), [flatDirectories, pathname])

  return (
    <React.Fragment>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <title>
          {title}
          {config.titleSuffix || ''}
        </title>
        {config.head || null}
      </Head>
      <div className="main-container flex flex-col">
        <nav className="flex items-center bg-white z-20 fixed top-0 left-0 right-0 h-16 border-b px-6 dark:bg-dark dark:border-gray-800 transition-colors duration-200">
          <div className="hidden md:block w-full flex items-center">
            <Link href="/">
              <a className="no-underline text-current inline-flex items-center hover:opacity-75">
                {config.logo}
              </a>
            </Link>
          </div>

          {config.customSearch || (config.search ? <Search directories={flatDirectories} /> : null)}

          {config.darkMode ? <ThemeSwitch /> : null}

          {config.github ? (
            <a
              className="text-current p-2 -mr-2"
              href={config.github}
              target="_blank"
            >
              <GitHubIcon height={28} />
            </a>
          ) : null}

          <button
            className="block md:hidden p-2 -mr-2 ml-2"
            onClick={() => setMenu(!menu)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </nav>
        <div className="flex flex-1 h-full">
          <MenuContext.Provider value={{ setMenu }}>
            <Sidebar show={menu} anchors={anchors} directories={directories} />
          </MenuContext.Provider>
          <SkipNavContent />
          {meta.full ? (
            <content className="relative pt-16 w-full overflow-x-hidden">
              {children}
            </content>
          ) : (
            <content className="relative pt-20 pb-16 px-6 md:px-8 w-full max-w-full overflow-x-hidden xl:pr-64">
              <main className="max-w-screen-md mx-auto">
                <Theme>{children}</Theme>
                <footer className="mt-24">
                  <nav className="flex flex-row items-center justify-between">
                    <div>
                      <PrevLink config={config} flatDirectories={flatDirectories} currentIndex={currentIndex} />
                    </div>

                    <div>
                      <NextLink config={config} flatDirectories={flatDirectories} currentIndex={currentIndex} />
                    </div>
                  </nav>

                  <hr />

                  {config.footer ? <div className="mt-24 flex justify-between flex-col-reverse md:flex-row items-center md:items-end">
                    <span className="text-gray-600">
                      {config.footerText}
                    </span>
                    <div className="mt-6"/>
                    {config.footerEditOnGitHubLink ? <a className="text-sm" href={
                      (config.siteGithub || config.github) + '/edit/master/pages' + filepathWithName
                    } target="_blank">Edit this page on GitHub</a> : null}
                  </div> : null}
                </footer>
              </main>
            </content>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default (opts, config) => props => {
  return (
    <ThemeProvider attribute="class">
      <Layout config={config} {...opts} {...props}/>
    </ThemeProvider>
  )
}
