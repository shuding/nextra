import type { LoaderOptions } from './types'

import path from 'path'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'
import { Repository } from '@napi-rs/simple-git'

import { addPage } from './content-dump'
import { parseFileName } from './utils'
import { compileMdx } from './compile'
import { getPageMap, findPagesDir } from './page-map'
import { collectFiles } from './plugin'
import { MARKDOWN_EXTENSION_REGEX, IS_PRODUCTION } from './constants'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set()

const pagesDir = path.resolve(findPagesDir())

const [repository, gitRoot] = (function () {
  try {
    const repo = Repository.discover(process.cwd())
    // repository.path() returns the `/path/to/repo/.git`, we need the parent directory of it
    const gitRoot = path.join(repo.path(), '..')
    return [repo, gitRoot]
  } catch (e) {
    console.warn('[nextra] Init git repository failed', e)
    return []
  }
})()

async function loader(
  context: LoaderContext<LoaderOptions>,
  source: string
): Promise<string> {
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
  if (resourcePath.includes('/pages/api/')) {
    console.warn(`[nextra] Ignoring ${resourcePath} because it is located in the "pages/api" folder.`)
    return ''
  }

  const filename = path.basename(resourcePath)
  const fileLocale = parseFileName(filename).locale

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }

  const { items: pageMapResult, fileMap } = IS_PRODUCTION
    ? pageMapCache.get()!
    : await collectFiles(pagesDir, '/')

  const [pageMap, route, title] = getPageMap(
    resourcePath,
    pageMapResult,
    fileMap,
    defaultLocale
  )

  if (!IS_PRODUCTION) {
    // Add the entire directory `pages` as the dependency
    // so we can generate the correct page map.
    context.addContextDependency(pagesDir)
  } else {
    // We only add meta files as dependencies for production build,
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

  if (IS_PRODUCTION && indexContentEmitted.has(filename)) {
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
  content = result.replace('export default MDXContent;', '')

  if (unstable_flexsearch) {
    // We only add .MD and .MDX contents
    if (MARKDOWN_EXTENSION_REGEX.test(filename) && data.searchable !== false) {
      addPage({
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
          '[nextra] The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning.'
        )
      } else if (process.env.GITHUB_ACTION) {
        console.warn(
          '[nextra] The repository is shallow cloned, so the latest modified time will not be presented. See https://github.com/actions/checkout#fetch-all-history-for-all-tags-and-branches to fetch all the history.'
        )
      } else {
        console.warn(
          '[nextra] The repository is shallow cloned, so the latest modified time will not be presented.'
        )
      }
    }
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, resourcePath)
      )
    } catch {
      // Failed to get timestamp for this file. Silently ignore it.
    }
  }

  const layoutConfigImport = layoutConfig
    ? `import __nextra_layoutConfig__ from '${layoutConfig}'`
    : ''

  return `
import __nextra_withLayout__ from '${layout}'
import { withSSG as __nextra_withSSG__ } from 'nextra/ssg'
${layoutConfigImport}

const __nextra_pageMap__ = ${JSON.stringify(pageMap)}

globalThis.__nextra_internal__ = {
  pageMap: __nextra_pageMap__,
  route: ${JSON.stringify(route)}
}

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

${content}

function NextraPage(props) {
  return (
    <NextraLayout {...props}>
      <MDXContent />
    </NextraLayout>
  )
}
NextraPage.getLayout = NextraLayout.getLayout

export default NextraPage
`.trimStart()
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
