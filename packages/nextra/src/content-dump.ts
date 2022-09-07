import path from 'node:path'
import fs from 'graceful-fs'
import { existsSync } from './file-system'
import { ASSET_DIR, CACHE_DIR } from './constants'

const asset: { [locale: string]: any } = Object.create(null)
const cached = new Map<string, boolean>()

if (!existsSync(ASSET_DIR)) {
  fs.mkdirSync(ASSET_DIR, { recursive: true })
}

const cacheDirExist = existsSync(CACHE_DIR)
if (!cacheDirExist) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

function initFromCache(filename: string) {
  if (!cached.has(filename)) {
    try {
      const content = fs.readFileSync(path.join(ASSET_DIR, filename), 'utf8')
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
  structurizedData
}: {
  locale: string
  route: string
  title: string
  structurizedData: any
}): void {
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
  fs.writeFileSync(path.join(ASSET_DIR, dataFilename), content)
  fs.writeFileSync(path.join(CACHE_DIR, dataFilename), content)
}

// Copy cached data to the asset directory.
export function restoreCache(): void {
  if (!cacheDirExist) {
    return
  }
  if (!existsSync(ASSET_DIR)) {
    fs.mkdirSync(ASSET_DIR, { recursive: true })
  }

  const files = fs.readdirSync(CACHE_DIR)
  for (const file of files) {
    if (file.startsWith('nextra-data-')) {
      fs.copyFileSync(path.join(CACHE_DIR, file), path.join(ASSET_DIR, file))
    }
  }
}
