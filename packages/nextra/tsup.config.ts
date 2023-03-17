import { defineConfig } from 'tsup'
import fs from 'node:fs/promises'
import path from 'node:path'

import tsconfig from './tsconfig.json'

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
      'src/**/*.tsx',
      '!src/**/*.d.ts',
      '!src/catch-all.ts'
    ],
    format: 'esm',
    dts: true,
    bundle: true,
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
              try {
                isDir = (
                  await fs.stat(path.join(args.resolveDir, args.path))
                ).isDirectory()
              } catch {
                isDir = false
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
    ],
    // import.meta is available only from es2020
    target: 'es2020'
  },
  {
    entry: ['src/types.ts'],
    name: 'nextra-types',
    dts: {
      only: true
    }
  }
])
