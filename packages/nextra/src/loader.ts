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
import { collectFiles, collectMdx } from './plugin'
import {
  MARKDOWN_EXTENSION_REGEX,
  IS_PRODUCTION,
  DEFAULT_LOCALE
} from './constants'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set<string>()

const pagesDir = path.resolve(findPagesDir())

let wasShallowWarningPrinted = false

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
    console.warn(
      `[nextra] Ignoring ${resourcePath} because it is located in the "pages/api" folder.`
    )
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

  // mdx is imported but is outside the `pages` directory
  if (!fileMap[resourcePath]) {
    fileMap[resourcePath] = await collectMdx(resourcePath)
    context.addMissingDependency(resourcePath)
  }

  const [pageMap, route, title] = getPageMap(
    resourcePath,
    pageMapResult,
    fileMap,
    defaultLocale
  )

  for (const [filePath, { name, locale }] of Object.entries(fileMap)) {
    if (name === 'meta.json' && (!fileLocale || locale === fileLocale)) {
      context.addDependency(filePath)
    }
  }
  // Add the entire directory `pages` as the dependency,
  // so we can generate the correct page map.
  context.addContextDependency(pagesDir)

  // Extract frontMatter information if it exists
  const { data, content } = grayMatter(source)

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

  const { result, headings, structurizedData } = await compileMdx(
    content,
    mdxOptions,
    {
      unstable_staticImage,
      unstable_flexsearch
    },
    resourcePath
  )

  if (unstable_flexsearch) {
    // We only add .MD and .MDX contents
    if (MARKDOWN_EXTENSION_REGEX.test(filename) && data.searchable !== false) {
      addPage({
        fileLocale: fileLocale || DEFAULT_LOCALE,
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
    if (repository.isShallow() && !wasShallowWarningPrinted) {
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
      wasShallowWarningPrinted = true
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
${result.replace('export default MDXContent;', '')}

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
  titleText: typeof titleText === 'string' ? titleText : undefined,
  headings: ${JSON.stringify(headings)},
  ${timestamp ? `timestamp: ${timestamp},\n` : ''}
  ${
    unstable_flexsearch
      ? `unstable_flexsearch: ${JSON.stringify(unstable_flexsearch)}`
      : ''
  }
}, ${layoutConfig ? '__nextra_layoutConfig__' : 'null'}))

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
): void {
  loader(this, source)
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
