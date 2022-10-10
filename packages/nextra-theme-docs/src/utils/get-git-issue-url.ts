import { useConfig } from '../contexts'
import parseGitUrl from 'parse-git-url'

export const getGitIssueUrl = ({
  repository = '',
  title,
  labels
}: {
  repository?: string
  title: string
  labels?: string
}): string => {
  const config = useConfig()

  if (config.docsRepositoryBaseCustom) {
    return `${config.docsRepositoryBaseCustom}/issues/new?title=${encodeURI(title)}${
      labels ? `&labels=${encodeURI(labels as string)}` : ''
    }`
  }

  const repo = parseGitUrl(repository)
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${
        repo.name
      }/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ''}`
    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${
        repo.name
      }/-/issues/new?issue[title]=${encodeURIComponent(title)}`
  }

  return '#'
}
