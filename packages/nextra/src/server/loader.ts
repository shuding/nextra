import path from 'node:path'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import slash from 'slash'
import type { LoaderContext } from 'webpack'
import type { LoaderOptions, PageOpts } from '../types'
import { compileMdx } from './compile.js'
import { CWD } from './constants.js'
import { APP_DIR } from './file-system.js'
import {
  generatePageMapFromFilepaths,
  getFilepaths
} from './generate-page-map.js'
import { collectPageMap } from './page-map.js'
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

export async function loader(
  this: LoaderContext<LoaderOptions>,
  source: string
): Promise<string> {
  // this.cacheable(true)
  const {
    isPageImport = false,
    isPageMapImport,
    defaultShowCopyCode,
    search,
    staticImage,
    readingTime: _readingTime,
    latex,
    codeHighlight,
    mdxOptions,
    useContentDir
  } = this.getOptions()

  const resolveData = this._module?.resourceResolveData

  const mdxPath = resolveData
    ? // to make it work with symlinks, resolve the mdx path based on the relative path
      /*
       * `context.rootContext` could include path chunk of
       * `context._module.resourceResolveData.relativePath` use
       * `context._module.resourceResolveData.descriptionFileRoot` instead
       */
      path.join(resolveData.descriptionFileRoot, resolveData.relativePath)
    : this.resourcePath
  if (isPageMapImport) {
    const locale = ''
    const relativePaths = await getFilepaths({
      dir: useContentDir ? path.join('content', locale) : APP_DIR,
      isAppDir: !useContentDir
    })

    const { pageMap, mdxPages } = generatePageMapFromFilepaths(relativePaths)
    const rawJs = await collectPageMap({
      locale,
      pageMap,
      mdxPages,
      fromAppDir: !useContentDir
    })
    return rawJs
  }
  const { result, readingTime } = await compileMdx(source, {
    mdxOptions: {
      ...mdxOptions,
      jsx: true,
      outputFormat: 'program',
      format: 'detect',
      rehypePrettyCodeOptions: {
        transformers: [
          transformerTwoslash({
            renderer: rendererRich(),
            explicitTrigger: true
          })
        ],
        ...mdxOptions?.rehypePrettyCodeOptions
      }
    },
    readingTime: _readingTime,
    defaultShowCopyCode,
    staticImage,
    search,
    latex,
    codeHighlight,
    filePath: mdxPath,
    useCachedCompiler: true,
    isPageImport
  })

  let timestamp: PageOpts['metadata']['timestamp']
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

  const restProps: PageOpts['metadata'] = {
    filePath: slash(path.relative(CWD, mdxPath)),
    timestamp,
    readingTime
  }
  const enhancedMetadata = `Object.assign(metadata, ${JSON.stringify(restProps)})`

  // Imported as a normal component, no need to add the layout.
  if (!isPageImport) {
    return `${result}   
${enhancedMetadata}
export default MDXLayout`
  }
  const rawJs = `import { HOC_MDXWrapper } from 'nextra/setup-page'
${result}

${enhancedMetadata}
export default HOC_MDXWrapper(
  MDXLayout,
  {metadata, title, toc:useTOC()}
)`
  return rawJs
}
