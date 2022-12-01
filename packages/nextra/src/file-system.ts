import fs from 'graceful-fs'
import { findPagesDir } from 'next/dist/lib/find-pages-dir.js'
import { CWD } from './constants'

export const existsSync = (filePath: string): boolean => {
  try {
    fs.statSync(filePath)
    return true
  } catch {
    return false
  }
}

export const findPagesDirectory = (): string => {
  const res = findPagesDir(CWD, false)
  return (
    res.pagesDir || // next v13
    (res as any).pages // next v12
  )
}
