import gracefulFs from 'graceful-fs'
import path from 'path'

const { promises: fs, statSync, mkdirSync } = gracefulFs

const assetDir = path.join(process.cwd(), 'public', '.nextra')
const asset: { [locale: string]: any } = {}

try {
  statSync(assetDir)
} catch (err) {
  mkdirSync(assetDir)
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
  if (!asset[fileLocale]) {
    asset[fileLocale] = {}
  }
  asset[fileLocale][route] = {
    title: title || data.title,
    data: structurizedData
  }
  const dataFile = path.join(assetDir, `data-${fileLocale}.json`)
  await fs.writeFile(dataFile, JSON.stringify(asset[fileLocale]))
}
