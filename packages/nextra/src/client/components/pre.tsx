import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useRef } from 'react'
import {
  JavaScriptIcon,
  MarkdownIcon,
  MdxIcon,
  TypeScriptIcon,
  WordWrapIcon,
  TerminalIcon
} from '../icons/index.js'
import { Button, classes } from './button.js'
import { CopyToClipboard } from './copy-to-clipboard.js'

function getIcon(language = '') {
  if (!language) {
    return null
  }

  switch (language) {
    case 'js':
    case 'jsx':
      return JavaScriptIcon
    case 'ts':
    case 'tsx':
      return TypeScriptIcon
    case 'md':
      return MarkdownIcon
    case 'mdx':
      return MdxIcon
    case 'sh':
    case 'bash':
      return TerminalIcon
  }
}

export function Pre({
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
}): ReactElement {
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

  const copyButton = copy === '' && (
    <CopyToClipboard
      className={filename ? '_ml-auto' : ''}
      getValue={() => preRef.current?.querySelector('code')?.textContent || ''}
    />
  )

  const IconToUse = getIcon(language)

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
          {IconToUse && <IconToUse className="_h-3.5 _w-auto _shrink-0" />}
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
        ref={preRef}
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
        <Button
          onClick={toggleWordWrap}
          className="md:_hidden"
          title="Toggle word wrap"
        >
          <WordWrapIcon className="_h-4 _w-auto" />
        </Button>
        {!filename && copyButton}
      </div>
    </div>
  )
}
