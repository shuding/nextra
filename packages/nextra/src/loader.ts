import type { LoaderOptions } from './types'

import path from 'path'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'
import { Repository } from '@napi-rs/simple-git'

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

let [repository, gitRoot] = (function () {
  try {
    const repo = Repository.discover(process.cwd())
    // repository.path() returns the `/path/to/repo/.git`, we need the parent directory of it
    const gitRoot = path.join(repo.path(), '..')
    return [repo, gitRoot]
  } catch (e) {
    console.warn('Init git repository failed', e)
    return []
  }
})()

async function loader(
  context: LoaderContext<LoaderOptions>,
  source: string
): Promise<string | Buffer> {
  context.cacheable(true)

  const options = context.getOptions()
  let {
    theme,
    themeConfig,
    defaultLocale,
    unstable_flexsearch,
    unstable_staticImage,
    mdxOptions,
    pageMapCache
  } = options

  const { resourcePath } = context
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
    context.addContextDependency(pagesDir)
  } else {
    // We only add meta files as dependencies for prodution build,
    // so we can do incremental builds.
    Object.entries(fileMap).forEach(([filePath, { name, meta, locale }]) => {
      if (
        name === 'meta.json' &&
        meta &&
        (!fileLocale || locale === fileLocale)
      ) {
        context.addDependency(filePath)
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
    await compileMdx(
      content,
      mdxOptions,
      {
        unstable_staticImage,
        unstable_flexsearch
      },
      resourcePath
    )
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

  let timestamp: number | undefined
  if (repository && gitRoot) {
    if (repository.isShallow()) {
      if (process.env.VERCEL) {
        console.warn(
          `The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning.`
        )
      } else if (process.env.GITHUB_ACTION) {
        console.warn(
          `The repository is shallow cloned, so the latest modified time will not be presented. See https://github.com/actions/checkout#fetch-all-history-for-all-tags-and-branches to fetch all the history.`
        )
      } else {
        console.warn(
          `The repository is shallow cloned, so the latest modified time will not be presented.`
        )
      }
    }
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, resourcePath)
      )
    } catch (e) {
      // Failed to get timestamp for this file. Silently ignore it.
    }
  }

  const prefix =
    `import __nextra_withLayout__ from '${layout}'\n` +
    `import { withSSG as __nextra_withSSG__ } from 'nextra/ssg'\n` +
    `${
      layoutConfig
        ? `import __nextra_layoutConfig__ from '${layoutConfig}'`
        : ''
    }\n\n` +
    `const __nextra_pageMap__ = ${JSON.stringify(pageMap)}\n` +
    `globalThis.__nextra_internal__ = {\n` +
    `  pageMap: __nextra_pageMap__,\n` +
    `  route: ${JSON.stringify(route)},\n` +
    `}\n` +
    `
    const __nextra_content__ = <MDXContent/>
    const NextraLayout = __nextra_withSSG__(__nextra_withLayout__({
      filename: "${slash(filename)}",
      route: "${slash(route)}",
      meta: ${JSON.stringify(data)},
      pageMap: __nextra_pageMap__,
      titleText: ${JSON.stringify(titleText)},
      headings: ${JSON.stringify(headings)},
      hasH1: ${JSON.stringify(hasH1)},
      ${timestamp ? `timestamp: ${timestamp},\n` : ''}
    }, ${layoutConfig ? '__nextra_layoutConfig__' : 'null'}))
    `

  const suffix = `export default function NextraPage (props) {
  return <NextraLayout {...props}>{__nextra_content__}</NextraLayout>
}
NextraPage.getLayout = NextraLayout.getLayout`

  // console.log(content)

  // Add imports and exports to the source
  return prefix + '\n\n' + content + '\n\n' + suffix
}

export default function syncLoader(
  this: LoaderContext<LoaderOptions>,
  source: string,
  callback: (err?: null | Error, content?: string | Buffer) => void
) {
  loader(this, source)
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
