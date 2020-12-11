import React from 'react'
import Link from 'next/link'

export default function Meta({ author, date, tag, back }) {
  const authorNode = author ? author : null
  const dateNode = date ? <time>{new Date(date).toDateString()}</time> : null
  const tags = tag ? tag.split(',').map(s => s.trim()) : []

  return (
    <div className="meta-line">
      <div className="meta">
        {authorNode}
        {authorNode && dateNode ? ', ' : null}
        {dateNode}
        {(authorNode || dateNode) && tags.length ? ' • ' : null}
        {tags.map(t => {
          return (
            <Link key={t} href="/tags/[tag]" as={`/tags/${t}`}>
              <a className="tag">{t}</a>
            </Link>
          )
        })}
      </div>
      {back ? (
        <Link href={back}>
          <a className="meta-back">Back</a>
        </Link>
      ) : null}
    </div>
  )
}
