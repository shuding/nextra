import React, { ReactElement, useEffect, useState } from 'react'
import mermaid from 'mermaid'

/**
 * Assign a unique ID to each mermaid svg as per requirements of `mermaid.render`.
 */
let id = 0

export const Mermaid = ({ chart }: { chart: string }): ReactElement => {
  const [svg, setSVG] = useState('')

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme:
        typeof localStorage === 'undefined' ? undefined : localStorage.theme
    })
    mermaid.render(`mermaid-svg-${id}`, chart, renderedSvg => {
      setSVG(renderedSvg)
    })
    id++
  }, [chart])

  return (
    <div
      className="flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
