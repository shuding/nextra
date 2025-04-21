import cn from 'clsx'
import type { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react'
import {
  GitHubCautionIcon,
  GitHubImportantIcon,
  GitHubNoteIcon,
  GitHubTipIcon,
  GitHubWarningIcon
} from '../icons/index.js'

const TypeToEmoji = {
  default: <GitHubTipIcon height=".8em" className="x:mt-[.3em]" />,
  error: <GitHubCautionIcon height=".8em" className="x:mt-[.3em]" />,
  info: <GitHubNoteIcon height=".8em" className="x:mt-[.3em]" />,
  warning: <GitHubWarningIcon height=".8em" className="x:mt-[.3em]" />,
  important: <GitHubImportantIcon height=".8em" className="x:mt-[.3em]" />
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

type CalloutProps = HTMLAttributes<HTMLDivElement> & {
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
}

/**
 * A built-in component to show important information to the reader.
 *
 * @example
 * <Callout>
 *   A **callout** is a short piece of text intended to attract attention.
 * </Callout>
 *
 * <Callout type="info">
 *   A **callout** is a short piece of text intended to attract attention.
 * </Callout>
 *
 * <Callout type="warning">
 *   A **callout** is a short piece of text intended to attract attention.
 * </Callout>
 *
 * <Callout type="error">
 *   A **callout** is a short piece of text intended to attract attention.
 * </Callout>
 *
 * <Callout type="important">
 *   A **callout** is a short piece of text intended to attract attention.
 * </Callout>
 *
 * @usage
 * ### Default
 *
 * <Callout>Helpful advice for doing things better or more easily.</Callout>
 *
 * ```mdx
 * import { Callout } from 'nextra/components'
 *
 * <Callout>Helpful advice for doing things better or more easily.</Callout>
 * ```
 *
 * ### Info
 *
 * <Callout type="info">
 *   Useful information that users should know, even when skimming content.
 * </Callout>
 *
 * ```mdx
 * import { Callout } from 'nextra/components'
 *
 * <Callout type="info">
 *   Useful information that users should know, even when skimming content.
 * </Callout>
 * ```
 *
 * ### Warning
 *
 * <Callout type="warning">
 *   Urgent info that needs immediate user attention to avoid problems.
 * </Callout>
 *
 * ```mdx
 * import { Callout } from 'nextra/components'
 *
 * <Callout type="warning">
 *   Urgent info that needs immediate user attention to avoid problems.
 * </Callout>
 * ```
 *
 * ### Error
 *
 * <Callout type="error">
 *   Advises about risks or negative outcomes of certain actions.
 * </Callout>
 *
 * ```mdx
 * import { Callout } from 'nextra/components'
 *
 * <Callout type="error">
 *   Advises about risks or negative outcomes of certain actions.
 * </Callout>
 * ```
 *
 * ### Important
 *
 * <Callout type="important">
 *   Key information users need to know to achieve their goal.
 * </Callout>
 *
 * ```mdx
 * import { Callout } from 'nextra/components'
 *
 * <Callout type="important">
 *   Key information users need to know to achieve their goal.
 * </Callout>
 * ```
 *
 * ### Custom icon
 *
 * <Callout type="info" emoji="⭐">Nextra has 13k stars on GitHub!</Callout>
 *
 * ```mdx
 * import { Callout } from 'nextra/components'
 *
 * <Callout type="info" emoji="⭐">Nextra has 13k stars on GitHub!</Callout>
 * ```
 */
export const Callout: FC<CalloutProps> = ({
  className,
  type = 'default',
  emoji = type && TypeToEmoji[type],
  ...props
}) => {
  return (
    <div
      className={cn(
        'nextra-callout x:overflow-x-auto x:not-first:mt-[1.25em] x:flex x:rounded-lg x:border x:py-[.5em] x:pe-[1em]',
        'x:contrast-more:border-current!',
        type && classes[type]
      )}
    >
      <div
        className="x:select-none x:text-[1.25em] x:ps-[.6em] x:pe-[.4em]"
        style={style}
        data-pagefind-ignore="all"
      >
        {emoji}
      </div>
      <div className={cn('x:w-full x:min-w-0', className)} {...props} />
    </div>
  )
}

const style: CSSProperties = {
  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
}
