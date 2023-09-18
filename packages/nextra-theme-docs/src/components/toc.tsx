import cn from 'clsx'
import type { Heading } from 'nextra'
import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useActiveAnchor, useConfig } from '../contexts'
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
  const config = useConfig()
  const tocRef = useRef<HTMLDivElement>(null)

  const hasHeadings = toc.length > 0
  const hasMetaInfo = Boolean(
    config.feedback.content ||
      config.editLink.component ||
      config.toc.extraContent
  )

  const activeSlug = Object.entries(activeAnchor).find(
    ([, { isActive }]) => isActive
  )?.[0]

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(
      `li > a[href="#${activeSlug}"]`
    )

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
      ref={tocRef}
      className={cn(
        'nextra-scrollbar _sticky _top-16 _overflow-y-auto _pr-4 _pt-6 _text-sm [hyphens:auto]',
        '_max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:-_mr-4 rtl:-_ml-4'
      )}
    >
      {hasHeadings && (
        <>
          <p className="nx-mb-4 nx-font-semibold nx-tracking-tight">
            {renderComponent(config.toc.title)}
          </p>
          <ul>
            {toc.map(({ id, value, depth }) => (
              <li className="nx-my-2 nx-scroll-my-6 nx-scroll-py-6" key={id}>
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
                  {value}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasMetaInfo && (
        <div
          className={cn(
            hasHeadings &&
              '_mt-8 _border-t _bg-white _pt-8 _shadow-[0_-12px_16px_white] dark:nx-bg-dark dark:nx-shadow-[0_-12px_16px_#111]',
            '_sticky _bottom-0 _flex _flex-col _items-start _gap-2 nx-pb-8 dark:nx-border-neutral-800',
            'contrast-more:nx-border-t contrast-more:_border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-border-neutral-400'
          )}
        >
          {config.feedback.content ? (
            <Anchor
              className={linkClassName}
              href={config.feedback.useLink()}
              newWindow
            >
              {renderComponent(config.feedback.content)}
            </Anchor>
          ) : null}

          {renderComponent(config.editLink.component, {
            filePath,
            className: linkClassName,
            children: renderComponent(config.editLink.content)
          })}

          {renderComponent(config.toc.extraContent)}

          {config.toc.backToTop && <BackToTop className={linkClassName} />}
        </div>
      )}
    </div>
  )
}
