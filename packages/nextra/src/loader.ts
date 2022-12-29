import type { LoaderOptions, MdxPath, PageOpts } from './types'

import path from 'node:path'
import grayMatter from 'gray-matter'
import slash from 'slash'
import { LoaderContext } from 'webpack'

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
  CWD
} from './constants'
import { findPagesDirectory } from './file-system'

const PAGES_DIR = findPagesDirectory()

// TODO: create this as a webpack plugin.
const indexContentEmitted = new Set<string>()

const IS_WEB_CONTAINER = !!process.versions.webcontainer

const initGitRepo = (async () => {
  if (!IS_WEB_CONTAINER) {
    const { Repository } = await import('@napi-rs/simple-git')
    try {
      const repository = Repository.discover(CWD)
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
      // repository.path() returns the `/path/to/repo/.git`, we need the parent directory of it
      const gitRoot = path.join(repository.path(), '..')
      return { repository, gitRoot }
    } catch (e) {
      console.warn('[nextra] Init git repository failed', e)
    }
  }
  return {}
})()

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {string}
 */
function hashFnv32a(str: string, seed = 0x811c9dc5) {
  let i,
    l,
    hval = seed

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }

  // Convert to 8 digit hex string
  return ('0000000' + (hval >>> 0).toString(16)).substring(-8)
}

async function loader(
  context: LoaderContext<LoaderOptions>,
  source: string
): Promise<string> {
  const {
    pageImport,
    theme,
    themeConfig,
    defaultLocale,
    defaultShowCopyCode,
    flexsearch,
    staticImage,
    readingTime: _readingTime,
    mdxOptions,
    pageMapCache,
    newNextLinkBehavior,
    distDir
  } = context.getOptions()

  context.cacheable(true)

  // Check if there's a theme provided
  if (!theme) {
    throw new Error('No Nextra theme found!')
  }

  const mdxPath = context.resourcePath as MdxPath

  if (mdxPath.includes('/pages/api/')) {
    console.warn(
      `[nextra] Ignoring ${mdxPath} because it is located in the "pages/api" folder.`
    )
    return ''
  }

  const { items, fileMap } = IS_PRODUCTION
    ? pageMapCache.get()!
    : await collectFiles(PAGES_DIR)

  // mdx is imported but is outside the `pages` directory
  if (!fileMap[mdxPath]) {
    fileMap[mdxPath] = await collectMdx(mdxPath)
    context.addMissingDependency(mdxPath)
  }

  const { locale } = parseFileName(mdxPath)

  for (const [filePath, file] of Object.entries(fileMap)) {
    if (file.kind === 'Meta' && (!locale || file.locale === locale)) {
      context.addDependency(filePath)
    }
  }
  // Add the entire directory `pages` as the dependency,
  // so we can generate the correct page map.
  context.addContextDependency(PAGES_DIR)

  // Extract frontMatter information if it exists
  const { data: frontMatter, content } = grayMatter(source)

  const { result, headings, structurizedData, hasJsxInH1, readingTime } =
    await compileMdx(
      content,
      {
        mdxOptions: {
          ...mdxOptions,
          jsx: true,
          outputFormat: 'program'
        },
        readingTime: _readingTime,
        defaultShowCopyCode,
        staticImage,
        flexsearch
      },
      mdxPath
    )
  // @ts-expect-error
  const cssImport = OFFICIAL_THEMES.includes(theme)
    ? `import '${theme}/style.css'`
    : ''

  // Imported as a normal component, no need to add the layout.
  if (!pageImport) {
    return `${cssImport}
${result}
export default MDXContent`
  }

  const { route, title, pageMap } = getPageMap({
    filePath: mdxPath,
    fileMap,
    defaultLocale,
    pageMap: items
  })

  const skipFlexsearchIndexing =
    IS_PRODUCTION && indexContentEmitted.has(mdxPath)
  if (flexsearch && !skipFlexsearchIndexing) {
    if (frontMatter.searchable !== false) {
      addPage({
        locale: locale || DEFAULT_LOCALE,
        route,
        title,
        structurizedData,
        distDir
      })
    }
    indexContentEmitted.add(mdxPath)
  }

  let timestamp: PageOpts['timestamp']
  const { repository, gitRoot } = await initGitRepo
  if (repository && gitRoot) {
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, mdxPath)
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
    filePath: slash(path.relative(CWD, mdxPath)),
    route,
    frontMatter,
    pageMap,
    headings,
    hasJsxInH1,
    timestamp,
    flexsearch,
    newNextLinkBehavior,
    readingTime
  }

  const pageNextRoute =
    '/' +
    slash(path.relative(PAGES_DIR, mdxPath))
      // Remove the `mdx?` extension
      .replace(MARKDOWN_EXTENSION_REGEX, '')
      // Remove the `*/index` suffix
      .replace(/\/index$/, '')
      // Remove the only `index` route
      .replace(/^index$/, '')

  const stringifiedPageOpts = JSON.stringify(pageOpts)
  const pageOptsChecksum = hashFnv32a(stringifiedPageOpts)

  return `import { SSGContext as __nextra_SSGContext__ } from 'nextra/ssg'
${themeConfigImport}
${cssImport}

const __nextra_pageOpts__ = ${stringifiedPageOpts}

// Make sure the same component is always returned so Next.js will render the
// stable layout. We then put the actual content into a global store and use
// the route to identify it.
const NEXTRA_INTERNAL = Symbol.for('__nextra_internal__')
const __nextra_internal__ = (globalThis[NEXTRA_INTERNAL] ||= Object.create(null))
__nextra_internal__.pageMap = __nextra_pageOpts__.pageMap
__nextra_internal__.route = __nextra_pageOpts__.route
__nextra_internal__.context ||= Object.create(null)
__nextra_internal__.refreshListeners ||= Object.create(null)

${result}

const Content = props => (
  <__nextra_SSGContext__.Provider value={props}>
    <MDXContent />
  </__nextra_SSGContext__.Provider>
)

__nextra_pageOpts__.title =
  ${JSON.stringify(frontMatter.title)} ||
  (typeof __nextra_title__ === 'string' && __nextra_title__) ||
  ${JSON.stringify(title /* Fallback as sidebar link name */)}

__nextra_internal__.context[${JSON.stringify(pageNextRoute)}] = {
  Content,
  pageOpts: __nextra_pageOpts__,
  themeConfig: ${themeConfigImport ? '__nextra_themeConfig__' : 'null'},
}
${'' /* TODO: Do not include all the HMR logic for prod */}
if (module.hot) {
  const checksum = "${pageOptsChecksum}"
  if (!module.hot.data) module.hot.data = {}
  if (module.hot.data.prevPageOptsChecksum !== checksum) {
    __nextra_internal__.refreshListeners[${JSON.stringify(
      pageNextRoute
    )}]?.forEach(listener => listener())
  }
  module.hot.dispose((data) => {
    data.prevPageOptsChecksum = checksum
  })
}

export { default } from '${layout}'`
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
