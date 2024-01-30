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
      {activePath.map((item, index) => {
        const isLast = index === activePath.length - 1
        const isLink =
          !isLast &&
          (item.withIndexPage ||
            item.children![0].route !== activePath.at(index + 1)!.route)

        const ComponentToUse = isLink ? NextLink : 'span'

        return (
          <Fragment key={item.route + item.name}>
            {index > 0 && (
              <ArrowRightIcon className="_w-3.5 _shrink-0 rtl:_rotate-180" />
            )}
            <ComponentToUse
              className={cn(
                '_whitespace-nowrap _transition-colors',
                isLast
                  ? '_font-medium _text-gray-700 contrast-more:_font-bold contrast-more:_text-current dark:_text-gray-100 contrast-more:dark:_text-current'
                  : '_min-w-[24px] _overflow-hidden _text-ellipsis',
                isLink && 'hover:_text-gray-900 dark:hover:_text-gray-100'
              )}
              title={item.title}
              {...(isLink && { href: item.route } as any)}
            >
              {item.title}
            </ComponentToUse>
          </Fragment>
        )
      })}
    </div>
  )
}
