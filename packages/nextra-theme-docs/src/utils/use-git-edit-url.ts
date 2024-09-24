import { useThemeConfig } from '../stores'
import { gitUrlParse } from './git-url-parse'

export function useGitEditUrl(filePath = ''): string {
  const config = useThemeConfig()
  const repo = gitUrlParse(config.docsRepositoryBase || '')
  return `${repo.href}/${filePath}`
}
