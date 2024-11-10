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
  IS_PRODUCTION,
  METADATA_ONLY_RQ,
  PAGE_MAP_PLACEHOLDER_PATH
} from './constants.js'
import { getContentDirectory } from './index.js'
import { findMetaAndPageFilePaths } from './page-map/find-meta-and-page-file-paths.js'
import { convertPageMapToJs } from './page-map/to-js.js'
import { convertToPageMap } from './page-map/to-page-map.js'
import { twoslashRenderer } from './twoslash.js'
import { logger } from './utils.js'

const NOW = Date.now()
const CONTENT_DIR = getContentDirectory()
const APP_DIR = findPagesDir(CWD).appDir!

if (!APP_DIR) {
  throw new Error('Unable to find `app` directory')
}

const repository = await (async () => {
  if (process.versions.webcontainer) return
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
    return repository
  } catch (error) {
    logger.warn(`Init git repository failed ${(error as Error).message}`)
  }
})()

// repository.path() returns the `/path/to/repo/.git`, we need the parent directory of it
const GIT_ROOT = repository ? path.join(repository.path(), '..') : ''

async function getLastCommitTime(
  filePath: string
): Promise<number | undefined> {
  try {
    if (!repository) {
      throw new Error('Init git repository failed')
    }
    const relativePath = path.relative(GIT_ROOT, filePath)
    return await repository.getFileLatestModifiedDateAsync(relativePath)
  } catch {
    logger.warn(
      'Failed to get the last modified timestamp from Git for the file',
      filePath
    )
  }
}

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
      this.addContextDependency(APP_DIR)
      if (CONTENT_DIR) {
        this.addContextDependency(path.join(CWD, CONTENT_DIR, locale))
      }
    }
    const filePaths = await findMetaAndPageFilePaths({
      dir: APP_DIR,
      cwd: CWD,
      locale,
      contentDir: CONTENT_DIR
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

  const restProps: PageOpts['metadata'] = {
    filePath: slash(path.relative(CWD, filePath)),
    // Run only on production because it can slow down Fast Refresh for uncommitted files
    // https://github.com/shuding/nextra/issues/3675#issuecomment-2466416366
    timestamp: IS_PRODUCTION ? await getLastCommitTime(filePath) : NOW,
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
