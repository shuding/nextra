import escapeStringRegexp from 'escape-string-regexp'
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
  const splitText = value.split('')
  const escapedSearch = escapeStringRegexp(match.trim())
  const regexp = new RegExp(escapedSearch.replaceAll(' ', '|'), 'ig')
  let result
  let index = 0
  const content: (string | ReactNode)[] = []

  while (
    (result = regexp.exec(value)) &&
    // case `>  ` replaced previously to `>||` + some character provoke memory leak because
    // `RegExp#exec` will always return a match
    regexp.lastIndex !== 0
  ) {
    const before = splitText.splice(0, result.index - index).join('')
    const after = splitText.splice(0, regexp.lastIndex - result.index).join('')
    content.push(
      before,
      <span key={result.index} className="_text-primary-600">
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
