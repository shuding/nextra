import { useRouter } from 'next/router'
import type { Folder, MdxFile } from 'nextra'
import type { LayoutProps } from '../types'
import traverse from './traverse'

export function getParent({ opts }: LayoutProps) {
  let back: string | null = null
  const parentPages: (MdxFile | Folder)[] = []
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { route } = useRouter()

  traverse(opts.pageMap, page => {
    if (
      'route' in page &&
      route !== page.route &&
      (route + '/').startsWith(page.route === '/' ? '/' : page.route + '/')
    ) {
      parentPages.push(page)
    }
  })

  const parentPage = parentPages
    .reverse()
    .find(
      page =>
        'frontMatter' in page &&
        page.frontMatter &&
        page.frontMatter.type === 'posts'
    )

  if (parentPage) {
    back = parentPage.route
  }

  return { parentPage, back }
}
