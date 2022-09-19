import parseGitUrlPackage from 'parse-git-url'
import { getDefault } from './get-default'

const parseGitUrl = getDefault(parseGitUrlPackage)

export const getGitIssueUrl = ({
  repository = '',
  title,
  labels
}: {
  repository?: string
  title: string
  labels?: string
}): string => {
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
