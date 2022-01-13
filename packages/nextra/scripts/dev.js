const esbuild = require('esbuild')
const package = require('../package.json')

console.log('Watching...')

// Build CJS entrypoints
esbuild.build({
  entryPoints: ['src/index.js', 'src/ssg.ts', 'src/locales.ts'],
  platform: 'node',
  bundle: true,
  format: 'cjs',
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
    'next/server',
    ...Object.keys(package.dependencies),
    ...Object.keys(package.peerDependencies || {})
  ]
})

// Build the loader as ESM
esbuild.build({
  entryPoints: ['src/loader.ts'],
  format: 'esm',
  platform: 'node',
  bundle: true,
  outfile: 'dist/loader.mjs',
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
  ].filter(d => d !== 'shiki')
})
