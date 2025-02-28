import { compileMdx } from 'nextra/compile'
import { MDXRemote } from 'nextra/mdx-remote'
import type { FC } from 'react'

export const ToggleVisibilitySection: FC<{
  element: string
  property: string
}> = async ({ element, property }) => {
  const rawJs =
    await compileMdx(`### Toggle Visibility [#toggle-visibility-for-${property}]

You can toggle visibility of the ${element} on the specific pages by setting \`theme.${property}\` property in the \`_meta.js\` file:

~~~js filename="_meta.js"
export default {
  'my-page': {
    theme: {
      ${property}: false // Hide ${property} on this page
    }
  }
}
~~~`)
  return <MDXRemote compiledSource={rawJs} />
}
