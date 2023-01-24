/* eslint-env node */
const { listFiles } = require('../../../components/remote-utils')
const { createCatchAllMeta } = require('nextra/catch-all')

module.exports = async () => {
  const files = await listFiles({
    repo: 'https://github.com/dotansimha/graphql-yoga',
    rootDir: 'website/src/pages/docs/'
  })
  return createCatchAllMeta(
    // Ensure you didn't forget define some file by providing all paths of remote files
    files,
    // Next you can override the order of your meta files, folders should have `type: 'folder'` and have `items` property
    {
      '*': {
        theme: {
          timestamp: false
        }
      },
      index: 'Quick Start',
      features: {
        title: '🚀 FeAtuReS',
        type: 'folder',
        items: {
          schema: 'GraphQL Schema',
          graphiql: 'GraphiQL',
          context: 'GraphQL Context',
          'error-masking': '',
          introspection: '',
          subscriptions: '',
          'file-uploads': '',
          'defer-stream': 'Defer and Stream',
          'request-batching': '',
          cors: 'CORS',
          'csrf-prevention': 'CSRF Prevention',
          'parsing-and-validation-caching': '',
          'response-caching': '',
          'persisted-operations': '',
          'automatic-persisted-queries': '',
          'logging-and-debugging': '',
          'health-check': '',
          'sofa-api': 'REST API',
          'apollo-federation': '',
          'envelop-plugins': 'Plugins'
        }
      },
      integrations: {
        type: 'folder'
      },
      migration: {
        type: 'folder'
      }
    }
  )
}
