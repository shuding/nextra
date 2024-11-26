import { getPageMap } from 'nextra/page-map'

export async function getPosts() {
  const [meta, ...posts] = await getPageMap('/posts')
  return posts
    .filter(
      post => {
        const isIndexPage = post.name === 'index'
        if (isIndexPage) {
          return
        }
        const metaItem = meta.data[post.name]
        if (!metaItem) {
          return true
        }

        return metaItem.display !== 'hidden'
      }
    )
    .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date))
}

export async function getTags() {
  const tags = (await getPosts()).flatMap(post => post.frontMatter.tags)
  return tags
}
