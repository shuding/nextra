import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import {
  GitHubCautionIcon,
  GitHubImportantIcon,
  GitHubNoteIcon,
  GitHubTipIcon,
  GitHubWarningIcon
} from '../icons/index.js'

const TypeToEmoji = {
  default: <GitHubTipIcon height="16" className="x:mt-1.5" />,
  error: <GitHubCautionIcon height="16" className="x:mt-1.5" />,
  info: <GitHubNoteIcon height="16" className="x:mt-1.5" />,
  warning: <GitHubWarningIcon height="16" className="x:mt-1.5" />,
  important: <GitHubImportantIcon height="16" className="x:mt-1.5" />
}

type CalloutType = keyof typeof TypeToEmoji

const classes: Record<CalloutType, string> = {
  default: cn(
    'x:bg-green-100 x:dark:bg-green-900/30',
    'x:text-green-700 x:dark:text-green-500',
    'x:border-green-700 x:dark:border-green-800'
  ),
  error: cn(
    'x:bg-red-100 x:dark:bg-red-900/30',
    'x:text-red-700 x:dark:text-red-500',
    'x:border-red-700 x:dark:border-red-600'
  ),
  info: cn(
    'x:bg-blue-100 x:dark:bg-blue-900/30',
    'x:text-blue-700 x:dark:text-blue-400',
    'x:border-blue-700 x:dark:border-blue-600'
  ),
  warning: cn(
    'x:bg-yellow-50 x:dark:bg-yellow-700/30',
    'x:text-yellow-700 x:dark:text-yellow-500',
    'x:border-yellow-700'
  ),
  important: cn(
    'x:bg-purple-100 x:dark:bg-purple-900/30',
    'x:text-purple-600 x:dark:text-purple-400',
    'x:border-purple-600'
  )
}

type CalloutProps = {
  /**
   * Defines the style of the callout and determines the default icon if `emoji` is not provided.
   *
   * If set to `null`, no border, background, or text styling will be applied.
   * @default 'default'
   */
  type?: CalloutType | null
  /**
   * Icon displayed in the callout. Can be a string emoji or a custom React element.
   *
   * Default values based on `type`:
   * - `<GitHubTipIcon />` for `type: 'default'`
   * - `<GitHubCautionIcon />` for `type: 'error'`
   * - `<GitHubNoteIcon />` for `type: 'info'`
   * - `<GitHubWarningIcon />` for `type: 'warning'`
   * - `<GitHubImportantIcon />` for `type: 'important'`
   * @default Determined by `type`
   */
  emoji?: ReactNode
  /** Content to be displayed inside the callout. */
  children: ReactNode
}

export const Callout: FC<CalloutProps> = ({
  children,
  type = 'default',
  emoji = type && TypeToEmoji[type]
}) => {
  return (
    <div
      className={cn(
        'nextra-callout x:overflow-x-auto x:mt-6 x:flex x:rounded-lg x:border x:py-2 x:pe-4',
        'x:contrast-more:border-current!',
        type && classes[type]
      )}
    >
      <div
        className="x:select-none x:text-xl x:ps-3 x:pe-2"
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        }}
        data-pagefind-ignore="all"
      >
        {emoji}
      </div>
      <div className="x:w-full x:min-w-0 x:leading-7">{children}</div>
    </div>
  )
}
