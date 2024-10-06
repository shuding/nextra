import type { FC, ReactElement, SVGProps } from 'react'
import {
  CPPIcon,
  CsharpIcon,
  CssIcon,
  GoIcon,
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

const LanguageToIcon: Record<string, FC<SVGProps<SVGElement>>> = {
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
  move: MoveIcon,
  go: GoIcon,
  golang: GoIcon
}

export const withIcons =
  (Component: FC) =>
  // eslint-disable-next-line react/display-name -- HOC
  (props: PreProps): ReactElement => {
    const language = props['data-language']
    const Icon = language && LanguageToIcon[language]

    return (
      <Component
        icon={Icon && <Icon height="16" className="_max-w-6 _shrink-0" />}
        {...props}
      />
    )
  }
