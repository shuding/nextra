import React from 'react'
import cn from 'classnames'
import Slugger from 'github-slugger'
import getHeadingText from './utils/getHeadingText'
import { useActiveAnchor } from './misc/active-anchor'
import { Heading } from 'nextra'

const indent = (level: number) => {
  switch (level) {
    case 3:
      return { marginLeft: '1rem ' }
    case 4:
      return { marginLeft: '2rem ' }
    case 5:
      return { marginLeft: '3rem ' }
    case 6:
      return { marginLeft: '4rem ' }
  }
  return {}
}
const emptyHeader: any[] = []
export default function ToC({
  headings = emptyHeader
}: {
  headings: Heading[] | null
}) {
  const slugger = new Slugger()
  const activeAnchor = useActiveAnchor()

  return (
    <div className="w-64 hidden xl:block text-sm pl-4">
      {headings ? (
        <ul className="overflow-y-auto sticky max-h-[calc(100vh-4rem)] top-16 pt-8 pb-10 m-0 list-none">
          {headings
            .filter(heading => heading.type === 'heading')
            .map(heading => {
              const text = getHeadingText(heading)
              const slug = slugger.slug(text)
              const state = activeAnchor[slug]
              return (
                <li key={slug} style={indent(heading.depth)}>
                  <a
                    href={`#${slug}`}
                    className={cn(
                      'no-underline hover:text-gray-900 dark:hover:text-gray-100',
                      state && state.isActive
                        ? 'text-gray-900 dark:text-gray-100 font-semibold'
                        : 'text-gray-600'
                    )}
                  >
                    {text}
                  </a>
                </li>
              )
            })}
        </ul>
      ) : null}
    </div>
  )
}
