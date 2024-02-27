import escapeStringRegexp from 'escape-string-regexp'
import type { ReactElement, ReactNode } from 'react'
import { memo } from 'react'

type MatchArgs = {
  value?: string
  match: string
}

/**
 * Processes the user's search term by escaping each word, separated by spaces,
 * and then joining them with '|'. This supports searching for multiple words,
 * allowing each word to be searched independently.
 *
 * For example, the search term "apple  banana" (with two spaces) is transformed
 * into "apple|banana", enabling the search for any results containing "apple" or "banana".
 * This approach also gracefully handles extra spaces between words.
 *
 * @param searchTerm - The user's search term.
 * @returns A RegExp object constructed from the processed search term.
 */
const processSearchTerm = (searchTerm: string): RegExp => {
  const trimmedSearchTerm = searchTerm.trim()

  const searchWords = trimmedSearchTerm.split(/\s+/).filter(Boolean)

  if (searchWords.length > 0) {
    const escapedSearch = searchWords.map(escapeStringRegexp).join('|')

    return new RegExp(escapedSearch, 'ig')
  }

  return /$.^/gi
}

export const HighlightMatches = memo<MatchArgs>(function HighlightMatches({
  value,
  match
}: MatchArgs): ReactElement | null {
  if (!value) {
    return null
  }
  const splitText = value.split('')
  const regexp = processSearchTerm(match)
  let result
  let index = 0
  const content: (string | ReactNode)[] = []

  while ((result = regexp.exec(value))) {
    if (result.index === regexp.lastIndex) {
      regexp.lastIndex++
    } else {
      const before = splitText.splice(0, result.index - index).join('')
      const after = splitText
        .splice(0, regexp.lastIndex - result.index)
        .join('')
      content.push(
        before,
        <span key={result.index} className="nx-text-primary-600">
          {after}
        </span>
      )
      index = regexp.lastIndex
    }
  }

  return (
    <>
      {content}
      {splitText.join('')}
    </>
  )
})
