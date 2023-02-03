import path from 'node:path'
import { findPagesDir, existsSync } from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants'

export { existsSync }

export function findPagesDirectory(): string {
  const res = findPagesDir(CWD, false)
  return (
    res.pagesDir || // next v13
    (res as any).pages // next v12
  )
}

export const PAGES_DIR =
  process.env.NODE_ENV === 'test' ? '' : findPagesDirectory()

export const HAS_UNDERSCORE_APP_MDX_FILE = existsSync(
  path.join(PAGES_DIR, '_app.mdx')
)
