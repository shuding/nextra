import { Fragment, memo } from 'react'

type MatchArgs = {
  value?: string
  match: string
}

let segmentor: Intl.Segmenter
const getLastWord = (text: string) => {
  if (typeof window === 'undefined' || typeof Intl === 'undefined') {
    return text.split(' ').pop()
  }
  segmentor = segmentor || new Intl.Segmenter('en', { granularity: 'word' })
  const segments = [...segmentor.segment(text)]
  let word = ''

  let last = segments.pop()
  if (last) {
    word = last.segment
  }
  while (last && !last.isWordLike) {
    last = segments.pop()
    if (last) {
      word = last.segment + word
    }
  }
  return word
}

export const HighlightMatches = memo<MatchArgs>(function HighlightMatches({
  value,
  match
}: MatchArgs) {
  const splitText = value ? value.split('') : []
  const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  const regexp = RegExp('(' + escapedSearch.replaceAll(' ', '|') + ')', 'ig')
  let result
  let id = 0
  let index = 0
  const res = []

  if (value) {
    while ((result = regexp.exec(value)) !== null) {
      const remaining = splitText.splice(0, result.index - index).join('')
      res.push(
        <Fragment key={id++}>
          {!index && remaining.length > 80
            ? '...' + getLastWord(remaining)
            : remaining}
          <span className="nx-text-primary-600">
            {splitText.splice(0, regexp.lastIndex - result.index).join('')}
          </span>
        </Fragment>
      )
      index = regexp.lastIndex
    }
  }

  return (
    <>
      {res}
      {splitText.join('')}
    </>
  )
})
