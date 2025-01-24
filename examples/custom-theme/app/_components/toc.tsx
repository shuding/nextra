import type { Heading } from 'nextra'
import type { FC } from 'react'

export const TOC: FC<{ toc: Heading[] }> = ({ toc }) => {
  return (
    <div style={{ background: 'lightblue', padding: 20 }}>
      <h3>Table of Contents</h3>
      <ul>
        {toc.map(heading => (
          <li key={heading.id}>{heading.value}</li>
        ))}
      </ul>
    </div>
  )
}
