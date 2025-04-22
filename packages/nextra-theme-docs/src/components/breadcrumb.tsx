import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { ArrowRightIcon } from 'nextra/icons'
import type { Item } from 'nextra/normalize-pages'
import type { FC } from 'react'
import { Fragment } from 'react'
import { extractStringsFromReactNode } from '../utils'

export const Breadcrumb: FC<{
  activePath: Item[]
}> = ({ activePath }) => {
  return (
    <div className="nextra-breadcrumb x:mt-1.5 x:flex x:items-center x:gap-1 x:overflow-hidden x:text-sm x:text-gray-600 x:dark:text-gray-400 x:contrast-more:text-current">
      {activePath.map((item, index, arr) => {
        const nextItem = arr[index + 1]
        const href = nextItem
          ? 'frontMatter' in item
            ? item.route
            : // @ts-expect-error -- fixme
              item.children[0].route === nextItem.route
              ? ''
              : // @ts-expect-error -- fixme
                item.children[0].route
          : ''

        const ComponentToUse = href ? NextLink : 'span'

        return (
          <Fragment key={item.route + item.name}>
            {index > 0 && (
              <ArrowRightIcon
                height="14"
                className="x:shrink-0 x:rtl:rotate-180"
              />
            )}
            <ComponentToUse
              className={cn(
                'x:whitespace-nowrap x:transition-colors',
                nextItem
                  ? 'x:min-w-6 x:overflow-hidden x:text-ellipsis'
                  : 'x:font-medium x:text-black x:dark:text-gray-100',
                href &&
                  'x:focus-visible:nextra-focus x:ring-inset x:hover:text-gray-900 x:dark:hover:text-gray-100'
              )}
              title={extractStringsFromReactNode(item.title)}
              {...(href && { href, prefetch: false })}
            >
              {item.title}
            </ComponentToUse>
          </Fragment>
        )
      })}
    </div>
  )
}
