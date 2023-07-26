import type { MdxFile, PageMapItem } from 'nextra'
import type { LayoutProps, NextraBlogTheme } from '../types'
import { sortDate } from './date'
import { pageType } from './frontmatter'
import traverse from './traverse'

const isNav = (page: PageMapItem, config: NextraBlogTheme): page is MdxFile => {
  const type = 'frontMatter' in page && pageType(page, config)
  return type !== false && ['page', 'posts'].includes(type)
}
const isPost = (
  page: PageMapItem,
  config: NextraBlogTheme
): page is MdxFile => {
  if (
    page.kind === 'Folder' ||
    page.kind === 'Meta' ||
    page.name.startsWith('_')
  )
    return false
  return pageType(page, config) === 'post'
}

export const collectPostsAndNavs = ({ config, opts }: LayoutProps) => {
  const posts: MdxFile[] = []
  const navPages: (MdxFile & { active: boolean })[] = []
  const { route } = opts
  traverse(opts.pageMap, page => {
    if (isNav(page, config)) {
      navPages.push({ ...page, active: page.route === route })
    }
    if (isPost(page, config)) {
      posts.push(page)
    }
  })
  posts.sort(sortDate)
  navPages.sort(sortDate)
  return { posts, navPages }
}
