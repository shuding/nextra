const esbuild = require('esbuild')
const packageJson = require('../package.json')

const IS_DEV = process.argv[2] === '--dev'

if (IS_DEV) {
  console.log('Watching...')
}

const BUILD_OPTIONS = {
  platform: 'node',
  bundle: true,
  color: true,
  target: 'es2016',
  ...(IS_DEV && {
    watch: {
      onRebuild(error) {
        if (error) {
          console.error('Watch build failed:', error)
        } else {
          console.log('Watch build succeeded.')
        }
      }
    }
  })
}

const externalDeps = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies || {})
]

// Build CJS entrypoints
esbuild.build({
  ...BUILD_OPTIONS,
  entryPoints: [
    'src/index.js',
    'src/ssg.ts',
    'src/locales.ts',
    'src/context.ts'
  ],
  format: 'cjs',
  outdir: 'dist',
  external: ['next/server', ...externalDeps]
})

// Build the loader as ESM
esbuild.build({
  ...BUILD_OPTIONS,
  entryPoints: ['src/loader.ts'],
  format: 'esm',
  outfile: 'dist/loader.mjs',
  external: externalDeps.filter(d => d !== 'shiki')
})

// Build compile as ESM
esbuild.build({
  ...BUILD_OPTIONS,
  entryPoints: ['src/compile.ts'],
  format: 'esm',
  outfile: 'dist/compile.mjs',
  external: externalDeps
})
