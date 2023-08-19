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
    return `${repo.protocol}://${repo.resource}/${repo.owner}/${
      repo.name
    }/-/issues/new?issue[title]=${encodeURIComponent(title)}${
      labels
        ? `&issue[description]=/label${encodeURIComponent(` ~${labels}\n`)}`
        : ''
    }`
  }
  if (repo.resource.includes('github')) {
    return `${repo.protocol}://${repo.resource}/${repo.owner}/${
      repo.name
    }/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ''}`
  }
  return '#'
}
