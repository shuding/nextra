// should be used on server
'use no memo'

import path from 'node:path'
import type { FC, SVGProps } from 'react'
import {
  CPPIcon,
  CsharpIcon,
  CssIcon,
  GoIcon,
  GraphQLIcon,
  JavaScriptIcon,
  JSONIcon,
  MarkdownIcon,
  MdxIcon,
  MoveIcon,
  PythonIcon,
  ReactIcon,
  RustIcon,
  SvelteIcon,
  TerminalIcon,
  TerraformIcon,
  TypeScriptIcon
} from '../icons/index.js'
import type { PreProps } from '../mdx-components/pre/index.js'

function getIcon(language: string) {
  switch (language) {
    case 'javascript':
    case 'js':
    case 'mjs':
    case 'cjs':
      return JavaScriptIcon
    case 'typescript':
    case 'ts':
    case 'mts':
    case 'cts':
      return TypeScriptIcon
    case 'jsx':
    case 'tsx':
      return ReactIcon
    case 'md':
      return MarkdownIcon
    case 'mdx':
      return MdxIcon
    case 'sh':
    case 'bash':
      return TerminalIcon
    case 'css':
      return CssIcon
    case 'c++':
    case 'cpp':
      return CPPIcon
    case 'csharp':
    case 'cs':
    case 'c#':
      return CsharpIcon
    case 'graphql':
    case 'gql':
      return GraphQLIcon
    case 'python':
    case 'py':
      return PythonIcon
    case 'rust':
    case 'rs':
      return RustIcon
    case 'terraform':
    case 'tf':
      return TerraformIcon
    case 'move':
      return MoveIcon
    case 'go':
    case 'golang':
      return GoIcon
    case 'json':
    case 'jsonc':
      return JSONIcon
    case 'svelte':
      return SvelteIcon
  }
}

export function withIcons(
  Component: FC,
  obj?: Record<string, FC<SVGProps<SVGElement>>>
): FC<PreProps> {
  return function Pre(props) {
    let language = props['data-language']
    const filename = props['data-filename']
    if (language === 'diff' && filename) {
      const ext = path.parse(filename).ext.slice(1)
      if (ext) {
        language = ext
      }
    }
    const Icon = language && (obj?.[language] || getIcon(language))

    return (
      <Component
        icon={Icon && <Icon height="1em" className="x:max-w-6 x:shrink-0" />}
        {...props}
      />
    )
  }
}
