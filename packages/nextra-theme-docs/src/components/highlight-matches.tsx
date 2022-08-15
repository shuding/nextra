import React, { Fragment, memo } from 'react'

export const HighlightMatches = memo<{
  value: string
  match: string
}>(function HighlightMatches({ value, match }) {
  const splittedText = value.split('')
  const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  const regexp = RegExp('(' + escapedSearch.replaceAll(' ', '|') + ')', 'ig')
  let result
  let id = 0
  let index = 0
  const res = []

  while ((result = regexp.exec(value)) !== null) {
    res.push(
      <Fragment key={id++}>
        {splittedText.splice(0, result.index - index).join('')}
        <span className="text-primary-500 underline decoration-primary-400">
          {splittedText.splice(0, regexp.lastIndex - result.index).join('')}
        </span>
      </Fragment>
    )
    index = regexp.lastIndex
  }

  return (
    <>
      {res}
      {splittedText.join('')}
    </>
  )
})
