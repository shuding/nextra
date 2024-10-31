import { getPageMap } from 'nextra/pages'

export async function getPosts() {
  const pageMap = await getPageMap()
  return pageMap
    .find(item => item.route === '/posts')
    .children.filter(post => !post.frontMatter.draft && post.name !== 'index')
    .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date))
}

export async function getTags() {
  const tags = (await getPosts()).flatMap(post => post.frontMatter.tags)
  return tags
}
