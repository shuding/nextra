import path from 'path'
import gracefulFs from 'graceful-fs'
import { promisify } from 'util'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'

import filterRouteLocale from './filter-route-locale'
import { addPage } from './content-dump'
import {
  existsSync,
  getLocaleFromFilename,
  removeExtension,
  parseJsonFile
} from './utils'
import { compileMdx } from './compile'
import type { LoaderOptions, PageMapItem, PageMapResult } from './types'

const fs = gracefulFs
const extension = /\.mdx?$/
const metaExtension = /meta\.?([a-zA-Z-]+)?\.json/
const isProductionBuild = process.env.NODE_ENV === 'production'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set()

function findPagesDir(dir: string = process.cwd()): string {
  // prioritize ./pages over ./src/pages
  if (existsSync(path.join(dir, 'pages'))) return 'pages'
  if (existsSync(path.join(dir, 'src/pages'))) return 'src/pages'

  throw new Error(
    "> Couldn't find a `pages` directory. Please create one under the project root"
  )
}

const pagesDir = findPagesDir()

async function getPageMap(currentResourcePath: string): Promise<PageMapResult> {
  const activeRouteLocale = getLocaleFromFilename(currentResourcePath)
  let activeRoute = ''
  let activeRouteTitle: string = ''

  async function getFiles(dir: string, route: string): Promise<PageMapItem[]> {
    const files = await promisify(fs.readdir)(dir, { withFileTypes: true })
    let dirMeta: Record<
      string,
      string | { [key: string]: string; title: string }
    > = {}

    // go through the directory
    const items = (
      await Promise.all(
        files.map(async f => {
          const filePath = path.resolve(dir, f.name)
          const fileRoute = slash(
            path.join(route, removeExtension(f.name).replace(/^index$/, ''))
          )

          if (f.isDirectory()) {
            if (fileRoute === '/api') return null

            const children = await getFiles(filePath, fileRoute)
            if (!children || !children.length) return null

            return {
              name: f.name,
              children,
              route: fileRoute
            }
          } else if (extension.test(f.name)) {
            // MDX or MD

            const locale = getLocaleFromFilename(f.name)

            if (filePath === currentResourcePath) {
              activeRoute = fileRoute
            }

            const fileContents = await promisify(fs.readFile)(filePath, 'utf-8')
            const { data } = grayMatter(fileContents)

            if (Object.keys(data).length) {
              return {
                name: removeExtension(f.name),
                route: fileRoute,
                frontMatter: data,
                locale
              }
            }

            return {
              name: removeExtension(f.name),
              route: fileRoute,
              locale
            }
          } else if (metaExtension.test(f.name)) {
            const content = await promisify(fs.readFile)(filePath, 'utf-8')
            const meta = parseJsonFile(content, filePath)
            // @ts-expect-error since metaExtension.test(f.name) === true
            const locale = f.name.match(metaExtension)[1]

            if (!activeRouteLocale || locale === activeRouteLocale) {
              dirMeta = meta
            }

            return {
              name: 'meta.json',
              meta,
              locale
            }
          }
        })
      )
    )
      .map(item => {
        if (!item) return
        if (item.route === activeRoute) {
          const metadata = dirMeta[item.name]
          activeRouteTitle =
            (typeof metadata === 'string' ? metadata : metadata?.title) ||
            item.name
        }
        return { ...item }
      })
      .filter(Boolean)

    // @ts-expect-error since filter remove all the null and undefined item
    return items
  }

  return [
    await getFiles(path.join(process.cwd(), pagesDir), '/'),
    activeRoute,
    activeRouteTitle
  ]
}

export default async function (
  this: LoaderContext<LoaderOptions>,
  source: string
) {
  const callback = this.async()
  this.cacheable(true)

  if (!isProductionBuild) {
    // Add the entire directory `pages` as the dependency
    // so we can generate the correct page map
    this.addContextDependency(path.resolve(pagesDir))
  }

  const options = this.getOptions()
  let {
    theme,
    themeConfig,
    locales,
    defaultLocale,
    unstable_contentDump,
    unstable_staticImage,
    mdxOptions
  } = options

  const { resourcePath } = this
  const filename = resourcePath.slice(resourcePath.lastIndexOf('/') + 1)
  const fileLocale = getLocaleFromFilename(filename) || 'default'

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }

  // Generate the page map
  let [pageMap, route, title] = await getPageMap(resourcePath)

  if (locales) {
    const locale = getLocaleFromFilename(filename)
    if (locale) {
      pageMap = filterRouteLocale(pageMap, locale, defaultLocale)
    }
  }

  // Extract frontMatter information if it exists
  let { data, content } = grayMatter(source)

  let layout = theme
  let layoutConfig = themeConfig || null

  // Relative path instead of a package name
  if (theme.startsWith('.') || theme.startsWith('/')) {
    layout = path.resolve(theme)
  }
  if (layoutConfig) {
    layoutConfig = slash(path.resolve(layoutConfig))
  }

  if (isProductionBuild && indexContentEmitted.has(filename)) {
    unstable_contentDump = false
  }

  const { result, titleText, headings, hasH1, structurizedData } =
    await compileMdx(content, mdxOptions, {
      unstable_staticImage,
      unstable_contentDump
    })
  content = result
  content = content.replace('export default MDXContent;', '')

  if (unstable_contentDump) {
    // We only add .MD and .MDX contents
    if (extension.test(filename)) {
      await addPage({
        fileLocale,
        route,
        title,
        data,
        structurizedData
      })
    }

    indexContentEmitted.add(filename)
  }

  const prefix = `import withLayout from '${layout}'
import { withSSG } from 'nextra/ssg'
${layoutConfig ? `import layoutConfig from '${layoutConfig}'` : ''}`

  const suffix = `export default function NextraPage (props) {
    return withSSG(withLayout({
      filename: "${slash(filename)}",
      route: "${slash(route)}",
      meta: ${JSON.stringify(data)},
      pageMap: ${JSON.stringify(pageMap)},
      titleText: ${JSON.stringify(titleText)},
      headings: ${JSON.stringify(headings)},
      hasH1: ${JSON.stringify(hasH1)}
    }, ${layoutConfig ? 'layoutConfig' : 'null'}))({
      ...props,
      MDXContent,
      children: <MDXContent/>
    })
}`

  // Add imports and exports to the source
  return callback(null, prefix + '\n\n' + content + '\n\n' + suffix)
}
