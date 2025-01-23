import { getPosts } from '../posts/get-posts.js'

const CONFIG = {
  title: 'My Blog',
  siteUrl: 'https://your-domain.com',
  description: 'Latest blog posts',
  lang: 'en-us'
}

export async function GET() {
  const allPosts = await getPosts()
  const posts = allPosts
    .map(
      post => `    <item>
        <title>${post.title}</title>
        <description>${post.frontMatter.description}</description>
        <link>${CONFIG.siteUrl}${post.route}</link>
        <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
${posts}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml'
    }
  })
}
