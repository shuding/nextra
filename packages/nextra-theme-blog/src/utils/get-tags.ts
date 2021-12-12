import { PageMapItem } from 'nextra'

export default function getTags(page: PageMapItem) {
  if (!page.frontMatter) {
    return []
  }
  const tags: string = page.frontMatter.tag || ''
  return tags.split(',').map(s => s.trim())
}
