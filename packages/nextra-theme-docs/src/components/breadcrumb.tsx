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
    <div className="nextra-breadcrumb">
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
                className="nextra-breadcrumb-arrow"
              />
            )}
            <ComponentToUse
              className={cn(
                'nextra-breadcrumb-item',
                nextItem
                  ? 'nextra-breadcrumb-item-parent'
                  : 'nextra-breadcrumb-item-child',
                href &&
                  'nextra-breadcrumb-item-link'
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
