import type { ComponentProps, FC, ReactNode } from 'react'

type T = FC<ComponentProps<'blockquote'>>

const GITHUB_ALERT_RE = /^\s*\[!(?<name>.*?)]\s*$/

const GITHUB_ALERTS = [
  'note',
  'tip',
  'important',
  'warning',
  'caution'
] as const

const GITHUB_ALERT_TYPES = new Set(GITHUB_ALERTS)

export function withGitHubAlert(
  Blockquote: T | string,
  fn: FC<{
    type: (typeof GITHUB_ALERTS)[number]
    children: ReactNode
  }>
): T {
  return props => {
    if (Array.isArray(props.children)) {
      const el = props.children[1]
      const content = typeof el === 'object' && el.props.children
      const alertName = content
        .match(GITHUB_ALERT_RE)
        ?.groups?.name.toLowerCase()

      if (GITHUB_ALERT_TYPES.has(alertName)) {
        return fn({
          ...props,
          type: alertName,
          children: [
            <b key={0}>
              {alertName[0].toUpperCase()}
              {alertName.slice(1)}
            </b>,
            ...props.children.slice(2)
          ]
        })
      }
    }

    return typeof Blockquote === 'string' ? (
      Blockquote
    ) : (
      <Blockquote {...props} />
    )
  }
}
