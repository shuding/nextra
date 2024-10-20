import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { ArrowRightIcon } from 'nextra/icons'
import type { Item } from 'nextra/normalize-pages'
import type { ReactElement } from 'react'
import { Fragment } from 'react'

export function Breadcrumb({
  activePath
}: {
  activePath: Item[]
}): ReactElement {
  return (
    <div className="nextra-breadcrumb _mt-1.5 _flex _items-center _gap-1 _overflow-hidden _text-sm _text-gray-500 dark:_text-gray-400 contrast-more:_text-current">
      {activePath.map((item, index, arr) => {
        const nextItem = arr[index + 1]
        const href = nextItem
          ? item.withIndexPage
            ? item.route
            : item.children[0].route === nextItem.route
              ? ''
              : item.children[0].route
          : ''

        const ComponentToUse = href ? NextLink : 'span'

        return (
          <Fragment key={item.route + item.name}>
            {index > 0 && (
              <ArrowRightIcon
                height="14"
                className="_shrink-0 rtl:_rotate-180"
              />
            )}
            <ComponentToUse
              className={cn(
                '_whitespace-nowrap _transition-colors',
                nextItem
                  ? '_min-w-6 _overflow-hidden _text-ellipsis'
                  : '_font-medium _text-gray-700 contrast-more:_font-bold contrast-more:_text-current dark:_text-gray-100 contrast-more:dark:_text-current',
                href &&
                  'nextra-focus _ring-inset hover:_text-gray-900 dark:hover:_text-gray-100'
              )}
              title={item.title}
              {...(href && ({ href } as any))}
            >
              {item.title}
            </ComponentToUse>
          </Fragment>
        )
      })}
    </div>
  )
}
