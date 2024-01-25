import type {
  ComponentProps,
  ComponentPropsWithRef,
  FC,
  ReactElement
} from 'react'
import {
  CssIcon,
  JavaScriptIcon,
  MarkdownIcon,
  MdxIcon,
  TerminalIcon,
  TypeScriptIcon
} from '../icons/index.js'
import type { Pre } from './pre.js'

export const LanguageToIcon: Record<
  string,
  FC<ComponentPropsWithRef<'svg'>>
> = {
  js: JavaScriptIcon,
  jsx: JavaScriptIcon,
  ts: TypeScriptIcon,
  tsx: TypeScriptIcon,
  md: MarkdownIcon,
  mdx: MdxIcon,
  sh: TerminalIcon,
  bash: TerminalIcon,
  css: CssIcon
}

export const withIcons =
  (Component: FC) =>
  // eslint-disable-next-line react/display-name -- HOC
  (props: ComponentProps<typeof Pre>): ReactElement => {
    const language = props['data-language']
    const Icon = language ? LanguageToIcon[language] : null

    return (
      <Component
        icon={Icon && <Icon className="_h-3.5 _w-auto _shrink-0" />}
        {...props}
      />
    )
  }
