import { PageMapItem } from 'nextra'

export default (a: PageMapItem, b: PageMapItem): number => {
  if (!a.frontMatter?.date || !b.frontMatter?.date) return -1

  return (
    new Date(b.frontMatter.date).getTime() -
    new Date(a.frontMatter.date).getTime()
  )
}
