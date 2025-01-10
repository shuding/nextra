/* eslint-env node */
// https://github.com/mdx-js/mdx/blob/061cdbf440bd8193867fcef3f5a131c08e4fe469/packages/loader/index.cjs

/**
 * Webpack loader
 *
 * @todo once webpack supports ESM loaders, remove this wrapper.
 *
 * @this {import('webpack').LoaderContext}
 * @param {string} code
 * @return {Promise<void>}
 */
module.exports = async function loader(code) {
  const callback = this.async()

  try {
    // Note that `import()` caches, so this should be fast enough.
    const { loader } = await import('./dist/server/loader.js')
    const result = await loader.call(this, code)
    callback(null, result)
  } catch (error) {
    callback(error)
  }
}
