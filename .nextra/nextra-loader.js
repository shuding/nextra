module.exports = function(source, map) {
  this.cacheable()
  const fileName = this.resourcePath.slice(this.resourcePath.lastIndexOf('/') + 1)
  const prefix = `import withNextraLayout from '.nextra/layout'\n\n`
  const suffix = `\n\nexport default withNextraLayout("${fileName}")`
  source = prefix + source + suffix
  this.callback(null, source, map)
}
