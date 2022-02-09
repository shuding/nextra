import fs from 'graceful-fs'
import path from 'path'

const { statSync, mkdirSync } = fs

const cacheDir = path.join(process.cwd(), '.next', 'cache')
const assetDir = path.join(process.cwd(), '.next', 'static', 'chunks')

const asset: { [locale: string]: any } = {}
const cached: Map<string, boolean> = new Map()

try {
  statSync(assetDir)
} catch (err) {
  mkdirSync(assetDir, { recursive: true })
}

let cacheDirExist = false
try {
  statSync(cacheDir)
  cacheDirExist = true
} catch (err) {}

function initFromCache(filename: string) {
  if (!cached.has(filename)) {
    try {
      const content = fs.readFileSync(path.join(assetDir, filename)).toString()
      cached.set(filename, true)
      return JSON.parse(content)
    } catch (err) {
      cached.set(filename, false)
    }
  }
  return {}
}

export async function addPage({
  fileLocale,
  route,
  title,
  data,
  structurizedData
}: {
  fileLocale: string
  route: string
  title: string
  data: any
  structurizedData: any
}) {
  const dataFilename = `nextra-data-${fileLocale}.json`

  if (!asset[fileLocale]) {
    asset[fileLocale] = initFromCache(dataFilename)
  }
  asset[fileLocale][route] = {
    title: title || data.title,
    data: structurizedData
  }

  // To prevent race conditions, we temporarily use the sync method to flush.
  // @TODO: introduce mutex lock, or only generate the asset when finishing the
  // entire build.
  const content = JSON.stringify(asset[fileLocale])
  fs.writeFileSync(path.join(assetDir, dataFilename), content)
  fs.writeFileSync(path.join(cacheDir, dataFilename), content)
}

// Copy cached data to the asset directory.
export async function restoreCache() {
  if (cacheDirExist) {
    try {
      statSync(assetDir)
    } catch (err) {
      mkdirSync(assetDir, { recursive: true })
    }

    const files = fs.readdirSync(cacheDir)
    for (const file of files) {
      if (file.startsWith('nextra-data-')) {
        fs.copyFileSync(path.join(cacheDir, file), path.join(assetDir, file))
      }
    }
  }
}
