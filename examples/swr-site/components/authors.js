export default function Authors({ date, children }) {
  return (
    <div className="mt-8 mb-16 text-gray-400 text-sm">
      {date} by {children}
    </div>
  );
}

export function Author({ name, link }) {
  return (
    <span className="after:content-[','] last:after:content-['']">
      <a
        key={name}
        href={link}
        target="_blank"
        className="mx-1 text-gray-800 dark:text-gray-100"
      >
        {name}
      </a>
    </span>
  );
}
