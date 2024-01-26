import { PostCard } from 'nextra-theme-blog'
import { getPosts } from '../../posts/get-posts'

export function generateMetadata({ params }) {
  return {
    title: `Posts Tagged with “${decodeURI(params.tag)}”`
  }
}

export async function generateStaticParams() {
  const tags = (await getPosts()).flatMap(post => post.frontMatter.tags)
  return [...new Set(tags)].map(tag => ({ tag }))
}

export default function TagPage({ params }) {
  return (
    <>
      <h1>{generateMetadata({ params }).title}</h1>
      {getPosts()
        .filter(post => post.frontMatter.tags.includes(decodeURI(params.tag)))
        .map(post => (
          <PostCard key={post.route} post={post} />
        ))}
    </>
  )
}
