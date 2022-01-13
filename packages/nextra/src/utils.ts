import fs from 'fs';
import path from 'path'

export function getLocaleFromFilename(name: string) {
  const localeRegex = /\.([a-zA-Z-]+)?\.(mdx?|jsx?|json)$/
  const match = name.match(localeRegex)
  if (match) return match[1]
  return undefined
}

export function removeExtension(name: string) {
  const match = name.match(/^([^.]+)/)
  return match !== null ? match[1] : ''
}

export function getFileName(resourcePath: string) {
  return removeExtension(path.basename(resourcePath))
}

export const parseJsonFile: (
  content: string,
  path: string
) => Record<string, any> = (content: string, path: string) => {
  let parsed = {}
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    console.error(`Error parsing ${path}, make sure it's a valid JSON \n` + err)
  }

  return parsed
}

export const existsSync = (f: string): boolean => {
  try {
    fs.accessSync(f, fs.constants.F_OK)
    return true
  } catch (_) {
    return false
  }
}