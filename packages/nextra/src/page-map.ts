import { PageMapItem, PageMapResult } from './types'
import gracefulFs from 'graceful-fs'
import {
  getLocaleFromFilename,
  parseJsonFile,
  removeExtension,
  existsSync
} from './utils'
import path from 'path'
import slash from 'slash'
import grayMatter from 'gray-matter'
import filterRouteLocale from './filter-route-locale'
const extension = /\.mdx?$/
const metaExtension = /meta\.?([a-zA-Z-]+)?\.json/

export function findPagesDir(dir: string = process.cwd()): string {
  // prioritize ./pages over ./src/pages
  if (existsSync(path.join(dir, 'pages'))) return 'pages'
  if (existsSync(path.join(dir, 'src/pages'))) return 'src/pages'

  throw new Error(
    "> Couldn't find a `pages` directory. Please create one under the project root"
  )
}

const { promises: fs } = gracefulFs

export async function collectFiles(
  dir: string,
  route: string = '/',
  fileMap: Record<string, any> = {}
): Promise<{ items: PageMapItem[]; fileMap: Record<string, any> }> {
  const files = await fs.readdir(dir, { withFileTypes: true })

  const items = (
    await Promise.all(
      files.map(async f => {
        const filePath = path.resolve(dir, f.name)
        const fileRoute = slash(
          path.join(route, removeExtension(f.name).replace(/^index$/, ''))
        )

        if (f.isDirectory()) {
          if (fileRoute === '/api') return null
          const { items: children } = await collectFiles(
            filePath,
            fileRoute,
            fileMap
          )
          if (!children || !children.length) return null
          return {
            name: f.name,
            children,
            route: fileRoute
          }
        } else if (extension.test(f.name)) {
          const locale = getLocaleFromFilename(f.name)
          const fileContents = await fs.readFile(filePath, 'utf-8')
          const { data } = grayMatter(fileContents)
          if (Object.keys(data).length) {
            fileMap[filePath] = {
              name: removeExtension(f.name),
              route: fileRoute,
              frontMatter: data,
              locale
            }
            return fileMap[filePath]
          }
          fileMap[filePath] = {
            name: removeExtension(f.name),
            route: fileRoute,
            locale
          }
          return fileMap[filePath]
        } else if (metaExtension.test(f.name)) {
          const content = await fs.readFile(filePath, 'utf-8')
          const meta = parseJsonFile(content, filePath)
          // @ts-expect-error since metaExtension.test(f.name) === true
          const locale = f.name.match(metaExtension)[1]
          fileMap[filePath] = {
            name: 'meta.json',
            meta,
            locale
          }
          return fileMap[filePath]
        }
      })
    )
  ).filter(Boolean)

  return {
    items,
    fileMap
  }
}

export async function filterFileLocale(
  currentResourcePath: string,
  pageMaps: PageMapItem[],
  fileMap: Record<string, PageMapItem>,
  defaultLocale: string
) {
  const activeRouteLocale = getLocaleFromFilename(currentResourcePath)
  const pageItem = fileMap[currentResourcePath]
  const metaName = path.dirname(currentResourcePath)
  const pageMeta =
    fileMap[`${metaName}/meta.${activeRouteLocale}.json`]?.meta?.[pageItem.name]
  const title =
    (typeof pageMeta === 'string' ? pageMeta : pageMeta?.title) || pageItem.name
  if (activeRouteLocale) {
    return [
      filterRouteLocale(pageMaps, activeRouteLocale, defaultLocale),
      fileMap[currentResourcePath].route,
      title
    ]
  }
  return [pageMaps, fileMap[currentResourcePath].route, title]
}

export async function getPageMap(
  currentResourcePath: string,
  locales: string[],
  defaultLocale: string,
  pageMapdir = findPagesDir()
): Promise<PageMapResult> {
  const activeRouteLocale = getLocaleFromFilename(currentResourcePath)
  let activeRoute = ''
  let activeRouteTitle: string = ''

  async function getFiles(dir: string, route: string): Promise<PageMapItem[]> {
    const files = await fs.readdir(dir, { withFileTypes: true })
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

            const fileContents = await fs.readFile(filePath, 'utf-8')
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
            const content = await fs.readFile(filePath, 'utf-8')
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
  let pageMaps = await getFiles(path.join(process.cwd(), pageMapdir), '/')
  if (activeRouteLocale) {
    pageMaps = filterRouteLocale(pageMaps, activeRouteLocale, defaultLocale)
  }
  return [pageMaps, activeRoute, activeRouteTitle]
}
