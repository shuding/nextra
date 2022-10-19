import React, { ReactElement, ReactNode } from 'react'
import cn from 'clsx'
import { InformationCircleIcon } from 'nextra/icons'

const TypeToEmoji = {
  default: '💡',
  error: '🚫',
  info: <InformationCircleIcon className="mt-1" />,
  warning: '⚠️'
}

type CalloutType = keyof typeof TypeToEmoji

const themes: Record<CalloutType, string> = {
  default:
    'bg-orange-50 border-orange-100 text-orange-800 dark:text-orange-300 dark:bg-orange-400/20 dark:border-orange-400/30',
  error:
    'bg-red-100 border-red-200 text-red-900 dark:text-red-200 dark:bg-red-900/30 dark:border-red-200/30',
  info: 'bg-blue-100 border-blue-200 text-blue-900 dark:text-blue-200 dark:bg-blue-900/30 dark:border-blue-200/30',
  warning:
    'bg-yellow-50 border-yellow-100 text-yellow-900 dark:text-yellow-200 dark:bg-yellow-700/30'
}

type CalloutProps = {
  type?: CalloutType
  emoji?: string | ReactElement
  children: ReactNode
}

export function Callout({
  children,
  type = 'default',
  emoji = TypeToEmoji[type]
}: CalloutProps): ReactElement {
  return (
    <div
      className={cn(
        'nextra-callout border mt-6 flex rounded-lg py-2 ltr:pr-4 rtl:pl-4',
        'contrast-more:border-current contrast-more:dark:border-current',
        themes[type]
      )}
    >
      <div
        className="select-none text-xl ltr:pl-3 ltr:pr-2 rtl:pr-3 rtl:pl-2"
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        }}
      >
        {emoji}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
