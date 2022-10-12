import { useConfig } from '../contexts'
import parseGitUrl from 'git-url-parse'

export const getGitEditUrl = (filePath?: string): string => {
  const config = useConfig()
  const repo = parseGitUrl(config.docsRepositoryBase || '')

  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  return `${repo.href}/${filePath}`
}