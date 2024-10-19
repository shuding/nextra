'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

export function ExampleDynamicMarkdownImport() {
  const [pageOne, setPageOne] = useState(true)
  const Page = dynamic(
    () => {
      if (pageOne) {
        return import('../../content/en/docs/advanced/more/tree/one.mdx')
      }
      return import('../../content/en/docs/advanced/more/tree/two.mdx')
    },
    { loading: () => <p>Loading...</p> }
  )
  return (
    <>
      <Page />
      <button onClick={() => setPageOne(!pageOne)}>Toggle Content</button>
    </>
  )
}
