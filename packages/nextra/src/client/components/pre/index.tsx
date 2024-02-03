import cn from 'clsx'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { WordWrapIcon } from '../../icons/index.js'
import { classes } from '../button.js'
import { CopyToClipboard } from './copy-to-clipboard.js'
import { ToggleWordWrapButton } from './toggle-word-wrap-button.js'

export type PreProps = ComponentProps<'pre'> & {
  'data-filename'?: string
  'data-copy'?: ''
  'data-language'?: string
  'data-word-wrap'?: ''
  icon?: ReactNode
}

export function Pre({
  children,
  className,
  'data-filename': filename,
  'data-copy': copy,
  'data-language': _language,
  'data-word-wrap': hasWordWrap,
  icon,
  ...props
}: PreProps): ReactElement {
  const copyButton = copy === '' && (
    <CopyToClipboard className={filename ? '_ms-auto' : ''} />
  )

  return (
    <div className="nextra-code _relative _mt-6 first:_mt-0">
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
          '_overflow-x-auto _subpixel-antialiased _text-[.9em]',
          'dark:_bg-black _py-4',
          '_ring-1 _ring-inset _ring-gray-300 dark:_ring-neutral-700',
          'contrast-more:_ring-gray-900 contrast-more:dark:_ring-gray-50',
          'contrast-more:_contrast-150',
          filename ? '_rounded-b-md' : '_rounded-md',
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
            <WordWrapIcon className="_h-4 _w-auto" />
          </ToggleWordWrapButton>
        )}
        {!filename && copyButton}
      </div>
    </div>
  )
}
