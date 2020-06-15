import preval from 'preval.macro'

const excludes = ['/_app.js', '/_document.js', '/_error.js']

const items = preval`
  const { resolve, join } = require('path')
  const { readdirSync, readFileSync } = require('fs')
  const title = require('title')
  
  const extension = /(\.mdx?)$/

  function getFiles(dir, route) {
    const files = readdirSync(dir, { withFileTypes: true })

    // contains orders and titles
    let meta = null
    let fnames = null
    
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
          meta = JSON.parse(readFileSync(filePath))
          fnames = Object.keys(meta)
          return null
        } else if (extension.test(f.name)) {
          return { name: f.name.replace(extension, ''), route: fileRoute }
        }
      })
      .map(item => {
        if (!item) return
        if (meta) {
          if (!meta[item.name]) return
          return { ...item, title: meta[item.name] }
        } else {
          return { ...item, title: title(item.name) }
        }
        return item
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (meta) {
          return fnames.indexOf(a.name) - fnames.indexOf(b.name)
        }
        // by default, we put directories first
        if (!!a.children !== !!b.children) {
          return !!a.children ? -1 : 1
        }
        // sort by file name
        return a.name < b.name ? -1 : 1
      })

    return items
  }
  module.exports = getFiles(join(process.cwd(), 'pages'), '/')
`

export default () => items.filter(item => !excludes.includes(item.name))
