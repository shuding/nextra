import fs from 'fs'
import path from 'path'
import { LOCALE_REGEX } from './constants'

export function parseFileName(filePath: string): {
  name: string
  locale: string
  ext: string
} {
  // Get file name and extension from file path
  const { name, ext } = path.parse(filePath)
  const locale = name.match(LOCALE_REGEX)?.[1] || ''
  return {
    name: locale ? name.replace(LOCALE_REGEX, '') : name,
    locale,
    ext
  }
}

export const parseJsonFile = (
  content: string,
  path: string
): Record<string, any> => {
  try {
    return JSON.parse(content)
  } catch (err) {
    console.error(`[nextra] Error parsing ${path}, make sure it's a valid JSON`, err)
    return {}
  }
}

export const existsSync = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}
