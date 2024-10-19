import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'

const blogComponents = getBlogMDXComponents({
  h1: ({ children }) => (
    <h1
      style={{
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundImage: 'linear-gradient(90deg,#7928CA,#FF0080)'
      }}
    >
      {children}
    </h1>
  ),
  DateFormatter: ({ date }) =>
    `Last updated at ${date.toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`
})

export function useMDXComponents(components) {
  return {
    ...blogComponents,
    ...components
  }
}
