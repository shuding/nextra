import { pageMap } from '../../nextra-page-map.mjs'

export function getPosts() {
  return pageMap
    .find(item => item.route === '/posts')
    .children[0].children.map(post => ({
      ...post.children[0],
      name: post.name,
      route: post.route.replace(/\/\(.*\)/, '')
    }))
    .filter(post => !post.frontMatter.draft)
    .sort((a, b) => b.frontMatter.date - a.frontMatter.date)
}
