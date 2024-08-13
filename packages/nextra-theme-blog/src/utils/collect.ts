import type { MdxFile, PageMapItem } from 'nextra'
import type { LayoutProps } from '../types'
import { sortDate } from './date'
import traverse from './traverse'

const isNav = (page: PageMapItem): page is MdxFile => {
  const type = 'frontMatter' in page && page.frontMatter?.type
  const display = 'frontMatter' in page && page.frontMatter?.display
  return type && ['page', 'posts'].includes(type) && display !== 'hidden'
}
const isPost = (page: PageMapItem): page is MdxFile => {
  if (
    page.kind === 'Folder' ||
    page.kind === 'Meta' ||
    page.name.startsWith('_')
  )
    return false
  const { draft, type, display } = page.frontMatter || {}
  return !draft && (!type || type === 'post') && display !== 'hidden'
}

export const collectPostsAndNavs = ({ opts }: LayoutProps) => {
  const posts: MdxFile[] = []
  const navPages: (MdxFile & { active: boolean })[] = []
  const { route } = opts
  traverse(opts.pageMap, page => {
    if (isNav(page)) {
      navPages.push({ ...page, active: page.route === route })
    }
    if (isPost(page)) {
      posts.push(page)
    }
  })
  posts.sort(sortDate)
  navPages.sort(sortDate)
  return { posts, navPages }
}
