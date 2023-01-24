/* eslint-env node */
const { listFiles } = require('../../../components/remote-utils')
const { createCatchAllMeta } = require('nextra/catch-all')

module.exports = async () => {
  const files = await listFiles({
    repo: 'https://github.com/B2o5T/graphql-eslint',
    rootDir: 'website/src/pages/docs/'
  })
  return createCatchAllMeta(
    // Ensure you didn't forget define some file by providing all paths of remote files
    files,
    // Next you can override the order of your meta files, folders should have `type: 'folder'` and have `items` property
    {
      index: {
        title: 'Introduction',
        theme: {
          toc: false
        }
      },
      'getting-started': {
        type: 'folder',
        title: '🦄 GETTING Started',
        items: {
          parser: ''
        }
      }
    }
  )
}
