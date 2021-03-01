import path from 'path'
import { promises as fs, statSync, mkdirSync } from 'graceful-fs'
import cp from 'child_process'
import { promisify } from 'util'
import download from 'download'

const execFile = promisify(cp.execFile)
const isProduction = process.env.NODE_ENV === 'production'

const STORK_WASM = 'https://github.com/jameslittle230/stork/releases/download/v1.1.0/stork.wasm'

const files = {}
const escapeQuote = str => str.replace(/"/g, '\\"')

export async function addStorkIndex ({
  fileLocale, route, title, data, content
}) {
  if (!isProduction) return

  if (!files[fileLocale]) files[fileLocale] = {
    toml: '[input]\nminimum_indexed_substring_length=1\n\n'
  }
  if (!files[fileLocale][route]) {
    files[fileLocale][route] = true
    files[fileLocale].toml += `[[input.files]]\n`
    files[fileLocale].toml += `title = "${escapeQuote(data.title || title)}"\n`
    files[fileLocale].toml += `url = "${escapeQuote(route)}"\n`
    files[fileLocale].toml += `contents = "${escapeQuote(content.replace(/\n/g, ' '))}"\n`
    files[fileLocale].toml += `filetype = "PlainText"\n`
    files[fileLocale].toml += `\n`

    const assetDir = path.join(process.cwd(), 'public')
    const tomlFile = path.join(assetDir, `index-${fileLocale}.toml`)
    try {
      statSync(assetDir)
    } catch (err) {
      mkdirSync(assetDir)
    }
    await fs.writeFile(tomlFile, files[fileLocale].toml)
  }
}

let indexed = false
export async function buildStorkIndex (storkPath, locales) {
  if (indexed) return
  if (!isProduction) return

  indexed = true
  const assetDir = path.join(process.cwd(), 'public')

  locales = locales || ['default']
  for (const locale of locales) {
    const tomlFile = path.join(assetDir, `index-${locale}.toml`)
    let toml = await fs.readFile(tomlFile, 'utf-8')
    toml += '[output]\n'
    toml += `filename = "${path.join(assetDir, `index-${locale}.st`)}"\n`
    await fs.writeFile(tomlFile, toml)

    await execFile(storkPath, ['--build', tomlFile])
    console.log(`Finished Stork index for locale: ${locale}`)
  }

  // download wasm
  const storkWasmPath = path.join(assetDir, 'stork.wasm')
  try {
    statSync(storkWasmPath)
  } catch (err) {
    console.log('No stork.wasm found, downloading from GitHub...')
    await download(STORK_WASM, assetDir)
  }
}
