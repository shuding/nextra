const esbuild = require('esbuild')
const package = require('../package.json')

// Build CJS entrypoints
esbuild.buildSync({
  entryPoints: ['src/index.js', 'src/ssg.js'],
  platform: 'node',
  bundle: true,
  format: 'cjs',
  outdir: 'dist',
  color: true,
  target: 'es2016',
  external: [
    ...Object.keys(package.dependencies),
    ...Object.keys(package.peerDependencies || {})
  ]
})

// Build the loader as ESM
esbuild.buildSync({
  entryPoints: ['src/loader.js'],
  format: 'esm',
  bundle: true,
  platform: 'node',
  outfile: 'dist/loader.mjs',
  color: true,
  target: 'es2016',
  external: [
    ...Object.keys(package.dependencies),
    ...Object.keys(package.peerDependencies || {})
  ]
})
