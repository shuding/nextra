import { compileMdx } from '../../compile.js'
import { clean } from '../../../../__test__/test-utils.js'

describe('remarkStaticImages', () => {
  it.only('should insert same import only once', async () => {
    const { result } = await compileMdx(
      `
![](../foo.png)

![](../foo.png)`, {
        mdxOptions: {
          jsx: true,
          outputFormat: 'program'
        },
        staticImage: true
      }
    )

    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      import __img0 from '../foo.png'
      import __img1 from '../foo.png'
      const title = ''
      const frontMatter = {}
      export function useTOC(props) {
        return []
      }
      function MDXLayout(props) {
        const _components = {
          img: 'img',
          p: 'p',
          ..._provideComponents(),
          ...props.components
        }
        return (
          <>
            <_components.p>
              <_components.img placeholder=\\"blur\\" src={__img0} />
            </_components.p>
            {'\\\\n'}
            <_components.p>
              <_components.img placeholder=\\"blur\\" src={__img1} />
            </_components.p>
          </>
        )
      }
      "
    `)
  })


  it('should work with link definitions', async () => {
    const { result } = await compileMdx(
      `
![][link-def]

![][link-def]

[link-def]: /favicon/android-chrome-512x512.png`, {
        mdxOptions: {
          jsx: true,
          outputFormat: 'program'
        },
        staticImage: true
      }
    )

    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      const title = ''
      const frontMatter = {}
      export function useTOC(props) {
        return []
      }
      function MDXLayout(props) {
        const _components = {
          img: 'img',
          p: 'p',
          ..._provideComponents(),
          ...props.components
        }
        return (
          <>
            <_components.p>
              <_components.img src=\\"/favicon/android-chrome-512x512.png\\" alt=\\"\\" />
            </_components.p>
            {'\\\\n'}
            <_components.p>
              <_components.img src=\\"/favicon/android-chrome-512x512.png\\" alt=\\"\\" />
            </_components.p>
          </>
        )
      }
      "
    `)
  })
})
