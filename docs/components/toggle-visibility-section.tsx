import { useMDXComponents } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'
import { RemoteContent } from 'nextra/components'
import type { FC } from 'react'

export const ToggleVisibilitySection: FC<{
  element: string
  property: string
}> = async ({ element, property }) => {
  const { result } = await compileMdx(`### Toggle Visibility

You can toggle visibility of the ${element} on the specific pages by setting \`theme.${property}\` property in the \`_meta.js\` file:

\`\`\`js filename="_meta.js"
export default {
  'my-page': {
    theme: {
      ${property}: false // Hide ${property} on this page
    }
  }
}
\`\`\``)
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    <RemoteContent compiledSource={result} components={useMDXComponents()} />
  )
}
