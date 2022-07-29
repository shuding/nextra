import { PageMapItem } from 'nextra'
import { LayoutProps } from '../types'
import sortDate from './sort-date'
import traverse from './traverse'

const isNav = (page: PageMapItem) => {
  return page.frontMatter && ['page', 'posts'].includes(page.frontMatter.type)
}
const isPost = (page: PageMapItem) => {
  if (page.children) return false
  if (page.name.startsWith('_')) return false
  return (
    !page.frontMatter ||
    !page.frontMatter.type ||
    page.frontMatter.type === 'post'
  )
}

export const collectPostsAndNavs = ({ opts }: LayoutProps) => {
  const posts: PageMapItem[] = []
  const navPages: PageMapItem[] = []
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
