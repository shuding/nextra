import * as pkg from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants'

export const { existsSync } = pkg

export function findPagesDirectory(): string {
  const { pagesDir } = pkg.findPagesDir(CWD, false)
  if (!pagesDir) {
    throw new Error('Unable to find `pages` directory')
  }
  return pagesDir
}

export const PAGES_DIR = process.env.VITEST_WORKER_ID
  ? ''
  : findPagesDirectory()
