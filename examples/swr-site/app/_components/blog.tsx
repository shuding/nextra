import Link from 'next/link'
import { getPageMap } from 'nextra/page-map'
import type { FC } from 'react'

export const Blog: FC<{ lang: string }> = async ({ lang }) => {
  const pageMap = await getPageMap(lang)
  const blogItems = pageMap.find(item => item.name === 'blog').children

  return blogItems.map(
    page =>
      page.route?.startsWith('/blog/') && (
        <div key={page.route}>
          <Link
            href={page.route}
            className="text-2xl text-black hover:!no-underline dark:text-gray-100"
          >
            {page.frontMatter.title}
          </Link>
          <p className="opacity-80 mt-6 leading-7">
            {page.frontMatter.description}
            <Link
              href={page.route}
              className="block _text-primary-600 underline underline-offset-2 decoration-from-font"
            >
              Read more →
            </Link>
          </p>
          <time
            dateTime={new Date(page.frontMatter.date).toISOString()}
            className="text-sm"
          >
            {new Date(page.frontMatter.date).toLocaleDateString(lang, {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      )
  )
}
