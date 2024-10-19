import { PostCard } from 'nextra-theme-blog'
import { getPosts, getTags } from '../../posts/get-posts'

export async function generateMetadata(props) {
  const params = await props.params
  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`
  }
}

export async function generateStaticParams() {
  const allTags = await getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}

export default async function TagPage(props) {
  const params = await props.params
  return (
    <>
      <h1>{generateMetadata({ params }).title}</h1>
      {(await getPosts())
        .filter(post =>
          post.frontMatter.tags.includes(decodeURIComponent(params.tag))
        )
        .map(post => (
          <PostCard key={post.route} post={post} />
        ))}
    </>
  )
}
