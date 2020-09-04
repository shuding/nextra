import React, { useState, useEffect, useMemo, useContext, createContext } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import slugify from '@sindresorhus/slugify'
import getTitle from 'title'
import 'focus-visible'

import Theme from './theme'
import Search from './search'
import GitHubIcon from './github-icon'
import ArrowRight from './arrow-right'

import getConfig from './config'

const config = getConfig()
const TreeState = new Map()
const titleType = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const MenuContext = createContext(false)

const flatten = (list) => {
  return list.reduce((flat, toFlatten) => {
    return flat.concat(
      toFlatten.children ? flatten(toFlatten.children) : toFlatten
    )
  }, [])
}

const reorderBasedOnMeta = (list) => {
  let meta = list.find(item => item.name === 'meta.json')
  if (!meta) {
    meta = {}
  } else {
    meta = meta.meta
  }

  const metaKeys = Object.keys(meta)

  return list.filter(a => {
    return a.name !== 'meta.json' && a.name !== '_app'
  }).sort((a, b) => {
    return metaKeys.indexOf(a.name) - metaKeys.indexOf(b.name)
  }).map(a => {
    return {
      ...a,
      children: a.children ? reorderBasedOnMeta(a.children) : undefined,
      title: meta[a.name] || getTitle(a.name)
    }
  })
}

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
          display: open ? '' : 'none',
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
  if (anchors?.length) {
    if (active) {
      return (
        <li className={active ? 'active' : ''}>
          <Link href={item.route}>
            <a>{title}</a>
          </Link>
          <ul>
            {anchors.map((anchor) => {
              const slug = slugify(anchor || '')
              return (
                <a
                  href={'#' + slug}
                  key={`a-${slug}`}
                  onClick={() => setMenu(false)}
                >
                  <span className="flex">
                    <span className="mr-2 opacity-25">#</span>
                    <span className="inline-block">{anchor}</span>
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
      className={`h-screen bg-white flex-shrink-0 w-full md:w-64 md:border-r md:block fixed md:sticky z-10 ${
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

const NextLink = ({ flatDirectories, currentIndex }) => {
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

const PrevLink = ({ flatDirectories, currentIndex }) => {
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

const Layout = ({ filename, meta, pageMap, children }) => {
  const [menu, setMenu] = useState(false)
  const router = useRouter()
  const { route, pathname } = router

  const directories = useMemo(() => reorderBasedOnMeta(pageMap), [pageMap])
  const flatDirectories = useMemo(() => flatten(directories), [directories])

  const filepath = route.slice(0, route.lastIndexOf('/') + 1)
  const titles = React.Children.toArray(children).filter((child) =>
    titleType.includes(child.props.mdxType)
  )
  const title =
    titles.find((child) => child.props.mdxType === 'h1')?.props.children ||
    'Untitled'
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

  const props = {
    filepath: filepath + filename,
    route
  }

  return (
    <>
      <Head>
        <title>
          {title}
          {config.titleSuffix || ''}
        </title>
        {config.head ? config.head(props) : null}
      </Head>
      <div className="main-container flex flex-col">
        <nav className="flex items-center bg-white z-20 fixed top-0 left-0 right-0 h-16 border-b px-6">
          <div className="hidden md:block w-full flex items-center">
            <Link href="/">
              <a className="no-underline text-current inline-flex items-center hover:opacity-75">
                {config.logo}
              </a>
            </Link>
          </div>

          {config.search && <Search directories={flatDirectories} />}

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
          <content className="relative pt-20 pb-16 px-6 md:px-8 w-full max-w-full overflow-x-hidden">
            <main className="max-w-screen-md">
              <Theme>{children}</Theme>
              <footer className="mt-24">
                <nav className="flex flex-row items-center justify-between">
                  <div>
                    <PrevLink flatDirectories={flatDirectories} currentIndex={currentIndex} />
                  </div>

                  <div>
                    <NextLink flatDirectories={flatDirectories} currentIndex={currentIndex} />
                  </div>
                </nav>

                <hr />

                {config.footer ? config.footer(props) : null}
              </footer>
            </main>
          </content>
        </div>
      </div>
    </>
  )
}

export default opts => props => <Layout {...opts} {...props}/>
