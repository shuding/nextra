import path from 'path'

export function getLocaleFromFilename(name) {
  const localeRegex = /\.([a-zA-Z-]+)?\.(mdx?|jsx?|json)$/
  const match = name.match(localeRegex)
  if (match) return match[1]
  return undefined
}

export function removeExtension(name) {
  const match = name.match(/^([^.]+)/)
  return match !== null ? match[1] : ''
}

export function getFileName(resourcePath) {	
  return removeExtension(path.basename(resourcePath))	
}

export const parseJsonFile = (content, path) => {
  let parsed = {}
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    console.error(`Error parsing ${path}, make sure it's a valid JSON \n` + err)
  }

  return parsed
}
