import React, { ComponentProps, ReactElement, useCallback } from 'react'
import { CopyToClipboard } from './copy-to-clipboard'
import { Button } from './button'
import { WordWrapIcon } from '../icons'

export const Pre = ({
  children,
  className = '',
  value,
  filename,
  ...props
}: ComponentProps<'pre'> & {
  filename?: string
  value?: string
}): ReactElement => {
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
    <>
      {filename && (
        <div className="bg-primary-700/5 text-gray-700 absolute top-0 z-[1] w-full truncate rounded-t-xl py-2 px-4 text-xs dark:bg-primary-300/10 dark:text-gray-200">
          {filename}
        </div>
      )}
      <pre
        className={[
          'nextra-scrollbar',
          'bg-primary-700/5 mt-6 mb-4 overflow-x-auto rounded-xl font-medium subpixel-antialiased dark:bg-primary-300/10',
          'contrast-more:border contrast-more:border-primary-900/20 contrast-more:contrast-150 contrast-more:dark:border-primary-100/40',
          filename ? 'pt-12 pb-4' : 'py-4',
          className
        ].join(' ')}
        {...props}
      >
        {children}
      </pre>
      <div
        className={[
          'opacity-0 transition-opacity [div:hover>&]:opacity-100',
          'flex gap-1 absolute m-2 right-0',
          filename ? 'top-8' : 'top-0'
        ].join(' ')}
      >
        <Button
          tabIndex={-1}
          onClick={toggleWordWrap}
          className="md:hidden"
          title="Toggle word wrap"
        >
          <WordWrapIcon className="pointer-events-none w-4 h-4" />
        </Button>
        {value && <CopyToClipboard tabIndex={-1} value={value} />}
      </div>
    </>
  )
}
