import * as pkg from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants.js'

export function findPagesDirectory(): string {
  const { appDir } = pkg.findPagesDir(CWD)
  if (!appDir) {
    throw new Error('Unable to find `app` directory')
  }
  return appDir
}

export const APP_DIR = findPagesDirectory()
