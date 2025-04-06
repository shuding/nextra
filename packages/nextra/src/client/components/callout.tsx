import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import {
  GitHubAlertCautionIcon,
  GitHubAlertImportantIcon,
  GitHubAlertNoteIcon,
  GitHubAlertTipIcon,
  GitHubAlertWarningIcon,
  InformationCircleIcon
} from '../icons/index.js'

const test = {
  i: ['#0969da', '#0969da', '#1f6feb', '#4493f8'],
  t: ['#1a7f37', '#1a7f37', '#238636', '#3fb950'],
  im: ['#8250df', '#8250df', '#8957e5', '#ab7df8'],
  w: ['#9a6700', '#9a6700', '#9e6a03', '#d29922'],
  c: ['#cf222e', '#d1242f', '#da3633', '#f85149'],
}

const TypeToEmoji = {
  default: '💡',
  error: '🚫',
  info: <InformationCircleIcon height="16" className="x:mt-1" />,
  warning: '⚠️',
  'github-note': <GitHubAlertNoteIcon height="16" className="x:mt-1.5" />,
  'github-tip': <GitHubAlertTipIcon height="16" className="x:mt-1.5" />,
  'github-important': (
    <GitHubAlertImportantIcon height="16" className="x:mt-1.5" />
  ),
  'github-warning': <GitHubAlertWarningIcon height="16" className="x:mt-1.5" />,
  'github-caution': <GitHubAlertCautionIcon height="16" className="x:mt-1.5" />
}

type CalloutType = keyof typeof TypeToEmoji
export type GitHubAlertType =
  | 'github-note'
  | 'github-tip'
  | 'github-important'
  | 'github-warning'
  | 'github-caution'

const classes: Record<CalloutType, string> = {
  default: cn(
    'x:border-orange-100 x:bg-orange-50 x:text-orange-800 x:dark:border-orange-400/30 x:dark:bg-orange-400/20 x:dark:text-orange-300'
  ),
  error: cn(
    'x:border-red-200 x:bg-red-100 x:text-red-900 x:dark:border-red-200/30 x:dark:bg-red-900/30 x:dark:text-red-200'
  ),
  info: cn(
    'x:border-blue-200 x:bg-blue-100 x:text-blue-900 x:dark:border-blue-200/30 x:dark:bg-blue-900/30 x:dark:text-blue-200'
  ),
  warning: cn(
    'x:border-yellow-100 x:bg-yellow-50 x:text-yellow-900 x:dark:border-yellow-200/30 x:dark:bg-yellow-700/30 x:dark:text-yellow-200'
  ),
  'github-note': cn(
    'x:border-blue-200 x:bg-blue-100 x:text-blue-900 x:dark:border-blue-200/30 x:dark:bg-blue-900/30 x:dark:text-blue-200',
    'x:border-blue-700 x:text-blue-700 x:dark:border-blue-600 x:dark:text-blue-400'
  ),
  'github-tip': cn(
    'x:border-green-200 x:bg-green-100 x:text-green-900 x:dark:border-green-200/30 x:dark:bg-green-900/30 x:dark:text-green-200',
    'x:border-green-700 x:text-green-700 x:dark:border-green-800 x:dark:text-green-500',
  ),
  'github-important': cn(
    'x:border-purple-200 x:bg-purple-100 x:text-purple-900 x:dark:border-purple-200/30 x:dark:bg-purple-900/30 x:dark:text-purple-200',
    'x:border-purple-600 x:text-purple-600 x:dark:border-purple-600 x:dark:text-purple-400',
  ),
  'github-warning': cn(
    'x:border-yellow-100 x:bg-yellow-50 x:text-yellow-900 x:dark:border-yellow-200/30 x:dark:bg-yellow-700/30 x:dark:text-yellow-200',
    'x:border-yellow-700 x:text-yellow-700 x:dark:border-yellow-700 x:dark:text-yellow-500',
  ),
  'github-caution': cn(
    'x:border-red-200 x:bg-red-100 x:text-red-900 x:dark:border-red-200/30 x:dark:bg-red-900/30 x:dark:text-red-200',
    'x:border-red-700 x:text-red-700 x:dark:border-red-600 x:dark:text-red-500',
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
   * - `'💡'` for `type: 'default'`
   * - `'🚫'` for `type: 'error'`
   * - `<InformationCircleIcon />` for `type: 'info'`
   * - `'⚠️'` for `type: 'warning'`
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
