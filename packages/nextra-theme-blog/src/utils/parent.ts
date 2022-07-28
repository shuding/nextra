import { PageMapItem } from 'nextra'
import { LayoutProps } from '../types'
import traverse from './traverse'

export const getParent = ({ opts }: LayoutProps) => {
  let back: string | null = null
  const parentPages: PageMapItem[] = []
  const route = opts.route
  traverse(opts.pageMap, page => {
    if (
      route !== page.route &&
      (route + '/').startsWith(page.route === '/' ? '/' : page.route + '/')
    ) {
      parentPages.push(page)
    }
  })
  const parentPage = parentPages
    .reverse()
    .find(page => page.frontMatter && page.frontMatter.type === 'posts')
  if (parentPage) {
    back = parentPage.route
  }
  return {
    parentPage,
    back
  }
}
