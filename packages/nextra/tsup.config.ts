import fs from 'fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'
import { CWD } from './src/server/constants.js'

export default defineConfig([
  {
    name: 'nextra-esm',
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/types.ts',
      '!src/client/icons/**/*'
    ],
    target: 'es2020',
    format: 'esm',
    dts: true,
    splitting: false,
    bundle: false,
    external: ['shiki', 'webpack'],
    async onSuccess() {
      // Fixes hydration errors in client apps due "type": "module" in root package.json
      const clientPackageJSON = path.join(CWD, 'dist', 'client', 'package.json')
      await fs.writeFile(clientPackageJSON, '{"sideEffects":false}')
    }
  },
  {
    name: 'nextra-icons',
    entry: {
      'client/icons/index': 'src/client/icons/index.ts'
    },
    esbuildPlugins: [
      // @ts-expect-error idk what's wrong with types here
      svgr({
        exportType: 'named',
        typescript: true
      })
    ],
    format: 'esm',
    target: 'es2020',
    treeshake: true,
    // todo: find better way to export svg types
    async onSuccess() {
      const filePath = path.join(CWD, 'dist', 'client', 'icons', 'index.js')
      const content = await fs.readFile(filePath, 'utf-8')

      const components = content
        .match(/(?<=export \{ )[\w, ]+/)![0]
        .replaceAll(/\w+ as /g, '')
        .trimEnd()
        .split(', ')
        .filter(name => !['ArrowRightIcon', 'ExpandIcon'].includes(name))

      await fs.writeFile(
        filePath.replace('.js', '.d.ts'),
        `import type { ComponentProps, ReactElement } from 'react'

type Svg = (props: ComponentProps<'svg'>) => ReactElement

export const ArrowRightIcon: (props: ComponentProps<'svg'> & { pathClassName?: string }): ReactElement

export const ExpandIcon: (props: ComponentProps<'svg'> & { isOpen?: boolean }): ReactElement
${components.map(component => `export const ${component}: Svg`).join('\n')}`
      )
    }
  }
])
