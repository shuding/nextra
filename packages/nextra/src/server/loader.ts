import path from 'node:path'
import slash from 'slash'
import type { LoaderContext } from 'webpack'
import type { LoaderOptions, PageOpts } from '../types'
import { compileMdx } from './compile.js'
import {
  // CHUNKS_DIR,
  CWD,
  MARKDOWN_EXTENSION_REGEX
  // OFFICIAL_THEMES
} from './constants.js'
import { APP_DIR } from './file-system.js'
import { logger } from './utils.js'

const initGitRepo = (async () => {
  const IS_WEB_CONTAINER = !!process.versions.webcontainer

  if (!IS_WEB_CONTAINER) {
    const { Repository } = await import('@napi-rs/simple-git')
    try {
      const repository = Repository.discover(CWD)
      if (repository.isShallow()) {
        if (process.env.VERCEL) {
          logger.warn(
            'The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning.'
          )
        } else if (process.env.GITHUB_ACTION) {
          logger.warn(
            'The repository is shallow cloned, so the latest modified time will not be presented. See https://github.com/actions/checkout#fetch-all-history-for-all-tags-and-branches to fetch all the history.'
          )
        } else {
          logger.warn(
            'The repository is shallow cloned, so the latest modified time will not be presented.'
          )
        }
      }
      // repository.path() returns the `/path/to/repo/.git`, we need the parent directory of it
      const gitRoot = path.join(repository.path(), '..')
      return { repository, gitRoot }
    } catch (error) {
      logger.warn(`Init git repository failed ${(error as Error).message}`)
    }
  }
  return {}
})()

// let isAppFileFromNodeModules = false

export async function loader(
  this: LoaderContext<LoaderOptions>,
  source: string
): Promise<string> {
  const {
    isPageImport = false,
    isPageMapImport,
    defaultShowCopyCode,
    search,
    staticImage,
    readingTime: _readingTime,
    latex,
    codeHighlight,
    transform,
    mdxOptions,
    locales
  } = this.getOptions()

  const mdxPath = this._module?.resourceResolveData
    ? // to make it work with symlinks, resolve the mdx path based on the relative path
      /*
       * `context.rootContext` could include path chunk of
       * `context._module.resourceResolveData.relativePath` use
       * `context._module.resourceResolveData.descriptionFileRoot` instead
       */
      path.join(
        this._module.resourceResolveData.descriptionFileRoot,
        this._module.resourceResolveData.relativePath
      )
    : this.resourcePath

  const currentPath = slash(mdxPath)

  if (currentPath.includes('/pages/api/')) {
    logger.warn(
      `Ignoring ${currentPath} because it is located in the "pages/api" folder.`
    )
    return ''
  }

  const relativePath = slash(path.relative(APP_DIR, mdxPath))

  let locale = locales[0] === '' ? '' : relativePath.split('/')[0]
  // In case when partial document is placed outside `pages` directory
  if (locale === '..') locale = ''

  const route =
    '/' +
    relativePath
      .replace(MARKDOWN_EXTENSION_REGEX, '')
      .replace(/\/page$/, '')
      .replace(/^app\//, '')
  const {
    result,
    title,
    frontMatter,
    structurizedData,
    searchIndexKey,
    hasJsxInH1,
    readingTime
  } = await compileMdx(source, {
    mdxOptions: {
      ...mdxOptions,
      jsx: true,
      outputFormat: 'program',
      format: 'detect'
    },
    readingTime: _readingTime,
    defaultShowCopyCode,
    staticImage,
    search,
    latex,
    codeHighlight,
    route,
    locale,
    filePath: mdxPath,
    useCachedCompiler: true,
    isPageImport,
    isPageMapImport
  })
  console.log({ route, isPageImport })
  // Imported as a normal component, no need to add the layout.
  if (!isPageImport) {
    return `${result}
export default MDXLayout`
  }
  if (searchIndexKey && frontMatter.searchable !== false) {
    // Store all the things in buildInfo.
    const { buildInfo } = this._module as any
    buildInfo.nextraSearch = {
      indexKey: searchIndexKey,
      title,
      data: structurizedData,
      route
    }
  }

  let timestamp: PageOpts['timestamp']
  const { repository, gitRoot } = await initGitRepo
  if (repository && gitRoot) {
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, mdxPath)
      )
    } catch {
      // Failed to get timestamp for this file. Silently ignore it
    }
  }

  const pageOpts: Partial<PageOpts> = {
    filePath: slash(path.relative(CWD, mdxPath)),
    hasJsxInH1,
    timestamp,
    readingTime
  }
  const finalResult = transform ? await transform(result, { route }) : result

  const stringifiedPageOpts = JSON.stringify(pageOpts).slice(0, -1)
  // const pageMapPath = path.join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`)

  const rawJs = `
import { HOC_MDXWrapper } from 'nextra/setup-page'
${finalResult}

export default HOC_MDXWrapper(MDXLayout, _provideComponents, useTOC)`
  return rawJs
}
