import path from 'path'
import { promises as fs } from 'graceful-fs'
import { getOptions } from 'loader-utils'
import grayMatter from 'gray-matter'
import slash from 'slash'

import filterRouteLocale from './filter-route-locale'
import { addStorkIndex } from './stork-index'
import { getLocaleFromFilename, removeExtension, getFileName, parseJsonFile } from './utils'

const extension = /\.(mdx?|jsx?|tsx?)$/
const mdxExtension = /\.mdx?$/
const metaExtension = /meta\.?([a-zA-Z-]+)?\.json/

async function getPageMap(currentResourcePath) {
  const activeRouteLocale = getLocaleFromFilename(currentResourcePath)
  let activeRoute = ''
  let activeRouteTitle = ''

  async function getFiles(dir, route) {
    const files = await fs.readdir(dir, { withFileTypes: true })
    let dirMeta = {}

    // go through the directory
    const items = (
      await Promise.all(
        files.map(async f => {
          const filePath = path.resolve(dir, f.name)
          const fileRoute = path.join(
            route,
            removeExtension(f.name).replace(/^index$/, '')
          )

          if (f.isDirectory()) {
            const children = await getFiles(filePath, fileRoute)
            if (!children.length) return null

            return {
              name: f.name,
              children,
              route: fileRoute
            }
          } else if (extension.test(f.name)) {
            const locale = getLocaleFromFilename(f.name)

            if (filePath === currentResourcePath) {
              activeRoute = fileRoute
            }
  
            // MDX or MD
            if (mdxExtension.test(f.name)) {
              const fileContents = await fs.readFile(filePath, 'utf-8')
              const { data } = grayMatter(fileContents)

              if (Object.keys(data).length) {
                return {
                  name: removeExtension(f.name),
                  route: fileRoute,
                  frontMatter: data,
                  locale
                }
              }
            }

            return {
              name: removeExtension(f.name),
              route: fileRoute,
              locale
            }
          } else if (metaExtension.test(f.name)) {
            const content = await fs.readFile(filePath, 'utf-8')
            const meta = parseJsonFile(content, filePath)
            const locale = f.name.match(metaExtension)[1]

            if (!activeRouteLocale || locale === activeRouteLocale) {
              dirMeta = meta
            }

            return {
              name: 'meta.json',
              meta,
              locale
            }
          }
        })
      )
    )
      .map(item => {
        if (!item) return
        if (item.route === activeRoute) {
          activeRouteTitle = dirMeta[item.name] || item.name
        }
        return { ...item }
      })
      .filter(Boolean)

    return items
  }

  return [await getFiles(path.join(process.cwd(), 'pages'), '/'), activeRoute, activeRouteTitle]
}

async function analyzeLocalizedEntries(currentResourcePath, defaultLocale) {	
  const filename = getFileName(currentResourcePath)	
  const dir = path.dirname(currentResourcePath)	

  const filenameRe = new RegExp('^' + filename + '.[a-zA-Z-]+.(mdx?|jsx?|tsx?|json)$')	
  const files = await fs.readdir(dir, { withFileTypes: true })	
  
  let hasSSR = false, hasSSG = false, defaultIndex = 0
  const filteredFiles = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!filenameRe.test(file.name)) continue

    const content = await fs.readFile(path.join(dir, file.name), 'utf-8')
    const locale = getLocaleFromFilename(file.name)

    // Note: this is definitely not correct, we have to use MDX tokenizer here.
    const exportSSR = /^export .+ getServerSideProps[=| |\(]/m.test(content)
    const exportSSG = /^export .+ getStaticProps[=| |\(]/m.test(content)

    hasSSR = hasSSR || exportSSR
    hasSSG = hasSSG || exportSSG

    if (locale === defaultLocale) defaultIndex = filteredFiles.length

    filteredFiles.push({	
      name: file.name,	
      locale,
      ssr: exportSSR,
      ssg: exportSSG
    })
  }

  return {
    ssr: hasSSR,
    ssg: hasSSG,
    files: filteredFiles,
    defaultIndex
  }
}

export default async function (source) {
  const callback = this.async()
  this.cacheable()

  const options = getOptions(this)
  const { theme, themeConfig, locales, defaultLocale } = options
  const { resourcePath, resourceQuery } = this
  const filename = resourcePath.slice(resourcePath.lastIndexOf('/') + 1)
  const fileLocale = getLocaleFromFilename(filename) || 'default'

  // Add the entire directory `pages` as the dependency
  // so we can generate the correct page map
  this.addContextDependency(path.resolve('pages'))

  // Generate the page map
  let [pageMap, route, title] = await getPageMap(resourcePath, locales)

  // Extract frontMatter information if it exists
  const { data, content } = grayMatter(source)

  // Remove frontMatter from the source
  source = content

  // Add content to stork indexes
  if (options.stork) {
    // We only index .MD and .MDX files
    if (mdxExtension.test(filename)) {
      await addStorkIndex({
        pageMap, filename, fileLocale, route, title, data, content, locales
      })
    }
  }

  // Check if there's a theme provided
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

  const notI18nEntry = resourceQuery.includes('nextra-raw')

  if (locales && !notI18nEntry) {	
    // We need to handle the locale router here
    const {
      files,
      defaultIndex,
      ssr,
      ssg
    } = await analyzeLocalizedEntries(resourcePath, defaultLocale)

    const i18nEntry = `	
import { useRouter } from 'next/router'	
${files	
  .map((file, index) => 
    `import Page_${index}${
      file.ssg || file.ssr ? `, { ${file.ssg ? 'getStaticProps' : 'getServerSideProps'} as page_data_${index} }` : ''
    } from './${file.name}?nextra-raw'`	
  )	
  .join('\n')}

export default function I18NPage (props) {	
  const { locale } = useRouter()	
  ${files
    .map((file, index) => 
      `if (locale === '${file.locale}') {
    return <Page_${index} {...props}/>
  } else `
    )	
    .join('')} {	
    return <Page_${defaultIndex} {...props}/>	
  }
}

${ssg || ssr ? `export async function ${ssg ? 'getStaticProps' : 'getServerSideProps'} (context) {
  const locale = context.locale
  ${files
    .map((file, index) => 
      `if (locale === '${file.locale}' && ${ssg ? file.ssg : file.ssr}) {
    return page_data_${index}(context)
  } else `
    )	
    .join('')} {	
    return { props: {} }
  }
}` : ''}
`

    return callback(null, i18nEntry)	
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
