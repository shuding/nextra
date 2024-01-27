import { useMDXComponents as useBlogMDXComponents } from 'nextra-theme-blog'

// In case you want to overwrite some of the components
export function useMDXComponents() {
  return useBlogMDXComponents({
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
    )
  })
}
