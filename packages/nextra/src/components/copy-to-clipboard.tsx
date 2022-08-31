import React, {
  ComponentProps,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react'
import { onlyText } from 'react-children-utilities'
import { CheckIcon, CopyIcon } from '../icons'
import { Button } from './button'

export const CopyToClipboard = ({
  value,
  className = ''
}: {
  value: ReactNode
  className?: string
}): ReactElement => {
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
  >(async () => {
    setCopied(true)
    if (!navigator?.clipboard) {
      console.error('Access to clipboard rejected!')
    }
    try {
      await navigator.clipboard.writeText(onlyText(value))
    } catch {
      console.error('Failed to copy!')
    }
  }, [value])

  const IconToUse = isCopied ? CheckIcon : CopyIcon

  return (
    <Button
      onClick={handleClick}
      className={['nextra-copy-button transition-colors', className].join(' ')}
    >
      <IconToUse className="pointer-events-none h-4 w-4" />
    </Button>
  )
}
