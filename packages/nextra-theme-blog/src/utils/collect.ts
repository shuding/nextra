import { useRouter } from 'next/router'
import type { MdxFile, PageMapItem } from 'nextra'
import type { LayoutProps } from '../types'
import { sortDate } from './date'
import traverse from './traverse'

const isNav = (page: PageMapItem): page is MdxFile => {
  const type = 'frontMatter' in page && page.frontMatter?.type
  return type && ['page', 'posts'].includes(type)
}
const isPost = (page: PageMapItem): page is MdxFile => {
  if ('children' in page || 'data' in page || page.name.startsWith('_'))
    return false
  const { draft, type } = page.frontMatter || {}
  return !draft && (!type || type === 'post')
}

export function collectPostsAndNavs({ opts }: LayoutProps) {
  const posts: MdxFile[] = []
  const navPages: (MdxFile & { active: boolean })[] = []
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { route } = useRouter()
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
