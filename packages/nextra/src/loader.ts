import path from 'path'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'
import { addPage } from './content-dump'
import { getLocaleFromFilename } from './utils'
import { compileMdx } from './compile'
import type { LoaderOptions } from './types'
import { getPageMap, findPagesDir } from './page-map'
import { collectFiles } from './plugin'
const extension = /\.mdx?$/
const isProductionBuild = process.env.NODE_ENV === 'production'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set()

export default async function (
  this: LoaderContext<LoaderOptions>,
  source: string,
  callback: (err?: null | Error, content?: string | Buffer) => void
) {
  this.cacheable(true)

  if (!isProductionBuild) {
    // Add the entire directory `pages` as the dependency
    // so we can generate the correct page map
    this.addContextDependency(path.resolve(findPagesDir()))
  }

  const options = this.getOptions()
  let {
    theme,
    themeConfig,
    defaultLocale,
    unstable_contentDump,
    unstable_staticImage,
    mdxOptions,
    pageMapCache
  } = options

  const { resourcePath } = this
  const filename = resourcePath.slice(resourcePath.lastIndexOf('/') + 1)
  const fileLocale = getLocaleFromFilename(filename) || 'default'

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }
  let pageMapResult, fileMap

  if (process.env.NODE_ENV === 'development') {
    const data = await collectFiles(
      path.join(process.cwd(), findPagesDir()),
      '/'
    )
    pageMapResult = data.items
    fileMap = data.fileMap
  } else {
    const data = pageMapCache.get()!
    pageMapResult = data.items
    fileMap = data.fileMap
  }
  const [pageMap, route, title] = getPageMap(
    resourcePath,
    pageMapResult,
    fileMap,
    defaultLocale
  )
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
