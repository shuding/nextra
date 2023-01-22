import type { PageMapItem, MdxFile } from 'nextra'
import type { LayoutProps } from '../types'
import { sortDate } from './date'
import traverse from './traverse'

const isNav = (page: PageMapItem): page is MdxFile => {
  const type = 'frontMatter' in page && page.frontMatter?.type
  return type && ['page', 'posts'].includes(type)
}
const isPost = (page: PageMapItem): page is MdxFile => {
  if (
    page.kind === 'Folder' ||
    page.kind === 'Meta' ||
    page.name.startsWith('_')
  )
    return false
  const type = page.frontMatter?.type
  return !type || type === 'post'
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
