import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useRef } from 'react'
import {
  JavaScriptIcon,
  MarkdownIcon,
  TypeScriptIcon,
  WordWrapIcon
} from '../icons/index.js'
import { Button } from './button.js'
import { CopyToClipboard } from './copy-to-clipboard.js'

export const Pre = ({
  children,
  className,
  'data-filename': filename,
  'data-copy': copy,
  'data-language': language,
  ...props
}: ComponentProps<'pre'> & {
  'data-filename'?: string
  'data-copy'?: ''
  'data-language'?: string
}): ReactElement => {
  const preRef = useRef<HTMLPreElement | null>(null)

  const toggleWordWrap = useCallback(() => {
    const htmlDataset = document.documentElement.dataset
    const hasWordWrap = 'nextraWordWrap' in htmlDataset
    if (hasWordWrap) {
      delete htmlDataset.nextraWordWrap
    } else {
      htmlDataset.nextraWordWrap = ''
    }
  }, [])

  const hasCopyCode = copy === ''

  const copyButton = hasCopyCode && (
    <CopyToClipboard
      className={filename ? '_ml-auto' : ''}
      getValue={() => preRef.current?.querySelector('code')?.textContent || ''}
    />
  )

  const IconToUse = {
    js: JavaScriptIcon,
    ts: TypeScriptIcon,
    md: MarkdownIcon
  }[language!]

  return (
    <div className="nextra-code _relative _mt-6 first:_mt-0">
      {filename && (
        <div
          className={cn(
            '_absolute _z-[1] _w-full _truncate _rounded-t-md _pl-3 _pr-4 _text-xs _text-gray-700 dark:_text-gray-200',
            '_bg-gray-100 _border _border-gray-300 dark:_border-neutral-700 dark:_bg-neutral-900',
            '_flex _items-center _h-12 _gap-2'
          )}
        >
          {IconToUse && <IconToUse className="_h-5 _w-5" />}
          {filename}
          {copyButton}
        </div>
      )}
      <pre
        className={cn(
          '_border _border-gray-300 dark:_border-neutral-700',
          '_mb-4 _overflow-x-auto _rounded-md _subpixel-antialiased _text-[.9em]',
          'contrast-more:_border contrast-more:_border-primary-900/20 contrast-more:_contrast-150 contrast-more:dark:_border-primary-100/40',
          filename ? '_pt-16 _pb-4' : '_py-4',
          'dark:_bg-black _relative',
          className
        )}
        ref={preRef}
        {...props}
      >
        {children}
        <div
          className={cn(
            '_opacity-0 _transition [div:hover>pre>&]:_opacity-100 focus-within:_opacity-100',
            '_flex _gap-1 _absolute _right-4',
            filename ? '_top-14' : '_top-2'
          )}
        >
          <Button
            onClick={toggleWordWrap}
            className="md:_hidden"
            title="Toggle word wrap"
          >
            <WordWrapIcon className="_pointer-events-none _h-4 _w-4" />
          </Button>
          {!filename && copyButton}
        </div>
      </pre>
    </div>
  )
}
