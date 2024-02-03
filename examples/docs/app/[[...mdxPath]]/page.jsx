import path from 'path'
import { useMDXComponents } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'

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

export default async function Page(props) {
  const { mdxPath = [''] } = props.params

  // const filePath = path.join(process.cwd(), 'mdx', ...mdxPath)

  // const { result } = compileMdx(filePath)

  const result = await import(`../../mdx/${FileMap[mdxPath.join('/')]}`)
  console.log({ result })

  const components = useMDXComponents()

  return (
    <div>
      <result.default components={components} />
    </div>
  )
}
