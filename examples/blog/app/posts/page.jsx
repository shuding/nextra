import { PostCard } from 'nextra-theme-blog'
import { getPosts } from './get-posts.js'

export const metadata = {
  title: 'Posts'
}

export default function PostsPage() {
  return (
    <>
      <h1>{metadata.title}</h1>
      {getPosts().map(post => (
        <PostCard key={post.route} post={post} />
      ))}
    </>
  )
}
