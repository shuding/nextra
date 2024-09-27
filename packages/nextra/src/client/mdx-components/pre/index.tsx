import cn from 'clsx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { classes } from '../../components/button.js'
import { WordWrapIcon } from '../../icons/index.js'
import { CopyToClipboard } from './copy-to-clipboard.js'
import { ToggleWordWrapButton } from './toggle-word-wrap-button.js'

export type PreProps = ComponentProps<'pre'> & {
  'data-filename'?: string
  'data-copy'?: ''
  'data-language'?: string
  'data-word-wrap'?: ''
  'data-pagefind-ignore'?: string
  icon?: ReactNode
}

export function Pre({
  children,
  className,
  'data-filename': filename,
  'data-copy': copy,
  'data-language': _language,
  'data-word-wrap': hasWordWrap,
  'data-pagefind-ignore': pagefindIgnore,
  icon,
  ...props
}: PreProps): ReactElement {
  const copyButton = copy === '' && (
    <CopyToClipboard className={filename ? '_ms-auto' : ''} />
  )

  return (
    <div
      data-pagefind-ignore={pagefindIgnore}
      className="nextra-code _relative [&:not(:first-child)]:_mt-6"
    >
      {filename && (
        <div
          className={cn(
            '_px-4 _text-xs _text-gray-700 dark:_text-gray-200',
            '_bg-gray-100 dark:_bg-neutral-900',
            '_flex _items-center _h-12 _gap-2 _rounded-t-md',
            classes.border,
            '_border-b-0'
          )}
        >
          {icon}
          <span className="_truncate">{filename}</span>
          {copyButton}
        </div>
      )}
      <pre
        className={cn(
          'focus-visible:nextra-focus',
          '_overflow-x-auto _subpixel-antialiased _text-[.9em]',
          '_bg-white dark:_bg-black _py-4',
          '_ring-1 _ring-inset _ring-gray-300 dark:_ring-neutral-700',
          'contrast-more:_ring-gray-900 contrast-more:dark:_ring-gray-50',
          'contrast-more:_contrast-150',
          filename ? '_rounded-b-md' : '_rounded-md',
          '_not-prose', // for nextra-theme-blog
          className
        )}
        {...props}
      >
        {children}
      </pre>
      <div
        className={cn(
          '_opacity-0 _transition [div:hover>&]:_opacity-100 focus-within:_opacity-100',
          '_flex _gap-1 _absolute _right-4',
          filename ? '_top-14' : '_top-2'
        )}
      >
        {hasWordWrap === '' && (
          <ToggleWordWrapButton>
            <WordWrapIcon height="16" />
          </ToggleWordWrapButton>
        )}
        {!filename && copyButton}
      </div>
    </div>
  )
}
