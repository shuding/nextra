import type { LoaderOptions, PageOpts } from './types'

import path from 'path'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'
import { Repository } from '@napi-rs/simple-git'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'

import { addPage } from './content-dump'
import { parseFileName } from './utils'
import { compileMdx } from './compile'
import { getPageMap } from './page-map'
import { collectFiles, collectMdx } from './plugin'
import {
  IS_PRODUCTION,
  DEFAULT_LOCALE,
  OFFICIAL_THEMES,
  MARKDOWN_EXTENSION_REGEX,
  META_FILENAME
} from './constants'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set<string>()

const pagesDir = findPagesDir(process.cwd()).pages

const [repository, gitRoot] = (function () {
  try {
    const repo = Repository.discover(process.cwd())
    if (repo.isShallow()) {
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
  const { resourcePath } = context
  const {
    pageImport,
    theme,
    themeConfig,
    defaultLocale,
    unstable_flexsearch,
    unstable_staticImage,
    mdxOptions,
    pageMapCache,
    newNextLinkBehavior
  } = context.getOptions()

  context.cacheable(true)

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }

  if (resourcePath.includes('/pages/api/')) {
    console.warn(
      `[nextra] Ignoring ${resourcePath} because it is located in the "pages/api" folder.`
    )
    return ''
  }

  const { items: pageMapResult, fileMap } = IS_PRODUCTION
    ? pageMapCache.get()!
    : await collectFiles(pagesDir, '/')

  // mdx is imported but is outside the `pages` directory
  if (!fileMap[resourcePath]) {
    fileMap[resourcePath] = await collectMdx(resourcePath)
    context.addMissingDependency(resourcePath)
  }

  const fileLocale = parseFileName(resourcePath).locale

  for (const [filePath, { name, locale }] of Object.entries(fileMap)) {
    if (name === META_FILENAME && (!fileLocale || locale === fileLocale)) {
      context.addDependency(filePath)
    }
  }
  // Add the entire directory `pages` as the dependency,
  // so we can generate the correct page map.
  context.addContextDependency(pagesDir)

  // Extract frontMatter information if it exists
  const { data: frontMatter, content } = grayMatter(source)

  const { result, headings, structurizedData, hasJsxInH1 } = await compileMdx(
    content,
    mdxOptions,
    {
      unstable_staticImage,
      unstable_flexsearch
    },
    resourcePath
  )
  const cssImport = OFFICIAL_THEMES.includes(theme)
    ? `import '${theme}/style.css'`
    : ''

  // Imported as a normal component, no need to add the layout.
  if (!pageImport) {
    return `
${cssImport}
${result}
export default MDXContent`.trimStart()
  }

  const [pageMap, route, title] = getPageMap(
    resourcePath,
    pageMapResult,
    fileMap,
    defaultLocale
  )

  const skipFlexsearchIndexing =
    IS_PRODUCTION && indexContentEmitted.has(resourcePath)
  if (unstable_flexsearch && !skipFlexsearchIndexing) {
    if (frontMatter.searchable !== false) {
      addPage({
        fileLocale: fileLocale || DEFAULT_LOCALE,
        route,
        title,
        frontMatter,
        structurizedData
      })
    }
    indexContentEmitted.add(resourcePath)
  }

  let timestamp: PageOpts['timestamp']
  if (repository && gitRoot) {
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, resourcePath)
      )
    } catch {
      // Failed to get timestamp for this file. Silently ignore it.
    }
  }

  // Relative path instead of a package name
  const layout =
    theme.startsWith('.') || theme.startsWith('/') ? path.resolve(theme) : theme

  const themeConfigImport = themeConfig
    ? `import __nextra_themeConfig__ from '${slash(path.resolve(themeConfig))}'`
    : ''

  const pageOpts: Omit<PageOpts, 'title'> = {
    filePath: slash(path.relative(process.cwd(), resourcePath)),
    route: slash(route),
    frontMatter,
    pageMap,
    headings,
    hasJsxInH1,
    timestamp,
    unstable_flexsearch,
    newNextLinkBehavior
  }

  const pageNextRoute =
    '/' +
    slash(path.relative(pagesDir, resourcePath))
      // Remove the `mdx?` extension
      .replace(MARKDOWN_EXTENSION_REGEX, '')
      // Remove the `*/index` suffix
      .replace(/\/index$/, '')
      // Remove the only `index` route
      .replace(/^index$/, '')

  return `
import { SSGContext as __nextra_SSGContext__ } from 'nextra/ssg'
${themeConfigImport}
${cssImport}

${result}

const __nextra_pageOpts__ = ${JSON.stringify(pageOpts)}

__nextra_pageOpts__.title =
  __nextra_pageOpts__.frontMatter.title ||
  (typeof __nextra_title__ === 'string' && __nextra_title__) ||
  'Untitled'

globalThis.__nextra_internal__ = {
  pageMap: __nextra_pageOpts__.pageMap,
  route: __nextra_pageOpts__.route
}

const Content = props => (
  <__nextra_SSGContext__.Provider value={props}>
    <MDXContent />
  </__nextra_SSGContext__.Provider>
)

globalThis.__nextra_pageContext__ ||= Object.create(null)

// Make sure the same component is always returned so Next.js will render the
// stable layout. We then put the actual content into a global store and use
// the route to identify it.
globalThis.__nextra_pageContext__[${JSON.stringify(pageNextRoute)}] = {
  Content,
  pageOpts: __nextra_pageOpts__,
  themeConfig: ${themeConfigImport ? '__nextra_themeConfig__' : 'null'}
}

export { default } from '${layout}'`.trimStart()
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
