import fs from 'fs/promises'
import { MDXRemote } from 'next-mdx-remote/rsc'
import dynamic from 'next/dynamic'
import { Wrapper } from 'nextra-theme-docs/client'
import { defaultServerComponents } from 'nextra-theme-docs/server'
import { compileMdx } from 'nextra/compile'
import {
  Callout,
  File,
  FileTree,
  Folder,
  RemoteContent,
  Tab,
  Tabs
} from 'nextra/components'
// import { collectFiles } from 'nextra/page-map'
// import { getPage } from '../_nextra/mdx-pages'
// import MDXContent, { useTOC } from '../../../docs/en/index.mdx'

// const { pages, pageMap } = await collectFiles({
//   dir: './docs/en',
//   route: '/'
// })

type PageProps = {
  params: {
    lang: string
    slug: string[]
  }
}

// const MDXContent = dynamic(() => import('../../../docs/en/index.mdx'), {
//   // ssr: true
// })
// console.log(res.useTOC)
export default async function Page({ params }: PageProps) {
  const pathname = `/${[params.lang, ...(params.slug || [])].join('/')}`

  return pathname
  const { default: MDXContent, useTOC, ...rest } = {} as any//await getPage(pathname) // getPage(pathname)
  // console.log({rest})
  // const content = await fs.readFile(`./docs/${filePath}.mdx`, 'utf8')

  // const { result: compiledSource } = await compileMdx(content)

  return (
    <Wrapper toc={useTOC()}>
      <MDXContent
        components={{
          ...defaultServerComponents,
          // Fixes Error: Cannot access FileTree.File on the server
          FileTree: Object.assign(props => <FileTree {...props} />, {
            Folder: props => <Folder {...props} />,
            File: props => <File {...props} />
          }),
          Tabs: Object.assign(props => <Tabs {...props} />, {
            Tab: props => <Tab {...props} />
          }),
          Callout
        }}
      />
    </Wrapper>
    // <RemoteContent
    //   compiledSource={compiledSource}
    //   components={{
    //   }}
    // />
    // <MDXRemote
    //   source={content}
    //   components={{
    //   }}
    //   options={{
    //     scope: {
    //       myVar: 22
    //     }
    //   }}
    // />
  )
}

// export async function generateStaticParams({ params }) {
//   const res = Object.keys(pages).map(route => {
//     const slug = route.replace('/', '').split('/').filter(Boolean)
//     return {
//       ...(slug.length && { slug }),
//       lang: 'en'
//     }
//   })
//
//   return res
// }
