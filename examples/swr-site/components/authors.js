export default function Authors({ date, children }) {
  return (
    <div className="nx-mt-8 nx-mb-16 nx-text-gray-400 nx-text-sm">
      {date} by {children}
    </div>
  );
}

export function Author({ name, link }) {
  return (
    <span className="after:nx-content-[','] last:after:nx-content-['']">
      <a
        key={name}
        href={link}
        target="_blank"
        className="nx-mx-1 nx-text-gray-800 dark:nx-text-gray-100"
      >
        {name}
      </a>
    </span>
  );
}
