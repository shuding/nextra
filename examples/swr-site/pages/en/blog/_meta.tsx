import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'nextra/hooks'

const text = {
  en: 'by',
  ru: 'от',
  es: 'por'
}

export function Authors({ date, children }) {
  date = new Date(date)
  const { locale } = useRouter()
  return (
    <div className="mb-16 mt-8 text-sm text-gray-400">
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString(locale, {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </time>{' '}
      {text[locale!]} {children}
    </div>
  )
}

export function Author({ name, link }) {
  return (
    <span className="[&:not(:last-child)]:after:content-[',_']">
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="text-gray-800 dark:text-gray-100"
      >
        {name}
      </a>
    </span>
  )
}

function TopContent() {
  const config = useConfig()
  return (
    <>
      <h1>{config.frontMatter.title}</h1>
      <Authors date={config.frontMatter.date}>
        {config.frontMatter.authors.map(author => (
          <Author key={author.name} name={author.name} link={author.link} />
        ))}
      </Authors>
    </>
  )
}

export default {
  '*': {
    theme: {
      breadcrumb: true,
      topContent: TopContent
    }
  }
}
