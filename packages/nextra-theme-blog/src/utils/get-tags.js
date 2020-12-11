export default function getTags(page) {
  if (!page.frontMatter) {
    return []
  }
  const tags = page.frontMatter.tag || ''
  return tags.split(',').map(s => s.trim())
}
