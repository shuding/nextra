import type { LoaderOptions } from './types'

import path from 'path'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'
import { addPage } from './content-dump'
import { getLocaleFromFilename } from './utils'
import { compileMdx } from './compile'
import { getPageMap, findPagesDir } from './page-map'
import { collectFiles } from './plugin'
const extension = /\.mdx?$/
const isProductionBuild = process.env.NODE_ENV === 'production'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set()

const pagesDir = path.resolve(findPagesDir())

export default async function (
  this: LoaderContext<LoaderOptions>,
  source: string,
  callback: (err?: null | Error, content?: string | Buffer) => void
) {
  this.cacheable(true)

  const options = this.getOptions()
  let {
    theme,
    themeConfig,
    defaultLocale,
    unstable_flexsearch,
    unstable_staticImage,
    mdxOptions,
    pageMapCache
  } = options

  const { resourcePath } = this
  const filename = resourcePath.slice(resourcePath.lastIndexOf('/') + 1)
  const fileLocale = getLocaleFromFilename(filename)

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }

  let pageMapResult, fileMap
  if (isProductionBuild) {
    const data = pageMapCache.get()!
    pageMapResult = data.items
    fileMap = data.fileMap
  } else {
    const data = await collectFiles(pagesDir, '/')
    pageMapResult = data.items
    fileMap = data.fileMap
  }
  const [pageMap, route, title] = getPageMap(
    resourcePath,
    pageMapResult,
    fileMap,
    defaultLocale
  )

  if (!isProductionBuild) {
    // Add the entire directory `pages` as the dependency
    // so we can generate the correct page map.
    this.addContextDependency(pagesDir)
  } else {
    // We only add meta files as dependencies for prodution build,
    // so we can do incremental builds.
    Object.entries(fileMap).forEach(([filePath, { name, meta, locale }]) => {
      if (
        name === 'meta.json' &&
        meta &&
        (!fileLocale || locale === fileLocale)
      ) {
        this.addDependency(filePath)
      }
    })
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
    unstable_flexsearch = false
  }

  const { result, titleText, headings, hasH1, structurizedData } =
    await compileMdx(content, mdxOptions, {
      unstable_staticImage,
      unstable_flexsearch
    })
  content = result
  content = content.replace('export default MDXContent;', '')

  if (unstable_flexsearch) {
    // We only add .MD and .MDX contents
    if (extension.test(filename) && data.searchable !== false) {
      await addPage({
        fileLocale: fileLocale || 'default',
        route,
        title,
        data,
        structurizedData
      })
    }

    indexContentEmitted.add(filename)
  }

  const prefix =
    `import withLayout from '${layout}'\n` +
    `import { withSSG } from 'nextra/ssg'\n` +
    `${layoutConfig ? `import layoutConfig from '${layoutConfig}'` : ''}\n` +
    `const NEXTRA_PAGE_MAP = ${JSON.stringify(pageMap)}\n`

  const suffix = `export default function NextraPage (props) {
  return withSSG(withLayout({
    filename: "${slash(filename)}",
    route: "${slash(route)}",
    meta: ${JSON.stringify(data)},
    pageMap: NEXTRA_PAGE_MAP,
    titleText: ${JSON.stringify(titleText)},
    headings: ${JSON.stringify(headings)},
    hasH1: ${JSON.stringify(hasH1)}
  }, ${layoutConfig ? 'layoutConfig' : 'null'}))({
    ...props,
    children: <MDXContent/>
  })
}`

  // Add imports and exports to the source
  return callback(null, prefix + '\n\n' + content + '\n\n' + suffix)
}
