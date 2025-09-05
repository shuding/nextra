import cn from 'clsx'
import type { FC, HTMLAttributes, ReactNode } from 'react'
import { WordWrapIcon } from '../../icons/index.js'
import { CopyToClipboard } from './copy-to-clipboard.js'
import { ToggleWordWrapButton } from './toggle-word-wrap-button.js'

export const classes = {
  border: cn(
    'x:border x:border-gray-300 x:dark:border-neutral-700',
    'x:contrast-more:border-gray-900 x:contrast-more:dark:border-gray-50'
  )
}

export type PreProps = HTMLAttributes<HTMLPreElement> & {
  'data-filename'?: string
  'data-copy'?: ''
  'data-language'?: string
  'data-word-wrap'?: ''
  'data-pagefind-ignore'?: string
  icon?: ReactNode
}

export const Pre: FC<PreProps> = ({
  children,
  className,
  'data-filename': filename,
  'data-copy': copy,
  'data-language': _language,
  'data-word-wrap': hasWordWrap,
  'data-pagefind-ignore': pagefindIgnore,
  icon,
  ...props
}) => {
  const copyButton = copy === '' && (
    <CopyToClipboard className={filename ? 'x:ms-auto x:text-sm' : ''} />
  )

  return (
    <div
      data-pagefind-ignore={pagefindIgnore}
      className="nextra-code x:relative x:not-first:mt-[1.25em]"
    >
      {filename && (
        <div
          className={cn(
            'x:px-4 x:text-xs x:text-gray-700 x:dark:text-gray-200',
            'x:bg-gray-100 x:dark:bg-neutral-900',
            'x:flex x:items-center x:h-12 x:gap-2 x:rounded-t-md',
            classes.border,
            'x:border-b-0'
          )}
        >
          {icon}
          <span className="x:truncate">{filename}</span>
          {copyButton}
        </div>
      )}
      <pre
        className={cn(
          'x:group',
          'x:focus-visible:nextra-focus',
          'x:overflow-x-auto x:subpixel-antialiased x:text-[.9em]',
          'x:bg-white x:dark:bg-black x:py-4',
          'x:ring-1 x:ring-inset x:ring-gray-300 x:dark:ring-neutral-700',
          'x:contrast-more:ring-gray-900 x:contrast-more:dark:ring-gray-50',
          'x:contrast-more:contrast-150',
          filename ? 'x:rounded-b-md' : 'x:rounded-md',
          'not-prose', // for nextra-theme-blog
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'x:group-hover:opacity-100',
            'x:group-focus:opacity-100',
            'x:opacity-0 x:transition x:focus-within:opacity-100',
            'x:flex x:gap-1 x:absolute x:right-4',
            filename ? 'x:top-14' : 'x:top-2'
          )}
        >
          {hasWordWrap === '' && (
            <ToggleWordWrapButton>
              <WordWrapIcon height="1em" />
            </ToggleWordWrapButton>
          )}
          {!filename && copyButton}
        </div>
        {children}
      </pre>
    </div>
  )
}
