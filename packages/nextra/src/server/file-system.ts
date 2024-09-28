import * as pkg from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants.js'

export function findPagesDirectory(): string {
  const { pagesDir } = pkg.findPagesDir(CWD)
  if (!pagesDir) {
    throw new Error('Unable to find `pages` directory')
  }
  return pagesDir
}

export const PAGES_DIR = findPagesDirectory()
