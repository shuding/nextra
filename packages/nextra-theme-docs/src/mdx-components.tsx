import cn from 'clsx'
import type { NextraMDXContent } from 'nextra'
import { Code, Pre, Table, Td, Th, Tr } from 'nextra/components'
import { useMounted } from 'nextra/hooks'
import { ArrowRightIcon } from 'nextra/icons'
import type { MDXComponents } from 'nextra/mdx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  Anchor,
  Breadcrumb,
  Collapse,
  NavLinks,
  Sidebar,
  SkipNavContent
} from './components'
import type { AnchorProps } from './components/anchor'
import type { DocsThemeConfig } from './constants'
import { useConfig, useSetActiveAnchor, useThemeConfig } from './contexts'
import { useIntersectionObserver, useSlugs } from './contexts/active-anchor'
import { renderComponent } from './utils'

// Anchor links
const createHeading = (
  Tag: `h${2 | 3 | 4 | 5 | 6}`,
  context: { index: number }
) =>
  function Heading({
    children,
    id,
    className,
    ...props
  }: ComponentProps<'h2'>): ReactElement {
    const setActiveAnchor = useSetActiveAnchor()
    const slugs = useSlugs()
    const observer = useIntersectionObserver()
    const obRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
      const heading = obRef.current
      if (!id || !observer || !heading) return
      observer.observe(heading)
      slugs.set(heading, [id, (context.index += 1)])

      return () => {
        observer.disconnect()
        slugs.delete(heading)
        setActiveAnchor(f => {
          const ret = { ...f }
          delete ret[id]
          return ret
        })
      }
    }, [id, slugs, observer, setActiveAnchor])

    return (
      <Tag
        id={id}
        className={
          // can be added by footnotes
          className === 'sr-only'
            ? '_sr-only'
            : cn(
                '_font-semibold _tracking-tight _text-slate-900 dark:_text-slate-100',
                {
                  h2: '_mt-10 _border-b _pb-1 _text-3xl _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400',
                  h3: '_mt-8 _text-2xl',
                  h4: '_mt-8 _text-xl',
                  h5: '_mt-8 _text-lg',
                  h6: '_mt-8 _text-base'
                }[Tag],
                className
              )
        }
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="nextra-focus subheading-anchor"
            aria-label="Permalink for this section"
            ref={obRef}
          />
        )}
      </Tag>
    )
  }

function Details({
  children,
  open,
  className,
  ...props
}: ComponentProps<'details'>): ReactElement {
  const [isOpen, setIsOpen] = useState(() => !!open)
  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(isOpen)
  const animationRef = useRef(0)

  useEffect(() => {
    const animation = animationRef.current
    if (animation) {
      clearTimeout(animation)
      animationRef.current = 0
    }
    if (!isOpen) {
      animationRef.current = window.setTimeout(
        () => setDelayedOpenState(isOpen),
        300
      )
      return () => {
        clearTimeout(animationRef.current)
      }
    }
    setDelayedOpenState(true)
  }, [isOpen])

  const [summaryElement, restChildren] = useMemo(
    function findSummary(list = children): [summary: ReactNode, ReactNode] {
      let summary: ReactNode

      const rest = Children.map(list, child => {
        if (
          !summary && // Add onClick only for first summary
          child &&
          typeof child === 'object' &&
          'type' in child
        ) {
          if (child.type === Summary) {
            summary = cloneElement(child, {
              onClick(event: MouseEvent) {
                event.preventDefault()
                setIsOpen(v => !v)
              }
            })
            return
          }
          if (child.type !== Details && child.props.children) {
            ;[summary, child] = findSummary(child.props.children)
          }
        }
        return child
      })

      return [summary, rest]
    },
    [children]
  )

  return (
    <details
      className={cn(
        '[&:not(:first-child)]:_mt-4 _rounded _border _border-gray-200 _bg-white _p-2 _shadow-sm dark:_border-neutral-800 dark:_bg-neutral-900',
        '_overflow-hidden',
        className
      )}
      {...props}
      // `isOpen ||` fix issue on mobile devices while clicking on details, open attribute is still
      // false, and we can't calculate child.clientHeight
      open={isOpen || delayedOpenState}
      data-expanded={isOpen ? '' : undefined}
    >
      {summaryElement}
      <Collapse isOpen={isOpen}>{restChildren}</Collapse>
    </details>
  )
}

