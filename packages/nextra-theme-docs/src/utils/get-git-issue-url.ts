import parseGitUrl from 'git-url-parse'

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

  if (repo.href.includes('gitlab')) {
    return `https://gitlab.com/${repo.owner}/${
        repo.name
      }/-/issues/new?issue[title]=${encodeURIComponent(title)}`
  } else if (repo.href.includes('github')) {
    return `${repo.resource}/${repo.owner}/${
        repo.name
      }/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ''}`
  } else {
    return '#'
  }
}