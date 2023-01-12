/* eslint-env node */
// https://github.com/mdx-js/mdx/blob/061cdbf440bd8193867fcef3f5a131c08e4fe469/packages/loader/index.cjs

/**
 * Webpack loader
 *
 * @todo once webpack supports ESM loaders, remove this wrapper.
 *
 * @param {string} code
 */
module.exports = function (code) {
  const callback = this.async()
  // Note that `import()` caches, so this should be fast enough.
  import('./dist/loader.mjs').then(mod =>
    mod.default.call(this, code, callback)
  )
}
