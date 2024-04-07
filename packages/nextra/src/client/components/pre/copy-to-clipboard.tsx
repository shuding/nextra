'use client'

import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { CheckIcon, CopyIcon } from '../../icons/index.js'
import { Button } from '../button.js'

export function CopyToClipboard(props: ComponentProps<'button'>): ReactElement {
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

  const handleClick = useCallback<
    NonNullable<ComponentProps<'button'>['onClick']>
  >(async event => {
    setCopied(true)
    if (!navigator.clipboard) {
      console.error('Access to clipboard rejected!')
      return
    }
    try {
      const container = (event.target as any).parentNode.parentNode
      const content = container.querySelector('pre code')?.textContent || ''
      await navigator.clipboard.writeText(content)
    } catch {
      console.error('Failed to copy!')
    }
  }, [])

  const IconToUse = isCopied ? CheckIcon : CopyIcon

  return (
    <Button onClick={handleClick} title="Copy code" tabIndex={0} {...props}>
      <IconToUse className="nextra-copy-icon _pointer-events-none _size-4" />
    </Button>
  )
}
