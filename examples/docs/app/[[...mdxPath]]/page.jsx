import { useMDXComponents } from 'nextra-theme-docs'

const FileMap = {
  'advanced/code-highlighting': 'advanced/code-highlighting.mdx',
  'features/i18n': 'features/i18n.mdx',
  'features/image': 'features/image.mdx',
  'features/latex': 'features/latex.mdx',
  'features/mdx': 'features/mdx.mdx',
  'features/ssg': 'features/ssg.mdx',
  'features/themes': 'features/themes.mdx',
  'get-started': 'get-started.mdx',
  '': 'index.mdx',
  'themes/blog': 'themes/blog/index.mdx',
  'themes/docs/bleed': 'themes/docs/bleed.mdx',
  'themes/docs/callout': 'themes/docs/callout.mdx',
  'themes/docs/configuration': 'themes/docs/configuration.mdx',
  'themes/docs': 'themes/docs/index.mdx',
  'themes/docs/tabs': 'themes/docs/tabs.mdx'
}

export function generateStaticParams() {
  return Object.keys(FileMap).map(mdxPath => ({ mdxPath: mdxPath.split('/') }))
}

export async function generateMetadata({ params: { mdxPath = [''] } }) {
  // Can't use destructuring
  const result = await import(`../../mdx/${FileMap[mdxPath.join('/')]}`)
  return result.metadata
}

export default async function Page({ params: { mdxPath = [''] } }) {
  const {
    default: MDXContent,
    useTOC,
    metadata,
    title,
    ...props
  } = await import(`../../mdx/${FileMap[mdxPath.join('/')]}`)
  console.log(props)

  const { wrapper: Wrapper, ...components } = useMDXComponents()

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent components={components} />
    </Wrapper>
  )
}
