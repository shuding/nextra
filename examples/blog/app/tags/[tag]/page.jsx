import { PostCard } from 'nextra-theme-blog'
import { getPosts, getTags } from '../../posts/get-posts'

export function generateMetadata({ params }) {
  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`
  }
}

export function generateStaticParams() {
  const allTags = getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}

export default function TagPage({ params }) {
  return (
    <>
      <h1>{generateMetadata({ params }).title}</h1>
      {getPosts()
        .filter(post => post.frontMatter.tags.includes(decodeURIComponent(params.tag)))
        .map(post => (
          <PostCard key={post.route} post={post} />
        ))}
    </>
  )
}
