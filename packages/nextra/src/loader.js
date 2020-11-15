import path from 'path'
import { promises as fs } from 'fs'
import { getOptions } from 'loader-utils'
import grayMatter from 'gray-matter'
import slash from 'slash'

function getLocalFromFilename (name) {
  const localeRegex = /\.([a-zA-Z-]+)?\.(mdx?|jsx?|json)$/
  const match = name.match(localeRegex)
  if (match) return match[1]
  return undefined
}

function removeExtension (name) {
  return name.match(/^([^.]+)/)[1]
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
                    locale: getLocalFromFilename(f.name)
                  }
                }
              }

              return {
                name: removeExtension(f.name),
                route: fileRoute, 
                locale: getLocalFromFilename(f.name)
              }
            } else if (metaExtension.test(f.name)) {
              const meta = JSON.parse(await fs.readFile(filePath, 'utf-8'))
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

export default async function (source) {
  const callback = this.async()

  this.cacheable()

  const options = getOptions(this)
  const { theme, themeConfig, locales } = options

  // Add the entire directory `pages` as the dependency
  // so we can generate the correct page map
  this.addContextDependency(path.resolve('pages'))

  // Generate the page map
  const [pageMap, route] = await getPageMap(this.resourcePath, locales)

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
      pageMap: ${JSON.stringify(pageMap)},
      locales: ${JSON.stringify(locales)}
    }, ${layoutConfig ? 'layoutConfig' : 'null'}))(props)
}`

  // Add imports and exports to the source
  source = prefix + '\n' + source + '\n' + suffix

  return callback(null, source)
}
