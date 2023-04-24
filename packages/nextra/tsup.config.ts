import { defineConfig } from 'tsup'
import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'

import tsconfig from './tsconfig.json'

const CLIENT_ENTRY = [
  'src/{use-internals,mdx,setup-page,normalize-pages}.ts',
  'src/{ssg,layout}.tsx',
  'src/{components,hooks,icons}/*.{ts,tsx}'
]

const entries = fg.sync(CLIENT_ENTRY, { absolute: true })
const entriesSet = new Set(entries)

const sharedConfig = defineConfig({
  // import.meta is available only from es2020
  target: 'es2020',
  format: 'esm',
  dts: true,
  splitting: false,
  external: ['shiki', './__temp__', 'webpack'],
  esbuildPlugins: [
    // https://github.com/evanw/esbuild/issues/622#issuecomment-769462611
    {
      name: 'add-mjs',
      setup(build) {
        build.onResolve({ filter: /.*/ }, async args => {
          if (
            args.importer &&
            args.path.startsWith('.') &&
            !args.path.endsWith('.json')
          ) {
            let isDir: boolean
            const importPath = path.join(args.resolveDir, args.path)
            try {
              isDir = (await fs.stat(importPath)).isDirectory()
            } catch {
              isDir = false
            }

            const isClientImporter = entriesSet.has(args.importer)

            if (isClientImporter) {
              const isClientImport = entries.some(entry =>
                entry.startsWith(importPath)
              )
              if (isClientImport) {
                return { path: args.path, external: true }
              }
            }

            if (isDir) {
              // it's a directory
              return { path: args.path + '/index.mjs', external: true }
            }
            return { path: args.path + '.mjs', external: true }
          }
        })
      }
    }
  ]
})

export default defineConfig([
  {
    name: 'nextra',
    entry: ['src/index.js', 'src/__temp__.js', 'src/catch-all.ts'],
    format: 'cjs',
    dts: false,
    target: tsconfig.compilerOptions.target as 'es2016'
  },
  {
    name: 'nextra-esm',
    entry: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/catch-all.ts',
      ...CLIENT_ENTRY.map(filePath => `!${filePath}`)
    ],
    ...sharedConfig
  },
  {
    name: 'nextra-client',
    entry: CLIENT_ENTRY,
    outExtension: () => ({ js: '.js' }),
    ...sharedConfig
  },
  {
    entry: ['src/types.ts'],
    name: 'nextra-types',
    dts: { only: true }
  }
])
