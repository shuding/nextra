const esbuild = require('esbuild')
const packageJson = require('../package.json')

const IS_DEV = process.argv[2] === '--dev'

if (IS_DEV) {
  console.log('Watching...')
}

esbuild.build({
  entryPoints: [
    'src/index.tsx',
    'src/bleed.tsx',
    'src/callout.tsx',
    'src/components/tabs.tsx'
  ],
  format: 'esm',
  bundle: true,
  loader: {
    '.js': 'jsx'
  },
  platform: 'node',
  outdir: 'dist',
  color: true,
  target: 'es2016',
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies || {})
  ],
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
})
