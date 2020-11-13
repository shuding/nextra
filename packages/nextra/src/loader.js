import path from 'path'
import fs from 'fs'
import { getOptions } from 'loader-utils'
import grayMatter from 'gray-matter'
import slash from 'slash'

function getPageMap(currentResourcePath) {
  const extension = /\.(mdx?|jsx?)$/
  const mdxExtension = /\.mdx?$/
  const metaExtension = /meta\.json$/
  let activeRoute = ''

  function getFiles(dir, route) {
    const files = fs.readdirSync(dir, { withFileTypes: true })

    // go through the directory
    const items = files
      .map((f) => {
        const filePath = path.resolve(dir, f.name)
        const fileRoute = path.join(
          route,
          f.name.replace(extension, '').replace(/^index$/, '')
        )

        if (filePath === currentResourcePath) {
          activeRoute = fileRoute
        }

        if (f.isDirectory()) {
          const children = getFiles(filePath, fileRoute)
          if (!children.length) return null
          return { name: f.name, children, route: fileRoute }
        } else if (extension.test(f.name)) {
          // MDX or MD
          if (mdxExtension.test(f.name)) {
            const fileContents = fs.readFileSync(filePath, 'utf-8')
            const { data } = grayMatter(fileContents)

            if (Object.keys(data).length) {
              return {
                name: f.name.replace(extension, ''),
                route: fileRoute,
                frontMatter: data
              }
            }
          }
          return { name: f.name.replace(extension, ''), route: fileRoute }
        } else if (metaExtension.test(f.name)) {
          const meta = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
          return { name: f.name.replace(extension, ''), route: fileRoute, meta }
        }
      })
      .map((item) => {
        if (!item) return
        return { ...item }
      })
      .filter(Boolean)

    return items
  }

  return [getFiles(path.join(process.cwd(), 'pages'), '/'), activeRoute]
}

export default function (source, map) {
  this.cacheable()

  const options = getOptions(this)
  const { theme, themeConfig } = options

  // Add the entire directory `pages` as the dependency
  // so we can generate the correct page map
  this.addContextDependency(path.resolve('pages'))

  // Generate the page map
  const [pageMap, route] = getPageMap(this.resourcePath)

  // Extract frontMatter information if it exists
  const { data, content } = grayMatter(source)

  // Remove frontMatter from the source
  source = content

  if (!theme) {
    console.warn('No Nextra theme found!')
    this.callback(null, source, map)
    return
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

  const prefix = `import withLayout from '${layout}'\nimport { withSSG } from 'nextra/ssg'\n${
    layoutConfig ? `import layoutConfig from '${layoutConfig}'\n` : ''
  }\n`
  const suffix = `\n\nexport default withSSG(withLayout({
    filename: "${slash(filename)}",
    route: "${slash(route)}",
    meta: ${JSON.stringify(data)},
    pageMap: ${JSON.stringify(pageMap)}
  }, ${layoutConfig ? 'layoutConfig' : 'null'}))`

  // Add imports and exports to the source
  source = prefix + source + suffix

  this.callback(null, source, map)
}
