import React, { ComponentProps, ReactElement } from 'react'
import { CopyToClipboard } from './copy-to-clipboard'

export const Pre = ({
  children,
  className,
  ...props
}: ComponentProps<'pre'> & {
  'data-filename'?: string
  'data-nextra-copy'?: ''
}): ReactElement => {
  const hasCopy = 'data-nextra-copy' in props
  const filename = props['data-filename']

  return (
    <>
      {filename && (
        <div className="bg-primary-700/5 text-gray-700 absolute top-0 z-[1] w-full truncate rounded-t-xl py-2 px-4 text-xs dark:bg-primary-300/10 dark:text-gray-200">
          {filename}
        </div>
      )}
      <pre
        className={[
          'bg-primary-700/5 mt-6 mb-4 overflow-x-auto rounded-xl font-medium subpixel-antialiased dark:bg-primary-300/10',
          filename ? 'pt-12 pb-4' : 'py-4',
          className || ''
        ].join(' ')}
        {...props}
      >
        {children}
      </pre>
      {hasCopy && (
        <CopyToClipboard
          value={children}
          className={'opacity-0 transition-opacity absolute m-2 right-0 ' + (filename ? 'top-8' : 'top-0')}
        />
      )}
    </>
  )
}
