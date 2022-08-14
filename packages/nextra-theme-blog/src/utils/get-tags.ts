import { PageMapItem, PageOpts } from 'nextra'

export function split(tags: string | string[]): string[] {
  return (Array.isArray(tags) ? tags : tags.split(',')).map(s => s.trim())
}

const flattenPageMap = (page: PageMapItem, result: PageMapItem[] = []) => {
  if (Array.isArray(page.children)) {
    page.children.forEach(p => flattenPageMap(p, result))
  }
  result.push(page)
}

const flattenPageMaps = (pages: PageMapItem[], result: PageMapItem[] = []) => {
  pages.forEach(v => flattenPageMap(v, result))
}

export const getStaticTags = ({ pageMap }: PageOpts) => {
  const result: PageMapItem[] = []
  flattenPageMaps(pageMap, result)
  return Array.from(
    new Set(
      result
        .map(getTags)
        .flat(1)
        .filter(Boolean)
    )
  )
}

export default function getTags(page: PageMapItem) {
  if (!page.frontMatter) {
    return []
  }
  const tags: string = page.frontMatter.tag || ''
  return split(tags)
}
