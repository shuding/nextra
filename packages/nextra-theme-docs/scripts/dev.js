const esbuild = require('esbuild')
const package = require('../package.json')
const entry = require('./entry')
console.log('Watching...')

esbuild.build({
  entryPoints: entry,
  format: 'esm',
  bundle: true,
  loader: {
    '.js': 'jsx'
  },
  platform: 'node',
  outdir: 'dist',
  color: true,
  target: 'es2016',
  watch: {
    onRebuild(error) {
      if (error) console.error('Watch build failed:', error)
      else console.log('Watch build succeeded.')
    }
  },
  external: [
    ...Object.keys(package.dependencies),
    ...Object.keys(package.peerDependencies || {})
  ]
})
