import { MdxFile } from 'nextra'

export function split(tags: string | string[]): string[] {
  return (Array.isArray(tags) ? tags : tags.split(',')).map(s => s.trim())
}

export default function getTags(page: MdxFile) {
  if (!page.frontMatter) {
    return []
  }
  const tags: string = page.frontMatter.tag || ''
  return split(tags)
}
