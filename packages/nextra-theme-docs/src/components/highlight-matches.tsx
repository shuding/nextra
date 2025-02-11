import escapeStringRegexp from 'escape-string-regexp'
import type { ReactElement, ReactNode } from 'react'
import { memo, useMemo } from 'react'

type MatchArgs = {
  value?: string
  match: string
  maxResultLength?: number
}

const shortenUnmatchedText = (unmatchedText: string, maxLength: number, beginning: boolean, ending: boolean): string => {
  if (unmatchedText.length > maxLength) {
    if (beginning) {
      return '...' + unmatchedText.slice(-maxLength)
    } else if (ending) {
      return unmatchedText.slice(0, maxLength) + '...'
    } else {
      return unmatchedText.slice(0, maxLength / 2) + '...' + unmatchedText.slice(-(maxLength / 2))
    }
  }
  return ''
}

export const HighlightMatches = memo<MatchArgs>(function HighlightMatches({
  value,
  match,
  maxResultLength
}: MatchArgs): ReactElement | null {
  if (!value) {
    return null
  }

  const content = useMemo(() => {
    const splitText = value.split('')
    const escapedSearch = escapeStringRegexp(match.trim())
    const regexp = new RegExp(escapedSearch.replaceAll(/\s+/g, '|'), 'ig')
    let regexResult
    let index = 0
    const result: (string | ReactNode)[] = []
  
    while ((regexResult = regexp.exec(value))) {
      if (regexResult.index === regexp.lastIndex) {
        regexp.lastIndex++
      } else {
        const before = splitText.splice(0, regexResult.index - index).join('')
        const after = splitText
          .splice(0, regexp.lastIndex - regexResult.index)
          .join('')
        result.push(
          before,
          <span key={regexResult.index} className="_text-primary-600">
            {after}
          </span>
        )
        index = regexp.lastIndex
      }
    }
    result.push(splitText.join(''))
    if (maxResultLength) {
      const unmatchedText = result.flatMap(item => {
        if (typeof item === 'string') {
          return item
        }
        return undefined
      }).filter(Boolean);
      if (unmatchedText.join('').length > maxResultLength) {
        return result.map((item, index) => {
          if (typeof item === 'string') {
            return shortenUnmatchedText(item, maxResultLength / unmatchedText.length, index === 0, index === result.length - 1)
          } else {
            return item
          }
        })
      }
    }
    return result;

  }, [value, match])

  return (
    <>
      {content}
    </>
  )
})
