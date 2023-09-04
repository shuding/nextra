import * as findPagesDirImport from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants'
import { getDefault } from './utils'

const { findPagesDir, existsSync } = getDefault(findPagesDirImport)

export { existsSync }

export function findPagesDirectory(): string {
  const { pagesDir } = findPagesDir(CWD, false)
  if (!pagesDir) {
    throw new Error('Unable to find `pages` directory')
  }
  return pagesDir
}

export const PAGES_DIR = process.env.VITEST_WORKER_ID
  ? ''
  : findPagesDirectory()
