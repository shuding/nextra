import { useThemeConfig } from '../contexts'
import { gitUrlParse } from './git-url-parse'

export function useGitEditUrl(filePath = ''): string {
  const config = useThemeConfig()
  const repo = gitUrlParse(config.docsRepositoryBase || '')

  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  return `${repo.href}/${filePath}`
}
