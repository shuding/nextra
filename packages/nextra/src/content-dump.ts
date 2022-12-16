import path from 'node:path'
import fs from 'graceful-fs'
import { existsSync } from './file-system'
import { CWD } from './constants'

let cacheDir: string
let assetDir: string
let cacheDirExist = false

const asset: { [locale: string]: any } = Object.create(null)
const cached = new Map<string, boolean>()

function initFromCache(filename: string) {
  if (!cached.has(filename)) {
    try {
      const content = fs.readFileSync(path.join(assetDir, filename), 'utf8')
      cached.set(filename, true)
      return JSON.parse(content)
    } catch {
      cached.set(filename, false)
    }
  }
  return {}
}

export function addPage({
  locale,
  route,
  title,
  structurizedData,
  distDir
}: {
  locale: string
  route: string
  title: string
  structurizedData: any
  distDir?: string
}): void {
  if (!cacheDir || !assetDir) {
    initConfig(distDir)
  }
  const dataFilename = `nextra-data-${locale}.json`

  asset[locale] ||= initFromCache(dataFilename)
  asset[locale][route] = {
    title,
    data: structurizedData
  }

  // To prevent race conditions, we temporarily use the sync method to flush.
  // @TODO: introduce mutex lock, or only generate the asset when finishing the
  // entire build.
  const content = JSON.stringify(asset[locale])
  fs.writeFileSync(path.join(assetDir, dataFilename), content)
  fs.writeFileSync(path.join(cacheDir, dataFilename), content)
}

export function initConfig(distDir = '.next') {
  cacheDir = path.join(CWD, distDir, 'cache')
  assetDir = path.join(CWD, distDir, 'static', 'chunks')
}

// Copy cached data to the asset directory.
export function restoreCache(distDir?: string): void {
  if (!cacheDir || !assetDir) {
    initConfig(distDir)
    if (!existsSync(assetDir)) {
      fs.mkdirSync(assetDir, { recursive: true })
    }

    cacheDirExist = existsSync(cacheDir)
    if (!cacheDirExist) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
  }

  if (!cacheDirExist) {
    return
  }

  if (!existsSync(assetDir)) {
    fs.mkdirSync(assetDir, { recursive: true })
  }

  const files = fs.readdirSync(cacheDir)
  for (const file of files) {
    if (file.startsWith('nextra-data-')) {
      fs.copyFileSync(path.join(cacheDir, file), path.join(assetDir, file))
    }
  }
}
