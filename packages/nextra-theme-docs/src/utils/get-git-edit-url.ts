import { useConfig } from '../contexts'
import parseGitUrl from 'parse-git-url'

export const getGitEditUrl = (filePath?: string): string => {
  const config = useConfig()

  if (config.docsRepositoryBaseCustom) {
    console.log(filePath);
    return `${config.docsRepositoryBaseCustom}/${config.docsRepositoryBaseCustomBranch || 'main'}/${filePath}`
  }

  const repo = parseGitUrl(config.docsRepositoryBase || '')
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  const subdir = repo.subdir ? `${repo.subdir}/` : ''
  const path = `blob/${repo.branch || 'main'}/${subdir}${filePath}`

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${repo.name}/${path}`
    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${repo.name}/-/${path}`
  }
  return ''
}
