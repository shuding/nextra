import path from 'path'
import { promises as fs } from 'fs'
import { getOptions } from 'loader-utils'
import grayMatter from 'gray-matter'
import slash from 'slash'

import filterRouteLocale from './filter-route-locale'

function getLocaleFromFilename (name) {
  const localeRegex = /\.([a-zA-Z-]+)?\.(mdx?|jsx?|json)$/
  const match = name.match(localeRegex)
  if (match) return match[1]
  return undefined
}

function removeExtension (name) {
  return name.match(/^([^.]+)/)[1]
}

function getFileName (resourcePath) {
  return removeExtension(path.basename(resourcePath))
}

const parseJsonFile = (content, path) => {
  let parsed
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    console.error(`Error parsing ${path}, make sure it's a valid JSON \n` + err)
  }

  return parsed
}

async function getPageMap(currentResourcePath) {
  const extension = /\.(mdx?|jsx?)$/
  const mdxExtension = /\.mdx?$/
  const metaExtension = /meta\.?([a-zA-Z-]+)?\.json/
  let activeRoute = ''

  async function getFiles(dir, route) {
    const files = await fs.readdir(dir, { withFileTypes: true })

    // go through the directory
    const items =
      (await Promise.all(
        files
          .map(async f => {
            const filePath = path.resolve(dir, f.name)
            const fileRoute = path.join(
              route,
              removeExtension(f.name).replace(/^index$/, '')
            )

            if (filePath === currentResourcePath) {
              activeRoute = fileRoute
            }

            if (f.isDirectory()) {
              const children = await getFiles(filePath, fileRoute)
              if (!children.length) return null

              return {
                name: f.name,
                children,
                route: fileRoute
              }
            } else if (extension.test(f.name)) {
              // MDX or MD
              if (mdxExtension.test(f.name)) {
                const fileContents = await fs.readFile(filePath, 'utf-8')
                const { data } = grayMatter(fileContents)

                if (Object.keys(data).length) {
                  return {
                    name: removeExtension(f.name),
                    route: fileRoute,
                    frontMatter: data,
                    locale: getLocaleFromFilename(f.name)
                  }
                }
              }

              return {
                name: removeExtension(f.name),
                route: fileRoute,
                locale: getLocaleFromFilename(f.name)
              }
            } else if (metaExtension.test(f.name)) {
              const content = await fs.readFile(filePath, 'utf-8')
              const meta = parseJsonFile(content, filePath)

              const locale = f.name.match(metaExtension)[1]

              return {
                name: 'meta.json',
                meta,
                locale
              }
            }
          })
      ))
      .map((item) => {
        if (!item) return
        return { ...item }
      })
      .filter(Boolean)

    return items
  }

  return [await getFiles(path.join(process.cwd(), 'pages'), '/'), activeRoute]
}

async function getLocalizedEntries(currentResourcePath) {
  const filename = getFileName(currentResourcePath)
  const dir = path.dirname(currentResourcePath)

  const fileRe = new RegExp('^' + filename + '\.[a-zA-Z-]+\.(mdx?|jsx?|json)$')

  const files = await fs.readdir(dir, { withFileTypes: true })
  return files.filter(file => {
    return fileRe.test(file.name)
  }).map(file => {
    return {
      name: file.name,
      locale: getLocaleFromFilename(file.name)
    }
  })
}

export default async function (source) {
  const callback = this.async()

  this.cacheable()

  const options = getOptions(this)
  const { theme, themeConfig, locales, defaultLocale } = options

  // Add the entire directory `pages` as the dependency
  // so we can generate the correct page map
  this.addContextDependency(path.resolve('pages'))

  // Generate the page map
  let [pageMap, route] = await getPageMap(this.resourcePath, locales)

  // Extract frontMatter information if it exists
  const { data, content } = grayMatter(source)

  // Remove frontMatter from the source
  source = content

  if (!theme) {
    console.error('No Nextra theme found!')
    return callback(null, source)
  }

  let layout = theme
  let layoutConfig = themeConfig || null

  // Relative path instead of a package name
  if (theme.startsWith('.') || theme.startsWith('/')) {
    layout = path.resolve(theme)
  }
  if (layoutConfig) {
    layoutConfig = slash(path.resolve(layoutConfig))
  }

  const filename = this.resourcePath.slice(
    this.resourcePath.lastIndexOf('/') + 1
  )

  const notI18nEntry = this.resourceQuery.includes('nextra-raw')
  if (locales && !notI18nEntry) {
    // we need to handle i18n here

    const i18nFiles = await getLocalizedEntries(this.resourcePath)
    let defaultLocaleIndex = 0

    const i18nSwitcher = `
import { useRouter } from 'next/router'
${
  i18nFiles.map((file, index) => {
    if (file.locale === defaultLocale) {
      defaultLocaleIndex = index
    }
    return `import Page_${index} from './${file.name}?nextra-raw'`
  }).join('\n')
}

export default function I18NPage () {
  const { locale } = useRouter()
  ${
  i18nFiles.map((file, index) => {
    return `if (locale === '${file.locale}') {
    return <Page_${index}/>
  } else `
  }).join('')
} {
    return <Page_${defaultLocaleIndex}/>
  }
}`

    return callback(null, i18nSwitcher)
  }

  if (locales) {
    const locale = getLocaleFromFilename(filename)
    if (locale) {
      pageMap = filterRouteLocale(pageMap, locale, defaultLocale)
    }
  }

  const prefix = `
import withLayout from '${layout}'
import { withSSG } from 'nextra/ssg'
${layoutConfig ? `import layoutConfig from '${layoutConfig}'` : ''}

`

  const suffix = `\n\nexport default function NextraPage (props) {
    return withSSG(withLayout({
      filename: "${slash(filename)}",
      route: "${slash(route)}",
      meta: ${JSON.stringify(data)},
      pageMap: ${JSON.stringify(pageMap)}
    }, ${layoutConfig ? 'layoutConfig' : 'null'}))(props)
}`

  // Add imports and exports to the source
  source = prefix + '\n' + source + '\n' + suffix

  return callback(null, source)
}
