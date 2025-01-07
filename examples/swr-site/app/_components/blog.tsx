import type { MdxFile } from 'nextra'
import { Link } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import type { FC } from 'react'

export const Blog: FC<{ lang: string }> = async ({ lang }) => {
  const pageMap = (await getPageMap(`/${lang}/blog`)) as unknown as MdxFile[]
  return pageMap.map(page => {
    if (page.name === 'index') return
    const { title, description, date } = page.frontMatter!

    return (
      <div key={page.route} className="mt-12">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="my-6 leading-7 opacity-80">
          {description}{' '}
          <Link href={page.route} className="after:content-['_→']">
            Read more
          </Link>
        </p>
        <time
          dateTime={new Date(date).toISOString()}
          className="text-sm opacity-50"
        >
          {new Date(date).toLocaleDateString(lang, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
      </div>
    )
  })
}
