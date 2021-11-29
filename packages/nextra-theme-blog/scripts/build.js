const esbuild = require('esbuild')
const package = require('../package.json')

esbuild.buildSync({
  entryPoints: ['src/index.js'],
  format: 'esm',
  bundle: true,
  loader: {
    '.js': 'jsx'
  },
  platform: 'node',
  outdir: 'dist',
  color: true,
  external: [
    ...Object.keys(package.dependencies),
    ...Object.keys(package.peerDependencies || {})
  ]
})
