export async function getPosts() {
  const { pageMap } = await import(
    '../../.next/static/chunks/nextra-page-map-.mjs'
  )

  return pageMap
    .find(item => item.route === '/posts')
    .children.filter(post => !post.frontMatter.draft && post.name !== 'index')
    .sort((a, b) => b.frontMatter.date - a.frontMatter.date)
}

export async function getTags() {
  const tags = (await getPosts()).flatMap(post => post.frontMatter.tags)
  return tags
}
