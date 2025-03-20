import path from 'node:path'
import { transformerTwoslash } from '@shikijs/twoslash'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import type { LoaderContext } from 'webpack'
import type { LoaderOptions } from '../types.js'
import { compileMetadata } from './compile-metadata.js'
import { compileMdx } from './compile.js'
import { CWD, IS_PRODUCTION, METADATA_ONLY_RQ } from './constants.js'
import { findMetaAndPageFilePaths } from './page-map/find-meta-and-page-file-paths.js'
import { convertPageMapToJs } from './page-map/to-js.js'
import { convertToPageMap } from './page-map/to-page-map.js'
import { twoslashRenderer } from './twoslash.js'
import { logger } from './utils.js'

const NOW = Date.now()
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

const DEFAULT_TRANSFORMERS = transformerTwoslash({
  renderer: twoslashRenderer(),
  explicitTrigger: true
})

export async function loader(
  this: LoaderContext<LoaderOptions>,
  source: string
): Promise<string> {
  const {
    isPageImport,
    defaultShowCopyCode,
    search,
    staticImage,
    readingTime: _readingTime,
    latex,
    codeHighlight,
    mdxOptions,
    contentDirBasePath,
    contentDir,
    locales,
    whiteListTagsStyling,
    shouldAddLocaleToLinks
  } = this.getOptions()
  const { resourcePath, resourceQuery } = this

  // We pass `contentDir` only for `page-map/placeholder.ts`
  if (contentDir) {
    const locale = resourceQuery.replace('?lang=', '')
    // Add `app` and `content` folders as the dependencies, so Webpack will
    // rebuild the module if anything in that context changes
    //
    // Note: should be added for dev and prod environment since build can be crashed after renaming
    // mdx pages https://github.com/shuding/nextra/issues/3988#issuecomment-2605389046
    this.addContextDependency(APP_DIR)
    this.addContextDependency(path.join(CWD, contentDir, locale))

    const filePaths = await findMetaAndPageFilePaths({
      dir: APP_DIR,
      cwd: CWD,
      locale,
      contentDir
    })
    let { pageMap, mdxPages } = convertToPageMap({
      filePaths,
      basePath: shouldAddLocaleToLinks
        ? [locale, contentDirBasePath].filter(Boolean).join('/')
        : contentDirBasePath,
      locale
    })
    if (shouldAddLocaleToLinks && 'children' in pageMap[0]!) {
      pageMap = pageMap[0].children
    }
    const globalMetaPath = filePaths.find(filePath =>
      filePath.includes('/_meta.global.')
    )
    return convertPageMapToJs({ pageMap, mdxPages, globalMetaPath })
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- We pass `locales` only for `page-map/get.ts`
  if (locales) {
    return replaceDynamicResourceQuery(
      source,
      'import(`./placeholder.js?lang=${lang}`)',
      locales
    )
  }

  // Run only on production because it can slow down Fast Refresh for uncommitted files
  // https://github.com/shuding/nextra/issues/3675#issuecomment-2466416366
  const lastCommitTime = IS_PRODUCTION
    ? await getLastCommitTime(resourcePath)
    : NOW

  if (!IS_PRODUCTION && resourceQuery === METADATA_ONLY_RQ) {
    return compileMetadata(source, {
      filePath: resourcePath,
      lastCommitTime
    })
  }
  return compileMdx(source, {
    mdxOptions: {
      ...mdxOptions,
      jsx: true,
      outputFormat: 'program',
      rehypePrettyCodeOptions: {
        ...mdxOptions.rehypePrettyCodeOptions,
        transformers: [
          DEFAULT_TRANSFORMERS,
          ...(mdxOptions.rehypePrettyCodeOptions.transformers || [])
        ]
      }
    },
    readingTime: _readingTime,
    defaultShowCopyCode,
    staticImage,
    search,
    latex,
    codeHighlight,
    filePath: resourcePath,
    useCachedCompiler: true,
    isPageImport,
    whiteListTagsStyling,
    lastCommitTime
  })
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

async function getLastCommitTime(
  filePath: string
): Promise<number | undefined> {
  if (!repository) {
    // Skip since we already logged logger.warn('Init git repository failed')
    return
  }
  const relativePath = path.relative(GIT_ROOT, filePath)
  try {
    return await repository.getFileLatestModifiedDateAsync(relativePath)
  } catch {
    logger.warn(
      'Failed to get the last modified timestamp from Git for the file',
      relativePath
    )
  }
}
