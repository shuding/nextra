import { useConfig } from '../contexts'
import gitUrlParse from 'git-url-parse'

export const getGitEditUrl = (filePath?: string): string => {
  const config = useConfig()
  const repo = gitUrlParse(config.docsRepositoryBase || '')

  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  return `${repo.href}/${filePath}`
}