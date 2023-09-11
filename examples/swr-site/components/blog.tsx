import Link from 'next/link'
import { getPagesUnderRoute } from 'nextra/context'
import { useRouter } from 'nextra/hooks'

export function Blog() {
  const { locale } = useRouter()
  return getPagesUnderRoute(`/${locale}/blog`).map(page => (
    <div key={page.route}>
      <Link
        href={page.route}
        className="text-2xl text-black hover:!no-underline dark:text-gray-100"
      >
        {/* @ts-expect-error TODO: fix type error */}
        {page.meta.title || page.frontMatter?.title || page.name}
      </Link>
      <p className="opacity-80 mt-6 leading-7">
        {/* @ts-expect-error TODO: fix type error */}
        {page.frontMatter?.description}
        <Link
          href={page.route}
          className="block text-[color:hsl(var(--nextra-primary-hue),100%,50%)] underline underline-offset-2 decoration-from-font"
        >
          Read more →
        </Link>
      </p>
      {/* @ts-expect-error TODO: fix type error */}
      <p>{page.date}</p>
    </div>
  ))
}
