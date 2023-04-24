import findPagesDirExports from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants'

const { findPagesDir, existsSync } = findPagesDirExports

export { existsSync }

export function findPagesDirectory(): string {
  const res = findPagesDir(CWD, false)
  return (
    res.pagesDir || // next v13
    (res as any).pages // next v12
  )
}

export const PAGES_DIR = process.env.VITEST_WORKER_ID
  ? ''
  : findPagesDirectory()