function Summary({
  children,
  className,
  ...props
}: ComponentProps<'summary'>): ReactElement {
  return (
    <summary
      className={cn(
        'nextra-focus',
        '_flex _items-center _cursor-pointer _p-1 _transition-colors hover:_bg-gray-100 dark:hover:_bg-neutral-800',
        '[&::-webkit-details-marker]:_hidden', // Safari
        // display: flex removes whitespace when `<summary>` contains text with other elements, like `foo <strong>bar</strong>`
        '_whitespace-pre-wrap',
        '_select-none',
        className
      )}
      {...props}
    >
      {children}
      <ArrowRightIcon
        className={cn(
          '_order-first', // if prettier formats `summary` it will have unexpected margin-top
          '_h-4 _shrink-0 _mx-1.5 motion-reduce:_transition-none',
          'rtl:_rotate-180 [[data-expanded]>summary:first-child>&]:_rotate-90 _transition'
        )}
        strokeWidth="3"
      />
    </summary>
  )
}

const EXTERNAL_HREF_REGEX = /https?:\/\//

export const Link = ({ href = '', className, ...props }: AnchorProps) => (
  <Anchor
    href={href}
    newWindow={EXTERNAL_HREF_REGEX.test(href)}
    className={cn(
      '_text-primary-600 _underline hover:_no-underline _decoration-from-font [text-underline-position:from-font]',
      className
    )}
    {...props}
  />
)

const A = ({ href = '', ...props }) => (
  <Anchor href={href} newWindow={EXTERNAL_HREF_REGEX.test(href)} {...props} />
)

const classes = {
  toc: cn(
    'nextra-toc _order-last max-xl:_hidden _w-64 _shrink-0 print:_hidden'
  ),
  main: cn('_w-full _break-words')
}

