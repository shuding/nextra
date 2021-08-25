import React from 'react'
import Slugger from 'github-slugger'
import innerText from 'react-innertext'

const indent = level => {
  switch (level) {
    case 'h3':
      return { marginLeft: '1rem ' }
    case 'h4':
      return { marginLeft: '2rem ' }
    case 'h5':
      return { marginLeft: '3rem ' }
    case 'h6':
      return { marginLeft: '4rem ' }
  }
  return {}
}

export default function ToC({ titles }) {
  const slugger = new Slugger()
  return (
    <div className="w-64 pl-4 hidden xl:block text-sm">
      {titles ? (
        <ul className="overflow-y-auto sticky max-h-[calc(100vh-4rem)] top-16 pt-8 pb-10 m-0 list-none">
          {titles
            .filter(item => item.props.mdxType !== 'h1')
            .map(item => {
              const text = innerText(item.props.children) || ''
              const slug = slugger.slug(text)

              return (
                <li key={slug} style={indent(item.props.mdxType)}>
                  <a
                    href={`#${slug}`}
                    className="text-gray-600 no-underline hover:text-gray-900 dark:hover:text-gray-100"
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
