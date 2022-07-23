import React from 'react'
import Link from 'next/link'
import cn from 'classnames'

import { ArrowRightIcon } from './icons'

import { Item } from './utils/normalize-pages'

export default function Breadcrumb({ activePath }: { activePath: Item[] }) {
  return (
    <div className="nextra-breadcrumb text-sm font-normal flex mt-2.5 text-gray-500 transition-colors cursor-default overflow-hidden">
      {activePath.map((item, index) => {
        const isLink = !item.children || item.withIndexPage
        const isActive = index === activePath.length - 1

        return (
          <React.Fragment key={item.route}>
            {index ? (
              <ArrowRightIcon width={14} className="mx-1 select-none" />
            ) : null}
            <div
              className={cn(
                'transition-colors hover:text-gray-900 dark:hover:text-gray-200',
                {
                  'text-gray-600 dark:text-gray-400 active': isActive,
                  'text-ellipsis whitespace-nowrap overflow-hidden min-w-[24px]':
                    !isActive
                }
              )}
            >
              {isLink && !isActive ? (
                <Link href={item.route}>
                  <a className="text-current no-underline">{item.title}</a>
                </Link>
              ) : (
                item.title
              )}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
