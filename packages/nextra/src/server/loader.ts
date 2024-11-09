import path from 'node:path'
import { transformerTwoslash } from '@shikijs/twoslash'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import slash from 'slash'
import type { LoaderContext } from 'webpack'
import type { LoaderOptions, PageOpts } from '../types.js'
import { compileMetadata } from './compile-metadata.js'
import { compileMdx } from './compile.js'
import {
  CWD,
  GET_PAGE_MAP_PATH,
  IMPORT_PAGE_PATH,
  IS_PRODUCTION,
  METADATA_ONLY_RQ,
  PAGE_MAP_PLACEHOLDER_PATH
} from './constants.js'
import { findMetaAndPageFilePaths } from './page-map/find-meta-and-page-file-paths.js'
import { convertPageMapToJs } from './page-map/to-js.js'
import { convertToPageMap } from './page-map/to-page-map.js'
import { twoslashRenderer } from './twoslash.js'
import { getDirectories, logger } from './utils.js'

const { appDir, contentDir } = getDirectories()

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
  const {
    isPageImport = false,
    defaultShowCopyCode,
    search,
    staticImage,
    readingTime: _readingTime,
    latex,
    codeHighlight,
    mdxOptions,
    contentDirBasePath,
    locales,
    whiteListTagsStyling
  } = this.getOptions()
  const { resourcePath, resourceQuery } = this
  const filePath = slash(resourcePath)

  if (filePath.includes(PAGE_MAP_PLACEHOLDER_PATH)) {
    const locale = resourceQuery.replace('?lang=', '')
    if (!IS_PRODUCTION) {
      // Add `app` and `content` folders as the dependencies, so Webpack will
      // rebuild the module if anything in that context changes
      this.addContextDependency(appDir)
      this.addContextDependency(path.posix.join(CWD, contentDir, locale))
    }
    const filePaths = await findMetaAndPageFilePaths({
      dir: appDir,
      cwd: CWD,
      locale,
      contentDir
    })
    const { pageMap, mdxPages } = convertToPageMap({
      filePaths,
      // Remove forward slash
      basePath: contentDirBasePath!.slice(1),
      locale
    })
    const rawJs = await convertPageMapToJs({ pageMap, mdxPages })
    return rawJs
  }
  if (filePath.includes(GET_PAGE_MAP_PATH)) {
    const rawJs = replaceDynamicResourceQuery(
      source,
      'import(`./placeholder.js?lang=${lang}`)',
      locales
    )
    return rawJs
  }
  if (filePath.includes(IMPORT_PAGE_PATH)) {
    return contentDir
      ? source.replace(
          'private-next-root-dir/content',
          // User can have `src/content`, so dynamic require will fail, we need
          // to replace it with right `content` directory path
          `private-next-root-dir/${contentDir}`
        )
      : source
  }

  if (!IS_PRODUCTION && resourceQuery === METADATA_ONLY_RQ) {
    const rawJs = await compileMetadata(source, { filePath })
    return rawJs
  }

  const { result, readingTime } = await compileMdx(source, {
    mdxOptions: {
      ...mdxOptions,
      jsx: true,
      outputFormat: 'program',
      format: 'detect',
      providerImportSource: 'next-mdx-import-source-file',
      rehypePrettyCodeOptions: {
        ...mdxOptions?.rehypePrettyCodeOptions,
        transformers: [
          transformerTwoslash({
            renderer: twoslashRenderer(),
            explicitTrigger: true
          }),
          ...(mdxOptions?.rehypePrettyCodeOptions?.transformers || [])
        ]
      }
    },
    readingTime: _readingTime,
    defaultShowCopyCode,
    staticImage,
    search,
    latex,
    codeHighlight,
    filePath,
    useCachedCompiler: true,
    isPageImport,
    whiteListTagsStyling
  })

  let timestamp: PageOpts['metadata']['timestamp']
  const { repository, gitRoot } = await initGitRepo
  if (repository && gitRoot) {
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, filePath)
      )
    } catch {
      // Failed to get timestamp for this file. Silently ignore it
    }
  }

  const restProps: PageOpts['metadata'] = {
    filePath: slash(path.relative(CWD, filePath)),
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

/*
 * https://github.com/vercel/next.js/issues/71453#issuecomment-2431810574
 *
 * Replace `await import(`./placeholder.js?lang=${lang}`)`
 *
 * with:
 *
 * await {
 * "en": () => import("./placeholder.js?lang=en"),
 * "es": () => import("./placeholder.js?lang=es"),
 * "ru": () => import("./placeholder.js?lang=ru")
 * }[locale]()
 *
 * So static analyzer will know which `resourceQuery` to pass to the loader
 **/
function replaceDynamicResourceQuery(
  rawJs: string,
  rawImport: string,
  locales: string[]
): string {
  const { importPath } =
    rawJs.match(/import\(`(?<importPath>.+?)\?lang=\${lang}`\)/)?.groups || {}
  if (!importPath) {
    throw new Error(
      `Can't find \`${rawImport}\` statement. This is a Nextra bug`
    )
  }

  const replaced = `{
${locales
  .map(lang => `"${lang}": () => import("${importPath}?lang=${lang}")`)
  .join(',\n')}
}[lang]()`

  return rawJs.replace(rawImport, replaced)
}
