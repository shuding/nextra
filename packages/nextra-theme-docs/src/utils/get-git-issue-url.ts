'use no memo'

import { gitUrlParse } from './git-url-parse'

export function getGitIssueUrl({
  repository = '',
  title,
  labels
}: {
  repository?: string
  title: string
  labels?: string
}): string {
  const repo = gitUrlParse(repository)
  if (repo.origin.includes('gitlab')) {
    return `${repo.origin}/${repo.owner}/${
      repo.name
    }/-/issues/new?issue[title]=${encodeURIComponent(title)}${
      labels
        ? `&issue[description]=/label${encodeURIComponent(` ~${labels}\n`)}`
        : ''
    }`
  }
  if (repo.origin.includes('github')) {
    return `${repo.origin}/${repo.owner}/${
      repo.name
    }/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ''}`
  }
  return '#'
}
