import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useRef } from 'react'
import { WordWrapIcon } from '../icons/index.js'
import { Button } from './button.js'
import { CopyToClipboard } from './copy-to-clipboard.js'

export const Pre = ({
  children,
  className,
  'data-filename': filename,
  'data-copy': copy,
  'data-language': _language,
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

  return (
    <div className="nextra-code _relative _mt-6 first:_mt-0">
      {filename && (
        <div
          className={cn(
            '_absolute _top-0 _z-[1] _w-full _truncate _rounded-t-xl _bg-primary-700/5 _py-2 _px-4 _text-xs _text-gray-700 dark:_bg-primary-300/10 dark:_text-gray-200',
            '_border-b _border-primary-700/20 dark:_border-primary-100/20'
          )}
        >
          {filename}
        </div>
      )}
      <pre
        className={cn(
          '_ring-1 _ring-inset _ring-primary-700/20 dark:_ring-primary-100/20',
          '_bg-primary-700/5 _mb-4 _overflow-x-auto _rounded-xl _subpixel-antialiased dark:_bg-primary-300/10 _text-[.9em]',
          'contrast-more:_border contrast-more:_border-primary-900/20 contrast-more:_contrast-150 contrast-more:dark:_border-primary-100/40',
          filename ? '_pt-12 _pb-4' : '_py-4',
          className
        )}
        ref={preRef}
        {...props}
      >
        {children}
      </pre>
      <div
        className={cn(
          '_opacity-0 _transition [div:hover>&]:_opacity-100 focus-within:_opacity-100',
          '_flex _gap-1 _absolute _m-[11px] _right-0',
          filename ? '_top-8' : '_top-0'
        )}
      >
        <Button
          onClick={toggleWordWrap}
          className="md:_hidden"
          title="Toggle word wrap"
        >
          <WordWrapIcon className="_pointer-events-none _h-4 _w-4" />
        </Button>
        {copy === '' && (
          <CopyToClipboard
            getValue={() =>
              preRef.current?.querySelector('code')?.textContent || ''
            }
          />
        )}
      </div>
    </div>
  )
}
