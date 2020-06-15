module.exports = function(source, map) {
  this.cacheable()
  const prefix = `import NextraLayout from '.nextra/layout'\n\n`
  const suffix = `\n\nexport default NextraLayout`
  source = prefix + source + suffix
  this.callback(null, source, map)
}
