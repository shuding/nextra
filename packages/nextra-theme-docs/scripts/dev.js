const esbuild = require('esbuild')
const package = require('../package.json')

console.log('Watching...')

esbuild.build({
  entryPoints: ['src/index.js', 'src/bleed.tsx', 'src/callout.tsx'],
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
