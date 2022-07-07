import fs from 'fs';
import path from 'path'

export function getLocaleFromFilename(name: string): string | void {
  const localeRegex = /\.([a-zA-Z-]+)?\.(mdx?|jsx?|json)$/
  const match = name.match(localeRegex)
  if (match) return match[1]
}

export function removeExtension(name: string): string {
  const match = name.match(/^([^.]+)/)
  return match !== null ? match[1] : ''
}

export function getFileName(resourcePath: string): string {
  return removeExtension(path.basename(resourcePath))
}

export const parseJsonFile: (
  content: string,
  path: string
) => Record<string, any> = (content: string, path: string) => {
  try {
    return JSON.parse(content)
  } catch (err) {
    console.error(`Error parsing ${path}, make sure it's a valid JSON \n` + err)
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
