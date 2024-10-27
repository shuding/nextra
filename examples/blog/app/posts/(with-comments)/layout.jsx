import { Comments } from 'nextra-theme-blog'

export default function CommentsLayout({ children }) {
  return (
    <>
      {children}
      <Comments lang="en" appId="a2d11511-7012-4254-9483-cb49c8f4dfe8" />
    </>
  )
}
