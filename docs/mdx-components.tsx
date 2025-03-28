// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { unstable_TSDoc as TSDoc } from '@nextra/tsdoc'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const {
  tr: Tr,
  th: Th,
  table: Table,
  img: Image,
  ...docsComponents
} = getDocsMDXComponents({
  TSDoc(props) {
    return (
      <TSDoc
        {...props}
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
            'https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d44fce6cd8765acbdb0256195e5f16f67471430d/types/react/index.d.ts#L315-L322'
        }}
      />
    )
  }
})

export const useMDXComponents: typeof getDocsMDXComponents = components => ({
  ...docsComponents,
  tr: Tr,
  th: Th,
  thead({ children, ...props }) {
    return (
      <thead {...props}>
        {children.props.children[0].props.children ? (
          children
        ) : (
          <Tr>
            <Th align="left">Option</Th>
            <Th align="left">Type</Th>
            {children.props.children.length === 4 && (
              <Th align="left">Default Value</Th>
            )}
            <Th align="left">Description</Th>
          </Tr>
        )}
      </thead>
    )
  },
  tbody: props => (
    <tbody
      className="break-words first:[&_td]:font-semibold first:[&_td]:text-violet-600 first:[&_td]:dark:text-violet-500 [&_tr]:!bg-transparent"
      {...props}
    />
  ),
  table: props => <Table className="w-full text-sm" {...props} />,
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
