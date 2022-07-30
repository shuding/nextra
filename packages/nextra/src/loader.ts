import type { LoaderOptions, PageOpts } from './types'

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
import { IS_PRODUCTION, DEFAULT_LOCALE } from './constants'

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set<string>()

const pagesDir = path.resolve(findPagesDir())

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
  context.cacheable(true)

  let {
    theme,
    themeConfig,
    defaultLocale,
    unstable_flexsearch,
    unstable_staticImage,
    mdxOptions,
    pageMapCache,
    newNextLinkBehavior
  } = context.getOptions()

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }

  const { resourcePath } = context
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

  const filename = path.basename(resourcePath)
  const fileLocale = parseFileName(filename).locale

  for (const [filePath, { name, locale }] of Object.entries(fileMap)) {
    if (name === 'meta.json' && (!fileLocale || locale === fileLocale)) {
      context.addDependency(filePath)
    }
  }
  // Add the entire directory `pages` as the dependency,
  // so we can generate the correct page map.
  context.addContextDependency(pagesDir)

  // Extract frontMatter information if it exists
  const { data: meta, content } = grayMatter(source)

  if (IS_PRODUCTION && indexContentEmitted.has(filename)) {
    unstable_flexsearch = false
  }

  const { result, headings, structurizedData, hasJsxInH1 } = await compileMdx(
    content,
    mdxOptions,
    {
      unstable_staticImage,
      unstable_flexsearch
    },
    resourcePath
  )
  const [pageMap, route, title] = getPageMap(
    resourcePath,
    pageMapResult,
    fileMap,
    defaultLocale
  )

  if (unstable_flexsearch) {
    if (meta.searchable !== false) {
      addPage({
        fileLocale: fileLocale || DEFAULT_LOCALE,
        route,
        title,
        meta,
        structurizedData
      })
    }

    indexContentEmitted.add(filename)
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
  const layoutConfig = themeConfig ? slash(path.resolve(themeConfig)) : ''
  const pageOpts: Omit<PageOpts, 'titleText'> = {
    filename: slash(filename),
    route: slash(route),
    meta,
    pageMap,
    headings,
    hasJsxInH1,
    timestamp,
    unstable_flexsearch,
    newNextLinkBehavior
  }

  return `
import { withSSG as __nextra_withSSG__ } from 'nextra/ssg'
import __nextra_withLayout__ from '${layout}'
${layoutConfig && `import __nextra_layoutConfig__ from '${layoutConfig}'`}
${result.replace('export default MDXContent;', '')}

const __nextra_pageOpts__ = ${JSON.stringify(pageOpts)}

globalThis.__nextra_internal__ = {
  pageMap: __nextra_pageOpts__.pageMap,
  route: __nextra_pageOpts__.route
}

const NextraLayout = __nextra_withSSG__(__nextra_withLayout__({
  titleText: typeof titleText === 'string' ? titleText : undefined,
  ...__nextra_pageOpts__
}, ${layoutConfig ? '__nextra_layoutConfig__' : 'null'}))

function NextraPage(props) {
  return (
    <NextraLayout {...props}>
      <MDXContent />
    </NextraLayout>
  )
}
NextraPage.getLayout = NextraLayout.getLayout

export default NextraPage`.trimStart()
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
