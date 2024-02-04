function Authors({ date, children, lang }) {
  date = new Date(date)
  return (
    <div className="mb-16 mt-8 text-sm text-gray-400">
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString(lang, {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </time>{' '}
      {text[lang!]} {children}
    </div>
  )
}

function Author({ name, link }) {
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

export function TopContent({
  title,
  date,
  authors,
  lang
}: {
  title: string
  date: string
  authors: {
    name: string
    link: string
  }[],
  lang: string
}) {
  return (
    <>
      <h1>{title}</h1>
      <Authors date={date} lang={lang}>
        {authors.map(author => (
          <Author key={author.name} name={author.name} link={author.link} />
        ))}
      </Authors>
    </>
  )
}
