const esbuild = require('esbuild')
const package = require('../package.json')

console.log('Watching...')

// Build CJS entrypoints
esbuild.build({
  entryPoints: ['src/index.js', 'src/ssg.js'],
  platform: 'node',
  bundle: true,
  format: 'cjs',
  outdir: 'dist',
  color: true,
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

// Build the loader as ESM
esbuild.build({
  entryPoints: ['src/loader.js'],
  format: 'esm',
  platform: 'node',
  bundle: true,
  outfile: 'dist/loader.mjs',
  color: true,
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
