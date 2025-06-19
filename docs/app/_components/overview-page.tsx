import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { PageMapItem } from 'nextra'
import { Cards } from 'nextra/components'
import { getIndexPageMap, getPageMap } from 'nextra/page-map'
import type { FC } from 'react'

export const OverviewPage: FC<{
  filePath: string
  icons?: Record<string, FC>
  pageMap?: PageMapItem[]
}> = async ({ filePath, icons, pageMap: $pageMap }) => {
  const { h2: H2 } = getMDXComponents()
  const currentRoute = filePath.replace('app', '').replace('/page.mdx', '')
  const pageMap = $pageMap ?? (await getPageMap(currentRoute))

  return getIndexPageMap(pageMap).map((pageItem, index) => {
    if (!Array.isArray(pageItem)) {
      return <H2 key={index}>{pageItem.title}</H2>
    }
    return (
      <Cards key={index}>
        {pageItem.map(item => {
          const icon = item.frontMatter?.icon
          const Icon = icons?.[icon]
          if (icon && !Icon) {
            throw new Error(
              `Icon "${icon}" is defined in front matter but isn't provided`
            )
          }
          return (
            // @ts-expect-error -- fixme
            <Cards.Card
              key={item.name}
              // @ts-expect-error -- fixme
              title={item.title}
              // @ts-expect-error -- fixme
              href={item.route || item.href}
              icon={Icon && <Icon />}
            />
          )
        })}
      </Cards>
    )
  })
}
