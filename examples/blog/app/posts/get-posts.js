import { getPageMap } from 'nextra/page-map'

export async function getPosts() {
  const pageMap = await getPageMap('/posts')
  return pageMap
    .filter(post => !post.frontMatter.draft && post.name !== 'index')
    .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date))
}

export async function getTags() {
  const tags = (await getPosts()).flatMap(post => post.frontMatter.tags)
  return tags
}
