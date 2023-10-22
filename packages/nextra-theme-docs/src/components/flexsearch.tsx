import cn from 'clsx'
import escapeStringRegexp from 'escape-string-regexp'
// flexsearch types are incorrect, they were overwritten in tsconfig.json
import FlexSearch from 'flexsearch'
import type { SearchData } from 'nextra'
import { useRouter } from 'nextra/hooks'
import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import { DEFAULT_LOCALE } from '../constants'
import type { SearchResult } from '../types'
import { Search } from './search'

const TARGET_SUMMARY_LENGTH = 100
const MIN_TOKEN_LENGTH = 3
const PAGE_TITLE_SCORE_BOOST = 10
const SECTION_TITLE_SCORE_BOOST = 10

const SEARCH_LIMIT = 100
const PAGE_LIMIT = 10
const SECTION_LIMIT = 3

type Section = {
  anchor: string
  title: string
  content: string
}

type Document = {
  title: string
  route: string
  sections: Section[]
}

type PageIndex = FlexSearch.Document<Document, ['title', 'route', 'sections']>

interface ScoredDocument {
  score: number
  doc: Document
}

interface ContentPart {
  highlight?: boolean
  value: string
}

type PageSection = {
  title: ContentPart[]
  anchor: string
  content: ContentPart[]
}

type Page = {
  title: ContentPart[]
  route: string
  sections: PageSection[]
}

// This can be global for better caching.
const indexes: {
  [locale: string]: PageIndex
} = {}

// Caches promises that load the index
const loadIndexesPromises = new Map<string, Promise<void>>()
export const loadIndexes = (
  basePath: string,
  locale: string
): Promise<void> => {
  const key = basePath + '@' + locale
  if (loadIndexesPromises.has(key)) {
    return loadIndexesPromises.get(key)!
  }
  const promise = loadIndexesImpl(basePath, locale)
  loadIndexesPromises.set(key, promise)
  return promise
}

