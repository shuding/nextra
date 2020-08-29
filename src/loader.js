import path from 'path'
import { getOptions } from 'loader-utils'
import grayMatter from 'gray-matter'

export default function (source, map) {
  this.cacheable()

  const options = getOptions(this)
  const { theme } = options

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

  // Relative path instead of a package name
  if (theme.startsWith('.') || theme.startsWith('/')) {
    layout = path.resolve(theme)
  }

  const fileName = this.resourcePath.slice(
    this.resourcePath.lastIndexOf('/') + 1
  )
  const prefix = `import withLayout from '${layout}'\nimport { withSSG } from 'nextra/ssg'\n\n`
  const suffix = `\n\nexport default withSSG(withLayout({
    fileName: "${fileName}",
    frontMatter: ${JSON.stringify(data)}
  }))`

  // Add imports and exports to the source
  source = prefix + source + suffix

  this.callback(null, source, map)
}
