const esbuild = require('esbuild')
const packageJson = require('../package.json')

const BUILD_OPTIONS = {
  platform: 'node',
  bundle: true,
  color: true,
  target: 'es2016'
}

const externalDeps = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies || {})
]

// Build CJS entrypoints
esbuild.buildSync({
  ...BUILD_OPTIONS,
  entryPoints: [
    'src/index.ts',
    'src/ssg.ts',
    'src/locales.ts',
    'src/context.ts'
  ],
  format: 'cjs',
  outdir: 'dist',
  external: ['next/server', ...externalDeps]
})

// Build the loader as ESM
esbuild.buildSync({
  ...BUILD_OPTIONS,
  entryPoints: ['src/loader.ts'],
  format: 'esm',
  outfile: 'dist/loader.mjs',
  external: externalDeps.filter(d => d !== 'shiki')
})

// Build compile as ESM
esbuild.buildSync({
  ...BUILD_OPTIONS,
  entryPoints: ['src/compile.ts'],
  format: 'esm',
  outfile: 'dist/compile.mjs',
  external: externalDeps
})
