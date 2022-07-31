import React from 'react'
import Link from 'next/link'
import cn from 'classnames'

import { ArrowRightIcon } from 'nextra/icons'

import { Item } from './utils/normalize-pages'

export default function Breadcrumb({ activePath }: { activePath: Item[] }) {
  return (
    <div className="nextra-breadcrumb mt-2.5 flex cursor-default overflow-hidden text-sm font-normal text-gray-500 transition-colors">
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
                'transition-colors whitespace-nowrap',
                {
                  'active text-gray-600 dark:text-gray-400': isActive,
                  'min-w-[24px] overflow-hidden text-ellipsis': !isActive,
                  'hover:text-gray-900 dark:hover:text-gray-200': isLink && !isActive
                }
              )}
              title={item.title}
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
