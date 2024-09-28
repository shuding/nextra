'use client'

import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
<<<<<<<< HEAD:packages/nextra/src/client/mdx-components/pre/copy-to-clipboard.tsx
import { Button } from '../../components/button.js'
import { CheckIcon, CopyIcon } from '../../icons/index.js'

export function CopyToClipboard(props: ComponentProps<'button'>): ReactElement {
========
import { CheckIcon, CopyIcon } from '../icons/index.js'
import { Button } from './button.js'

export function CopyToClipboard({
  getValue,
  ...props
}: ComponentProps<typeof Button> & {
  getValue: () => string
}): ReactElement {
>>>>>>>> main:packages/nextra/src/client/components/copy-to-clipboard.tsx
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return
    const timerId = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => {
      clearTimeout(timerId)
    }
  }, [isCopied])

<<<<<<<< HEAD:packages/nextra/src/client/mdx-components/pre/copy-to-clipboard.tsx
  const handleClick = useCallback<
    NonNullable<ComponentProps<'button'>['onClick']>
  >(async event => {
========
  const handleClick = useCallback(async () => {
>>>>>>>> main:packages/nextra/src/client/components/copy-to-clipboard.tsx
    setCopied(true)
    if (!navigator.clipboard) {
      console.error('Access to clipboard rejected!')
      return
    }
    try {
      const container = event.currentTarget.parentNode!.parentNode!
      const content = container.querySelector('pre code')?.textContent || ''
      await navigator.clipboard.writeText(content)
    } catch {
      console.error('Failed to copy!')
    }
  }, [])

  const IconToUse = isCopied ? CheckIcon : CopyIcon

  return (
    <Button
      onClick={handleClick}
      title="Copy code"
      variant="outline"
      {...props}
    >
      <IconToUse height="16" className="nextra-copy-icon" />
    </Button>
  )
}
