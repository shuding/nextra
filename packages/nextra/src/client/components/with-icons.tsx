import type { ComponentPropsWithRef, FC, ReactElement } from 'react'
import {
  CssIcon,
  JavaScriptIcon,
  MarkdownIcon,
  MdxIcon,
  TerminalIcon,
  TypeScriptIcon
} from '../icons/index.js'
import type { PreProps } from './pre/index.js'

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
  (props: PreProps): ReactElement => {
    const language = props['data-language']
    const Icon = language ? LanguageToIcon[language] : null

    return (
      <Component
        icon={Icon && <Icon className="_h-3.5 _w-auto _shrink-0" />}
        {...props}
      />
    )
  }
