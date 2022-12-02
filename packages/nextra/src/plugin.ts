import {
  NextraConfig,
  FileMap,
  MdxPath,
  MetaJsonPath,
  PageMapItem,
  Folder,
  MdxFile,
  MetaJsonFile
} from './types'
import fs from 'graceful-fs'
import { promisify } from 'node:util'
import { parseFileName, parseJsonFile, sortPages, truthy } from './utils'
import path from 'node:path'
import slash from 'slash'
import grayMatter from 'gray-matter'
import { Compiler } from 'webpack'

import { restoreCache } from './content-dump'
import { CWD, MARKDOWN_EXTENSION_REGEX, META_FILENAME } from './constants'
import { findPagesDirectory } from './file-system'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

export const collectMdx = async (
  filePath: string,
  route = ''
): Promise<MdxFile> => {
  const { name, locale } = parseFileName(filePath)

  const content = await readFile(filePath, 'utf8')
  const { data } = grayMatter(content)
  return {
    kind: 'MdxPage',
    name,
    route,
    ...(locale && { locale }),
    ...(Object.keys(data).length && { frontMatter: data })
  }
}

export async function collectFiles(
  dir: string,
  route = '/',
  fileMap: FileMap = Object.create(null)
): Promise<{ items: PageMapItem[]; fileMap: FileMap }> {
  const files = await readdir(dir, { withFileTypes: true })

  const promises = files.map(async f => {
    const filePath = path.join(dir, f.name)
    const isDirectory = f.isDirectory()
    const { name, locale, ext } = isDirectory
      ? // directory couldn't have extensions
        { name: path.basename(filePath), locale: '', ext: '' }
      : parseFileName(filePath)
    const fileRoute = slash(path.join(route, name.replace(/^index$/, '')))

    if (isDirectory) {
      if (fileRoute === '/api') return
      const { items } = await collectFiles(filePath, fileRoute, fileMap)
      if (!items.length) return
      return <Folder>{
        kind: 'Folder',
        name: f.name,
        route: fileRoute,
        children: items
      }
    }

    if (MARKDOWN_EXTENSION_REGEX.test(ext)) {
      const fp = filePath as MdxPath
      fileMap[fp] = await collectMdx(fp, fileRoute)
      return fileMap[fp]
    }
    const fileName = name + ext

    if (fileName === META_FILENAME) {
      const fp = filePath as MetaJsonPath
      const content = await readFile(fp, 'utf8')
      fileMap[fp] = {
        kind: 'Meta',
        ...(locale && { locale }),
        data: parseJsonFile(content, fp)
      }
      return fileMap[fp]
    }

    if (fileName === 'meta.json') {
      console.warn(
        '[nextra] "meta.json" was renamed to "_meta.json". Rename the following file:',
        path.relative(CWD, filePath)
      )
    }
  })

  const items = (await Promise.all(promises)).filter(truthy)

  const mdxPages = items.filter(
    (item): item is MdxFile | Folder =>
      item.kind === 'MdxPage' || item.kind === 'Folder'
  )
  const locales = mdxPages
    .filter((item): item is MdxFile => item.kind === 'MdxPage')
    .map(item => item.locale)

  for (const locale of locales) {
    const metaIndex = items.findIndex(
      item => item.kind === 'Meta' && item.locale === locale
    )

    const defaultMeta = sortPages(mdxPages, locale)

    const metaFilename = locale
      ? META_FILENAME.replace('.', `.${locale}.`)
      : META_FILENAME

    const metaPath = path.join(dir, metaFilename) as MetaJsonPath

    if (metaIndex === -1) {
      fileMap[metaPath] = {
        kind: 'Meta',
        ...(locale && { locale }),
        data: Object.fromEntries(defaultMeta)
      }
      items.push(fileMap[metaPath])
    } else {
      const { data, ...metaFile } = items[metaIndex] as MetaJsonFile
      fileMap[metaPath] = {
        ...metaFile,
        data: {
          ...data,
          ...Object.fromEntries(defaultMeta.filter(([key]) => !(key in data)))
        }
      }
      items[metaIndex] = fileMap[metaPath]
    }
  }

  return { items, fileMap }
}

export class PageMapCache {
  cache: { items: PageMapItem[]; fileMap: FileMap } | null = {
    items: [],
    fileMap: Object.create(null)
  }

  set(data: { items: PageMapItem[]; fileMap: FileMap }) {
    this.cache!.items = data.items
    this.cache!.fileMap = data.fileMap
  }

  clear() {
    this.cache = null
  }

  get() {
    return this.cache
  }
}

export const pageMapCache = new PageMapCache()

export class NextraPlugin {
  constructor(private config: NextraConfig) {}

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'NextraPlugin',
      async (_, callback) => {
        if (this.config?.flexsearch) {
          // Restore the search data from the cache.
          restoreCache()
        }
        const PAGES_DIR = findPagesDirectory()
        const result = await collectFiles(PAGES_DIR)
        pageMapCache.set(result)
        callback()
      }
    )
  }
}
