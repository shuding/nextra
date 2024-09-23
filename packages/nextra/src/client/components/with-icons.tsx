import type { FC, ReactElement, SVGProps } from 'react'
import {
  CPPIcon,
  CsharpIcon,
  CssIcon,
  GraphQLIcon,
  JavaScriptIcon,
  MarkdownIcon,
  MdxIcon,
  MoveIcon,
  PythonIcon,
  RustIcon,
  TerminalIcon,
  TerraformIcon,
  TypeScriptIcon
} from '../icons/index.js'
import type { PreProps } from '../mdx-components/pre/index.js'

export const LanguageToIcon: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  js: JavaScriptIcon,
  jsx: JavaScriptIcon,
  ts: TypeScriptIcon,
  tsx: TypeScriptIcon,
  md: MarkdownIcon,
  mdx: MdxIcon,
  sh: TerminalIcon,
  bash: TerminalIcon,
  css: CssIcon,
  'c++': CPPIcon,
  cpp: CPPIcon,
  csharp: CsharpIcon,
  cs: CsharpIcon,
  'c#': CsharpIcon,
  graphql: GraphQLIcon,
  python: PythonIcon,
  py: PythonIcon,
  rust: RustIcon,
  rs: RustIcon,
  terraform: TerraformIcon,
  tf: TerraformIcon,
  move: MoveIcon
}

export const withIcons =
  (Component: FC) =>
  // eslint-disable-next-line react/display-name -- HOC
  (props: PreProps): ReactElement => {
    const language = props['data-language']
    const Icon = language ? LanguageToIcon[language] : null

    return (
      <Component
        icon={Icon && <Icon height="16" className="_shrink-0" />}
        {...props}
      />
    )
  }
