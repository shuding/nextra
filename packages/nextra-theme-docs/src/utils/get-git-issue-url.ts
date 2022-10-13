import gitUrlParse from 'git-url-parse'

export const getGitIssueUrl = ({
  repository = '',
  title,
  labels
}: {
  repository?: string
  title: string
  labels?: string
}): string => {
  const repo = gitUrlParse(repository)
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!')

  if (repo.resource.includes('gitlab')) {
    return `https://gitlab.com/${repo.owner}/${
      repo.name
    }/-/issues/new?issue[title]=${encodeURIComponent(title)}`
  } else if (repo.resource.includes('github')) {
    return `https://github.com/${repo.owner}/${
      repo.name
    }/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ''}`
  } else {
    return '#'
  }
}
