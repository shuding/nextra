// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { unstable_TSDoc as TSDoc } from 'nextra/tsdoc'

const { img: Image, ...docsComponents } = getDocsMDXComponents({
  TSDoc({
    componentName,
    groupKeys,
    packageName = 'nextra/components',
    ...props
  }) {
    let code: string

    if (componentName) {
      const result = groupKeys
        ? `Omit<MyProps, keyof ${groupKeys}> & { '...props': ${groupKeys} }>`
        : 'MyProps'

      code = `
import { ComponentProps } from 'react'
import type { ${componentName.split('.')[0]} } from '${packageName}'
type MyProps = ComponentProps<typeof ${componentName}>
type $ = ${result}

export default $`
    } else {
      code = props.code
    }

    return (
      <TSDoc
        {...props}
        code={code}
        typeLinkMap={{
          GitHubIcon:
            'https://github.com/shuding/nextra/blob/main/packages/nextra/src/client/icons/github.svg',
          DiscordIcon:
            'https://github.com/shuding/nextra/blob/main/packages/nextra/src/client/icons/discord.svg',
          PagefindSearchOptions:
            'https://github.com/CloudCannon/pagefind/blob/248f81d172316a642a83527fa92180abbb7f9c49/pagefind_web_js/types/index.d.ts#L72-L82',
          ReactNode:
            'https://github.com/DefinitelyTyped/DefinitelyTyped/blob/51fcf2a1c5da6da885c1f8c11224917bbc011493/types/react/index.d.ts#L426-L439',
          ReactElement:
            'https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d44fce6cd8765acbdb0256195e5f16f67471430d/types/react/index.d.ts#L315-L322',
          compileMdx:
            'https://github.com/shuding/nextra/blob/fb376a635de7fa287d5ffec9dbb5f40f1cfdb0f6/packages/nextra/src/server/compile.ts#L64',
          TabItem:
            'https://github.com/shuding/nextra/blob/fb376a635de7fa287d5ffec9dbb5f40f1cfdb0f6/packages/nextra/src/client/components/tabs/index.client.tsx#L21',
          TabObjectItem:
            'https://github.com/shuding/nextra/blob/fb376a635de7fa287d5ffec9dbb5f40f1cfdb0f6/packages/nextra/src/client/components/tabs/index.client.tsx#L23',
          PageMapItem:
            'https://github.com/shuding/nextra/blob/fb376a635de7fa287d5ffec9dbb5f40f1cfdb0f6/packages/nextra/src/types.ts#L66',
          ThemeProviderProps:
            'https://github.com/pacocoursey/next-themes/blob/c89d0191ce0f19215d7ddfa9eb28e1e4f94d37e5/next-themes/src/types.ts#L34-L57',
          LastUpdated:
            'https://github.com/shuding/nextra/blob/main/packages/nextra-theme-docs/src/components/last-updated.tsx'
        }}
      />
    )
  }
})

export const useMDXComponents: typeof getDocsMDXComponents = components => ({
  ...docsComponents,
  img: props => (
    <Image
      {...props}
      className="nextra-border rounded-xl border drop-shadow-sm"
    />
  ),
  figure: props => <figure className="mt-6" {...props} />,
  figcaption: props => (
    <figcaption className="mt-2 text-center text-sm" {...props} />
  ),
  ...components
})
