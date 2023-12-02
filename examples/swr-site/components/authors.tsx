export default function Authors({ date, children }) {
  return (
    <div className="mb-16 mt-8 text-sm text-gray-400">
      {date} by {children}
    </div>
  )
}

export function Author({ name, link }) {
  return (
    <span className="after:content-[','] last:after:content-['']">
      <a
        key={name}
        href={link}
        target="_blank"
        rel="noreferrer"
        className="mx-1 text-gray-800 dark:text-gray-100"
      >
        {name}
      </a>
    </span>
  )
}
