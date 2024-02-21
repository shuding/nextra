import cn from 'clsx'
import type { Heading } from 'nextra'
import { removeLinks } from 'nextra/remove-links'
import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useActiveAnchor, useThemeConfig } from '../contexts'
import { renderComponent } from '../utils'
import { Anchor } from './anchor'
import { BackToTop } from './back-to-top'

export type TOCProps = {
  toc: Heading[]
  filePath: string
}

const linkClassName = cn(
  '_text-xs _font-medium _text-gray-500 hover:_text-gray-900 dark:_text-gray-400 dark:hover:_text-gray-100',
  'contrast-more:_text-gray-800 contrast-more:dark:_text-gray-50'
)

export function TOC({ toc, filePath }: TOCProps): ReactElement {
  const activeAnchor = useActiveAnchor()
  const tocRef = useRef<HTMLUListElement>(null)
  const themeConfig = useThemeConfig()

  const hasHeadings = toc.length > 0
  const hasMetaInfo = Boolean(
    themeConfig.feedback.content ||
      themeConfig.editLink.component ||
      themeConfig.toc.extraContent
  )

  const activeSlug = Object.entries(activeAnchor).find(
    ([, { isActive }]) => isActive
  )?.[0]
  const activeIndex = toc.findIndex(({ id }) => id === activeSlug)

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(`a[href="#${activeSlug}"]`)

    if (anchor) {
      scrollIntoView(anchor, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: tocRef.current
      })
    }
  }, [activeSlug])

  return (
    <div
      className={cn(
        'nextra-scrollbar _sticky _top-16 _overflow-y-auto _pr-4 _pt-6 _text-sm [hyphens:auto]',
        '_max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:_-mr-4 rtl:_-ml-4'
      )}
    >
      {hasHeadings && (
        <>
          <p className="_mb-4 _font-semibold _tracking-tight">
            {renderComponent(themeConfig.toc.title)}
          </p>
          <ul ref={tocRef}>
            {toc.map(({ id, value, depth }) => (
              <li className="_my-2 _scroll-my-6 _scroll-py-6" key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    {
                      2: '_font-semibold',
                      3: 'ltr:_pl-4 rtl:_pr-4',
                      4: 'ltr:_pl-8 rtl:_pr-8',
                      5: 'ltr:_pl-12 rtl:_pr-12',
                      6: 'ltr:_pl-16 rtl:_pr-16'
                    }[depth],
                    '_inline-block _transition-colors _subpixel-antialiased',
                    activeAnchor[id]?.isActive
                      ? '_text-primary-600 contrast-more:!_text-primary-600'
                      : '_text-gray-500 hover:_text-gray-900 dark:_text-gray-400 dark:hover:_text-gray-300',
                    'contrast-more:_text-gray-900 contrast-more:_underline contrast-more:dark:_text-gray-50 _w-full _break-words'
                  )}
                >
                  {removeLinks(value)}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasMetaInfo && (
        <div
          className={cn(
            hasHeadings && 'nextra-toc-footer _mt-8 _pt-8',
            '_sticky _bottom-0 _flex _flex-col _items-start _gap-2 _pb-8'
          )}
        >
          {themeConfig.feedback.content ? (
            <Anchor
              className={linkClassName}
              href={themeConfig.feedback.useLink()}
              newWindow
            >
              {renderComponent(themeConfig.feedback.content)}
            </Anchor>
          ) : null}

          {renderComponent(themeConfig.editLink.component, {
            filePath,
            className: linkClassName,
            children: renderComponent(themeConfig.editLink.content)
          })}

          {renderComponent(themeConfig.toc.extraContent)}

          {themeConfig.toc.backToTop && (
            <BackToTop className={linkClassName} hidden={activeIndex < 2} />
          )}
        </div>
      )}
    </div>
  )
}
