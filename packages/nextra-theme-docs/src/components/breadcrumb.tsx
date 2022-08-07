import React, { ReactElement } from 'react'
import { Anchor } from './anchor'
import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import { Item } from '../utils/normalize-pages'

export function Breadcrumb({
  activePath
}: {
  activePath: Item[]
}): ReactElement {
  return (
    <div className="nextra-breadcrumb mt-2.5 flex cursor-default overflow-hidden text-sm font-normal text-gray-500 transition-colors">
      {activePath.map((item, index) => {
        const isLink = !item.children || item.withIndexPage
        const isActive = index === activePath.length - 1

        return (
          <React.Fragment key={item.route + item.name}>
            {index ? (
              <ArrowRightIcon width={14} className="mx-1 select-none" />
            ) : null}
            <div
              className={cn(
                'transition-colors whitespace-nowrap',
                isActive
                  ? 'active text-gray-600 dark:text-gray-400'
                  : [
                      'min-w-[24px] overflow-hidden text-ellipsis',
                      isLink && 'hover:text-gray-900 dark:hover:text-gray-200'
                    ]
              )}
              title={item.title}
            >
              {isLink && !isActive ? (
                <Anchor href={item.route} className="text-current no-underline">
                  {item.title}
                </Anchor>
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
