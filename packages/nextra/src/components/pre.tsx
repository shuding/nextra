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
        <div className="nx-bg-primary-700/5 nx-text-gray-700 nx-absolute nx-top-0 nx-z-[1] nx-w-full nx-truncate nx-rounded-t-xl nx-py-2 nx-px-4 nx-text-xs dark:nx-bg-primary-300/10 dark:nx-text-gray-200">
          {filename}
        </div>
      )}
      <pre
        className={[
          'nx-bg-primary-700/5 nx-mt-6 nx-mb-4 nx-overflow-x-auto nx-rounded-xl nx-font-medium nx-subpixel-antialiased dark:nx-bg-primary-300/10',
          'contrast-more:nx-border contrast-more:nx-border-primary-900/20 contrast-more:nx-contrast-150 contrast-more:dark:nx-border-primary-100/40',
          filename ? 'nx-pt-12 nx-pb-4' : 'nx-py-4',
          className
        ].join(' ')}
        {...props}
      >
        {children}
      </pre>
      <div
        className={[
          'nx-opacity-0 nx-transition-opacity [div:hover>&]:nx-opacity-100',
          'nx-flex nx-gap-1 nx-absolute nx-m-2 nx-right-0',
          filename ? 'nx-top-8' : 'nx-top-0'
        ].join(' ')}
      >
        <Button
          tabIndex={-1}
          onClick={toggleWordWrap}
          className="md:nx-hidden"
          title="Toggle word wrap"
        >
          <WordWrapIcon className="nx-pointer-events-none nx-w-4 nx-h-4" />
        </Button>
        {value && <CopyToClipboard tabIndex={-1} value={value} />}
      </div>
    </>
  )
}
