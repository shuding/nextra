import path from 'path'
import gracefulFs from 'graceful-fs'
import cp from 'child_process'
import { promisify } from 'util'
import download from 'download'
import { Title } from './types'
// import remark from 'remark'
// import strip from 'strip-markdown'

const { promises: fs, statSync, mkdirSync } = gracefulFs
const execFile = promisify(cp.execFile)
const isProduction = process.env.NODE_ENV === 'production'

const STORK_WASM =
  'https://github.com/jameslittle230/stork/releases/download/v1.1.0/stork.wasm'

const files: Record<string, Record<string, any>> = {}
const escapeQuote = (str: string | { [key: string]: string; title: string }) =>
  typeof str === 'string'
    ? str.replace(/"/g, '\\"')
    : str.title.replace(/"/g, '\\"')

const getStemmingLanguage = (locale: string) => {
  // en, en-US
  if (locale.toLowerCase().startsWith('en')) {
    return 'English'
  }
  return 'None'
}

const getPlainText = async (content: string) => {
  // let plainText = ''

  // await remark()
  //   .use(strip)
  //   .use(() => tree => {
  //     for (let i = 0; i < tree.children.length; i++) {
  //       try {
  //         const value = tree.children[i].children[0].value
  //         if (/^(import|export) /.test(value)) {
  //           continue
  //         }
  //         plainText += value + '\n'
  //       } catch (e) {}
  //     }
  //   })
  //   .process(content)

  // return plainText
  return content
}

interface Param {
  fileLocale: string
  route: string
  title: Title
  data: Record<string, any>
  content: string
}

export async function addStorkIndex({
  fileLocale,
  route,
  title,
  data,
  content
}: Param) {
  if (!isProduction) return

  if (!files[fileLocale])
    files[fileLocale] = {
      toml:
        `[input]\n` +
        `minimum_indexed_substring_length = 2\n` +
        `title_boost = "Ridiculous"\n` +
        `stemming = "${getStemmingLanguage(fileLocale)}"\n\n`
    }
  if (!files[fileLocale][route]) {
    const plainText = await getPlainText(content)
    files[fileLocale][route] = true
    files[fileLocale].toml += `[[input.files]]\n`
    files[fileLocale].toml += `title = "${escapeQuote(data.title || title)}"\n`
    files[fileLocale].toml += `url = "${escapeQuote(route)}"\n`
    files[fileLocale].toml += `contents = "${escapeQuote(
      plainText.replace(/\n/g, '\\n')
    )}"\n`
    files[fileLocale].toml += `filetype = "PlainText"`
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
export async function buildStorkIndex(storkPath: string, locales: string[]) {
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
    toml += `excerpts_per_result = 1\n`
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