function Body({ children }: { children: ReactNode }): ReactElement {
  const config = useConfig()
  const themeConfig = useThemeConfig()
  const mounted = useMounted()
  const {
    activeThemeContext: themeContext,
    activeType,
    activeIndex,
    flatDocsDirectories,
    activePath
  } = config.normalizePagesResult

  if (themeContext.layout === 'raw') {
    return <div className={classes.main}>{children}</div>
  }

  const date =
    themeContext.timestamp && themeConfig.gitTimestamp && config.timestamp
      ? new Date(config.timestamp)
      : null

  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    mounted && date ? (
      <div className="_mt-12 _mb-8 _block _text-xs _text-gray-500 ltr:_text-right rtl:_text-left dark:_text-gray-400">
        {renderComponent(themeConfig.gitTimestamp, { timestamp: date })}
      </div>
    ) : (
      <div className="_mt-16" />
    )

  const content = (
    <>
      {renderComponent(themeContext.topContent)}
      {children}
      {gitTimestampEl}
      {renderComponent(themeContext.bottomContent)}
      {activeType !== 'page' && themeContext.pagination && (
        <NavLinks
          flatDocsDirectories={flatDocsDirectories}
          currentIndex={activeIndex}
        />
      )}
    </>
  )

  const body = themeConfig.main ? (
    <themeConfig.main>{content}</themeConfig.main>
  ) : (
    content
  )

  if (themeContext.layout === 'full') {
    return (
      <article
        className={cn(
          classes.main,
          'nextra-content _min-h-[calc(100vh-var(--nextra-navbar-height))] _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {body}
      </article>
    )
  }

  return (
    <article
      className={cn(
        classes.main,
        'nextra-content _flex _min-h-[calc(100vh-var(--nextra-navbar-height))] _min-w-0 _justify-center _pb-8 _pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        themeContext.typesetting === 'article' &&
          'nextra-body-typesetting-article'
      )}
    >
      <main className="_w-full _min-w-0 _max-w-6xl _px-6 _pt-4 md:_px-12">
        {activeType !== 'page' && themeContext.breadcrumb && (
          <Breadcrumb activePath={activePath} />
        )}
        {body}
      </main>
    </article>
  )
}

const DEFAULT_COMPONENTS: MDXComponents = {
  h1: props => (
    <h1
      className="_mt-2 _text-4xl _font-bold _tracking-tight _text-slate-900 dark:_text-slate-100"
      {...props}
    />
  ),
  ul: props => (
    <ul
      className="[:is(ol,ul)_&]:_my-3 [&:not(:first-child)]:_mt-6 _list-disc ltr:_ml-6 rtl:_mr-6"
      {...props}
    />
  ),
  ol: props => (
    <ol
      className="[:is(ol,ul)_&]:_my-3 [&:not(:first-child)]:_mt-6 _list-decimal ltr:_ml-6 rtl:_mr-6"
      {...props}
    />
  ),
  li: props => <li className="_my-2" {...props} />,
  blockquote: props => (
    <blockquote
      className={cn(
        '[&:not(:first-child)]:_mt-6 _border-gray-300 _italic _text-gray-700 dark:_border-gray-700 dark:_text-gray-400',
        'ltr:_border-l-2 ltr:_pl-6 rtl:_border-r-2 rtl:_pr-6'
      )}
      {...props}
    />
  ),
  hr: props => (
    <hr
      className="_my-8 _border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400"
      {...props}
    />
  ),
  a: Link,
  table: props => (
    <Table
      {...props}
      className={cn(
        'nextra-scrollbar [&:not(:first-child)]:_mt-6 _p-0',
        props.className
      )}
    />
  ),
  p: props => (
    <p className="[&:not(:first-child)]:_mt-6 _leading-7" {...props} />
  ),
  tr: Tr,
  th: Th,
  td: Td,
  details: Details,
  summary: Summary,
  pre: Pre,
  code: Code,
  wrapper: function NextraWrapper({ toc, children }) {
    const config = useConfig()
    const themeConfig = useThemeConfig()
    const {
      activeType,
      activeThemeContext: themeContext,
      docsDirectories,
      directories
    } = config.normalizePagesResult

    const tocEl =
      activeType === 'page' ||
      !themeContext.toc ||
      themeContext.layout !== 'default' ? (
        themeContext.layout !== 'full' &&
        themeContext.layout !== 'raw' && (
          <nav className={classes.toc} aria-label="table of contents" />
        )
      ) : (
        <nav className={classes.toc} aria-label="table of contents">
          {renderComponent(themeConfig.toc.component, {
            toc: themeConfig.toc.float ? toc : [],
            filePath: config.filePath
          })}
        </nav>
      )
    return (
      <div
        className={cn(
          '_mx-auto _flex',
          themeContext.layout !== 'raw' && '_max-w-[90rem]'
        )}
      >
        <Sidebar
          docsDirectories={docsDirectories}
          fullDirectories={directories}
          toc={toc}
          asPopover={config.hideSidebar}
          includePlaceholder={themeContext.layout === 'default'}
        />
        {tocEl}
        <SkipNavContent />
        <Body>{children}</Body>
      </div>
    )
  } satisfies NextraMDXContent
}

export function getComponents({
  isRawLayout,
  components
}: {
  isRawLayout?: boolean
  components?: DocsThemeConfig['components']
}): MDXComponents {
  if (isRawLayout) {
    // @ts-expect-error
    return { a: A, wrapper: DEFAULT_COMPONENTS.wrapper }
  }

  const context = { index: 0 }
  return {
    ...DEFAULT_COMPONENTS,
    h2: createHeading('h2', context),
    h3: createHeading('h3', context),
    h4: createHeading('h4', context),
    h5: createHeading('h5', context),
    h6: createHeading('h6', context),
    ...components
  }
}
