import React, { ReactElement, ReactNode, FC, PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import type { PageOpts } from 'nextra'
import type { LayoutProps, NextraBlogTheme } from './types'
import { BlogProvider } from './blog-context'
import { ArticleLayout } from './article-layout'
import { PostsLayout } from './posts-layout'
import { PageLayout } from './page-layout'
import { DEFAULT_CONFIG } from './constants'
import { components } from './mdx-theme'
import { Components } from '@mdx-js/react/lib'

const layoutMap = {
  post: ArticleLayout,
  page: PageLayout,
  posts: PostsLayout,
  tag: PostsLayout
}

const BlogLayout = ({
  config,
  children,
  opts
}: LayoutProps & { children: ReactNode }): ReactElement => {
  const type = opts.meta.type || 'post'
  const Layout = layoutMap[type]
  if (!Layout) {
    throw new Error(
      `Nextra-themes-blog does not support the layout type "${type}" It only supports "post", "page", "posts" and "tag"`
    )
  }
  return (
    <BlogProvider opts={opts} config={config}>
      <Layout>{children}</Layout>
    </BlogProvider>
  )
}
interface Props {
  pageOpts: PageOpts
  themeConfig: NextraBlogTheme
}
function Layout({ children, themeConfig, pageOpts }: PropsWithChildren<Props>) {
  const extendedConfig = { ...DEFAULT_CONFIG, ...themeConfig }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogLayout config={extendedConfig} opts={pageOpts}>
        {children}
      </BlogLayout>
    </ThemeProvider>
  )
}

// Make sure the same component is always returned so Next.js will render the
// stable layout. We then put the actual content into a global store and use
// the route to identify it.
export default function withLayout(
  MdxContent: FC<{ components: Components }>,
  pageOpts: PageOpts,
  themeConfig: NextraBlogTheme
) {
  return (
    <Layout pageOpts={pageOpts} themeConfig={themeConfig}>
      <MdxContent components={components} />
    </Layout>
  )
}

export { useBlogContext } from './blog-context'
export * from './types'
