import type { ComponentProps, FC, ReactNode } from 'react'

type Comp = FC<ComponentProps<'blockquote'>>
type T = (typeof GITHUB_ALERTS)[number]

const GITHUB_ALERT_RE = /^\s*\[!(?<name>.*?)]\s*$/

const GITHUB_ALERTS = [
  'note',
  'tip',
  'important',
  'warning',
  'caution'
] as const

const GITHUB_ALERT_TYPES = new Set<string>(GITHUB_ALERTS)

export function withGitHubAlert(
  Blockquote: Comp | string,
  fn: FC<{ type: T; children: ReactNode }>
): Comp {
  return function HOC(props) {
    if (Array.isArray(props.children)) {
      const str = props.children[1].props.children
      if (typeof str === 'string') {
        const alertName = str.match(GITHUB_ALERT_RE)?.groups?.name.toLowerCase()

        if (alertName && GITHUB_ALERT_TYPES.has(alertName)) {
          return fn({
            ...props,
            type: alertName as T,
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
    }

    return typeof Blockquote === 'string' ? (
      Blockquote
    ) : (
      <Blockquote {...props} />
    )
  }
}
