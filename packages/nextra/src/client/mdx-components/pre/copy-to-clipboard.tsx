'use client'

import type { ComponentProps, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../components/button.js'
import { CheckIcon, CopyIcon } from '../../icons/index.js'

export const CopyToClipboard: FC<ComponentProps<'button'>> = props => {
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