const loadIndexesImpl = async (
  basePath: string,
  locale: string
): Promise<void> => {
  const response = await fetch(
    `${basePath}/_next/static/chunks/nextra-data-${locale}.json`
  )
  const searchData = (await response.json()) as SearchData

  const index: PageIndex = new FlexSearch.Document({
    cache: 100,
    tokenize: 'full',
    document: {
      id: 'id',
      index: ['title', 'sections[]:title', 'sections[]:content'],
      store: ['title', 'route', 'sections']
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  })

  let pageId = 0

  for (const [route, structurizedData] of Object.entries(searchData)) {
    const sections: Section[] = []

    for (const [key, content] of Object.entries(structurizedData.data)) {
      const [anchor, title] = key.split('#', 2)

      sections.push({ anchor, title, content })
    }

    index.add(pageId++, {
      route,
      title: structurizedData.title,
      sections
    })
  }

  indexes[locale] = index
}

export function compileQuery(query: string): RegExp {
  const tokens = query
    .split(/\W+/)
    .filter(token => token.length >= MIN_TOKEN_LENGTH)
    .filter((value, index, array) => array.indexOf(value) === index)
    .map(escapeStringRegexp)

  if (!tokens.length) {
    query = query.trim()
    if (query) tokens.push(escapeStringRegexp(query))
  }

  return tokens.length ? new RegExp('(' + tokens.join('|') + ')', 'ig') : /^$/
}

export function scoreText(regex: RegExp, text: string): number {
  if (!text) return 0

  const scored: Record<string, boolean> = {}
  let score = 0

  let result: RegExpExecArray | null = null
  regex.lastIndex = 0
  while ((result = regex.exec(text)) != null) {
    const token = (result[1] || '').toLowerCase()
    if (token.length >= 3 && !scored[token]) {
      score += (result[1] || '').length
      scored[token] = true
    }
  }

  return score
}

// attempt to find the largest group of highlights that fit within
// the target length
export function reduceHighlights(highlights: number[]): number[] {
  if (
    highlights.length <= 2 ||
    highlights[highlights.length - 1] - highlights[0] < TARGET_SUMMARY_LENGTH
  ) {
    return highlights
  }

  // find largest gap
  let largestGap = 0
  let largestGapIndex = 0
  for (let i = 0; i < highlights.length - 2; i += 2) {
    const gap = highlights[i + 2] - highlights[i + 1]

    if (gap >= largestGap) {
      largestGap = gap
      largestGapIndex = i + 2
    }
  }

  // reduce left
  let left = highlights.slice(0, largestGapIndex)
  if (
    left.length > 2 &&
    left[left.length - 1] - left[0] > TARGET_SUMMARY_LENGTH
  ) {
    left = reduceHighlights(left)
  }

  // reduce right
  let right = highlights.slice(largestGapIndex)
  if (
    right.length > 2 &&
    right[right.length - 1] - right[0] > TARGET_SUMMARY_LENGTH
  ) {
    right = reduceHighlights(right)
  }

  // sum left highlights
  let leftHighlightLength = 0
  for (let i = 0; i < left.length; i += 2) {
    leftHighlightLength += left[i + 1] - left[i]
  }

  // sum right highlights
  let rightHighlightLength = 0
  for (let i = 0; i < right.length; i += 2) {
    rightHighlightLength += right[i + 1] - right[i]
  }

  // if both sides have content, prefer the one that doesn't
  // exceed the target length
  if (leftHighlightLength > 0 && rightHighlightLength > 0) {
    const leftOver = left[left.length - 1] - left[0] > TARGET_SUMMARY_LENGTH
    const rightOver = right[right.length - 1] - right[0] > TARGET_SUMMARY_LENGTH
    if (leftOver != rightOver) return rightOver ? left : right
  }

  return rightHighlightLength > leftHighlightLength ? right : left
}

// summarize takes text and a list of highlights in the format
// [startPos,endPos,startPos2,endPos2,...] and reduces the length of
// the text to about TARGET_SUMMARY_LENGTH while attempting to
// position the selected text around the provided highlights.
//
// It will add `...` to the beginning or end of the text if it
// truncates the results.
//
// It returns a list of objects that include a section of the
// text and whether it should be highlighted or not.
export function summarize(text: string, highlights: number[]): ContentPart[] {
  if (!text) return []

  // attempt to find highlights that fit within target summary length
  highlights = reduceHighlights(highlights)

  let startIndex = 0
  let endIndex = TARGET_SUMMARY_LENGTH
  if (highlights.length) {
    startIndex = highlights[0]
    endIndex = highlights[highlights.length - 1]
  }

  const wb = /\b/g
  let result: RegExpExecArray | null = null

  // find the first word boundary in the text, we need this to
  // make sure we expand to the beginning of the text if the
  // start of the text is a non-word
  let firstIndex = startIndex
  if ((result = wb.exec(text)) != null) firstIndex = result.index

  // expand head/tail at word boundaries until we've hit our target summary
  // length
  let remaining = TARGET_SUMMARY_LENGTH - (endIndex - startIndex)
  while (remaining > 0) {
    // expand head using nearest left word boundary
    wb.lastIndex = Math.max(startIndex - remaining, 0)
    if (wb.lastIndex < startIndex) {
      let lastIndex = startIndex

      while ((result = wb.exec(text)) != null && result.index < startIndex) {
        lastIndex = result.index
        wb.lastIndex = lastIndex + 1
      }

      // ensure we expand to the beginning of text if first character
      // is a non-word
      if (lastIndex === firstIndex) lastIndex = 0

      if (
        lastIndex < startIndex &&
        endIndex - lastIndex < TARGET_SUMMARY_LENGTH
      ) {
        startIndex = lastIndex
      }
    }

    // expand tail using word boundary to the right of highlight
    wb.lastIndex = endIndex + 1
    result = wb.exec(text)
    if (result != null && result.index - startIndex < TARGET_SUMMARY_LENGTH) {
      endIndex = result.index
    }

    const newRemaining = TARGET_SUMMARY_LENGTH - (endIndex - startIndex)
    // if we don't make any progress stop
    if (newRemaining === remaining) break
    remaining = newRemaining
  }

  // expand tail to end of the text
  if (endIndex + remaining > text.length) endIndex = text.length

  const parts: ContentPart[] = []

  // create contents list
  let bufferIndex = startIndex
  while (highlights.length) {
    // add leading non-highlighted text
    if (bufferIndex < highlights[0]) {
      parts.push({ value: text.slice(bufferIndex, highlights[0]) })
    }

    // add highlighted text
    const start = highlights.shift() as number
    const end = highlights.shift() as number
    parts.push({
      value: text.slice(start, end),
      highlight: true
    })
    bufferIndex = end
  }

  // if we have no highlights endIndex might be TARGET_SUMMARY_LENGTH,
  // truncate to actual length
  endIndex = Math.min(endIndex, text.length)

  // add remaining text
  if (bufferIndex < endIndex) {
    parts.push({ value: text.slice(bufferIndex, endIndex) })
  }

  // add leading and trailing '...' if content truncated
  if (parts.length) {
    if (startIndex !== 0) {
      const first = parts[0]
      first.value = first.value.trimStart()
      if (first.highlight) {
        parts.unshift({ value: '... ' })
      } else {
        first.value = '... ' + first.value
      }
    }
    if (endIndex < text.length) {
      const last = parts[parts.length - 1]
      last.value = last.value.trimEnd()
      if (last.highlight) {
        parts.push({ value: ' ...' })
      } else {
        last.value += ' ...'
      }
    }
  }

  return parts
}

// highlight finds the positions to highlight in the form
// [startPos,endPos,startPos2,endPos2,...] and summarizes
// the results.
export function highlight(regex: RegExp, text: string): ContentPart[] {
  const highlights: number[] = []

  let result: RegExpExecArray | null = null
  regex.lastIndex = 0
  while ((result = regex.exec(text)) != null) {
    highlights.push(result.index, result.index + (result[1] || '').length)
  }

  return summarize(text, highlights)
}

export function getResults(query: string, locale: string) {
  if (!query) return []

  const index = indexes[locale]
  if (!index) return []

  const resultSets = index.search<true>(query, SEARCH_LIMIT, {
    enrich: true
  })
  if (!resultSets.length) return []

  const queryRegex = compileQuery(query)

  // score docs by number of times matched and title score
  const scoredDocMap: Record<string, ScoredDocument> = {}
  for (const resultSet of resultSets) {
    for (const { doc } of resultSet.result) {
      let scoredDoc: ScoredDocument = scoredDocMap[doc.route]
      if (!scoredDoc) {
        scoredDoc = {
          score: scoreText(queryRegex, doc.title) * PAGE_TITLE_SCORE_BOOST,
          doc
        }
        scoredDocMap[doc.route] = scoredDoc
      }
      scoredDoc.score++
    }
  }

  // get top scoring pages
  const scoredDocs = Object.values(scoredDocMap)
    .sort((a, b) => b.score - a.score)
    .slice(0, PAGE_LIMIT)

  const pages: Page[] = []
  for (const { doc } of scoredDocs) {
    // score each section and create summary with highlighted parts
    let sections = doc.sections.map(section => {
      const title = highlight(queryRegex, section.title)
      let score =
        scoreText(queryRegex, section.title) * SECTION_TITLE_SCORE_BOOST

      if (!section.content) {
        return {
          score,
          title,
          anchor: section.anchor,
          content: []
        }
      }

      return {
        score: score + scoreText(queryRegex, section.content),
        title,
        anchor: section.anchor,
        content: highlight(queryRegex, section.content)
      }
    })

    sections.sort((a, b) => b.score - a.score)

    let placeholderContent: ContentPart[] = []

    // remove zero score sections
    while (sections.length && sections[sections.length - 1].score === 0) {
      const section = sections.pop()
      if (section?.content.length) placeholderContent = section.content
    }

    const pageTitle = highlight(queryRegex, doc.title)

    // if we don't have any matched sections, add a placeholder
    if (!sections.length) {
      sections.push({
        title: pageTitle,
        anchor: '',
        content: placeholderContent,
        score: 0
      })
    } else if (sections.length > SECTION_LIMIT) {
      sections = sections.slice(0, SECTION_LIMIT)
    }

    pages.push({
      title: pageTitle,
      route: doc.route,
      sections: sections
    })
  }

  return pages
}

function Content({
  parts,
  highlight
}: {
  parts: ContentPart[]
  highlight?: boolean
}) {
  if (!highlight) {
    return parts.map(part => part.value).join('')
  }

  return parts.map((part, index) => {
    return (
      <span key={index} className={cn({ '_text-primary-600': part.highlight })}>
        {part.value}
      </span>
    )
  })
}

export function Flexsearch({
  className
}: {
  className?: string
}): ReactElement {
  const { locale = DEFAULT_LOCALE, basePath } = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')

  const preload = useCallback(
    async (active: boolean) => {
      if (active && !indexes[locale]) {
        setLoading(true)
        try {
          await loadIndexes(basePath, locale)
        } catch {
          setError(true)
        }
        setLoading(false)
      }
    },
    [locale, basePath]
  )

  const handleChange = async (value: string) => {
    setSearch(value)
    if (loading) return
    if (!indexes[locale]) {
      setLoading(true)
      try {
        await loadIndexes(basePath, locale)
      } catch {
        setError(true)
      }
      setLoading(false)
    }

    setResults(
      getResults(value, locale).flatMap(page => {
        return page.sections.map((section, i) => {
          const route = section.anchor
            ? `${page.route}#${section.anchor}`
            : page.route

          return {
            id: route,
            route,
            prefix: i == 0 && (
              <div
                className={cn(
                  '_mx-2.5 _mb-2 _mt-6 _select-none _border-b _border-black/10 _px-2.5 _pb-1.5 _text-xs _font-semibold _uppercase _text-gray-500 first:_mt-0 dark:_border-white/20 dark:_text-gray-300',
                  'contrast-more:_border-gray-600 contrast-more:_text-gray-900 contrast-more:dark:_border-gray-50 contrast-more:dark:_text-gray-50'
                )}
              >
                <Content parts={page.title} />
              </div>
            ),
            children: (
              <>
                <div className="_text-base _font-semibold _leading-5">
                  <Content
                    parts={section.title.length ? section.title : page.title}
                    highlight={true}
                  />
                </div>
                {!!section.content.length && (
                  <div className="excerpt _mt-1 _text-sm _leading-[1.35rem] _text-gray-600 dark:_text-gray-400 contrast-more:dark:_text-gray-50">
                    <Content parts={section.content} highlight={true} />
                  </div>
                )}
              </>
            )
          }
        })
      })
    )
  }

  return (
    <Search
      loading={loading}
      error={error}
      value={search}
      onChange={handleChange}
      onActive={preload}
      className={className}
      overlayClassName="_w-screen _min-h-[100px] _max-w-[min(calc(100vw-2rem),calc(100%+20rem))]"
      results={results}
    />
  )
}
