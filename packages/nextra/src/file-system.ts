import fs from 'graceful-fs'

export const existsSync = (filePath: string): boolean => {
  try {
    fs.statSync(filePath)
    return true
  } catch {
    return false
  }
}
