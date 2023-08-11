import type { ReactElement, ReactNode } from 'react'
import { memo } from 'react'

type MatchArgs = {
  value?: string
  match: string
}

export const HighlightMatches = memo<MatchArgs>(function HighlightMatches({
  value,
  match
}: MatchArgs): ReactElement | null {
  if (!value) {
    return null
  }
  const splitText = value ? value.split('') : []
  const escapedSearch = match
    .trim()
    // taken from https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
  const regexp = new RegExp(
    '(' + escapedSearch.replaceAll(' ', '|') + ')',
    'ig'
  )
  let result
  let id = 0
  let index = 0
  const content: (string | ReactNode)[] = []

  while (
    (result = regexp.exec(value)) &&
    // case `>  ` replaced previously to `>||` + some character provoke memory leak
    regexp.lastIndex !== 0
  ) {
    const before = splitText.splice(0, result.index - index).join('')
    const after = splitText.splice(0, regexp.lastIndex - result.index).join('')
    content.push(
      before,
      <span key={id++} className="nx-text-primary-600">
        {after}
      </span>
    )
    index = regexp.lastIndex
  }

  return (
    <>
      {content}
      {splitText.join('')}
    </>
  )
})
