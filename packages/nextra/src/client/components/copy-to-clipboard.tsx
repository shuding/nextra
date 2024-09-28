import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { CheckIcon, CopyIcon } from '../icons/index.js'
import { Button } from './button.js'

export function CopyToClipboard({
  getValue,
  ...props
}: ComponentProps<typeof Button> & {
  getValue: () => string
}): ReactElement {
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

  const handleClick = useCallback(async () => {
    setCopied(true)
    if (!navigator?.clipboard) {
      console.error('Access to clipboard rejected!')
    }
    try {
      await navigator.clipboard.writeText(getValue())
    } catch {
      console.error('Failed to copy!')
    }
  }, [getValue])

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
