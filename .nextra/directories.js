import preval from 'preval.macro'
import title from 'title'

const excludes = ['/_app.js', '/_document.js', '/_error.js']

// watch all meta files
const meta = {}
function importAll(r) {
  return r.keys().forEach(key => {
    meta[key.slice(1)] = r(key)
  })
}
importAll(require.context('../pages/', true, /meta\.json$/))

// use macro to load the file list
const items = preval`
  const { readdirSync, readFileSync } = require('fs')
  const { resolve, join } = require('path')
  const extension = /\.(mdx?|jsx?)$/
  
  function getFiles(dir, route) {
    const files = readdirSync(dir, { withFileTypes: true })

    // go through the directory
    const items = files
      .map(f => {
        const filePath = resolve(dir, f.name)
        const fileRoute = join(route, f.name.replace(extension, '').replace(/^index$/, ''))

        if (f.isDirectory()) {
          const children = getFiles(filePath, fileRoute)
          if (!children.length) return null
          return { name: f.name, children, route: fileRoute }
        } else if (f.name === 'meta.json') {
          return null
        } else if (extension.test(f.name)) {
          return { name: f.name.replace(extension, ''), route: fileRoute }
        }
      })
      .map(item => {
        if (!item) return
        return { ...item, metaPath: join(route, 'meta.json') }
      })
      .filter(Boolean)

    return items
  }
  module.exports = getFiles(join(process.cwd(), 'pages'), '/')
`

const attachPageConfig = function (items) {
  let folderMeta = null
  let fnames = null

  return items
    .filter(item => !excludes.includes(item.name))
    .map(item => {
      const { metaPath, ...rest } = item
      folderMeta = meta[metaPath]
      if (folderMeta) {
        fnames = Object.keys(folderMeta)
      }

      const pageConfig = folderMeta?.[item.name]

      if (rest.children) rest.children = attachPageConfig(rest.children)

      if (pageConfig) {
        if (typeof pageConfig === 'string') {
          return { ...rest, title: pageConfig }
        }
        return { ...rest, ...pageConfig }
      } else {
        if (folderMeta) {
          return null
        }
        return { ...rest, title: title(item.name) }
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (folderMeta) {
        return fnames.indexOf(a.name) - fnames.indexOf(b.name)
      }
      // by default, we put directories first
      if (!!a.children !== !!b.children) {
        return !!a.children ? -1 : 1
      }
      // sort by file name
      return a.name < b.name ? -1 : 1
    })
}

export default () => {
  return attachPageConfig(items)
}
