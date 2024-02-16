import { clean } from '../../../../__test__/test-utils.js'
import { compileMdx } from '../../compile.js'

describe('remarkStaticImages', () => {
  it('should insert same import only once', async () => {
    const { result } = await compileMdx(
      `
![](../foo.png)

![](../bar.jpeg)

![](../foo.png)`,
      {
        mdxOptions: {
          jsx: true,
          outputFormat: 'program'
        },
        staticImage: true
      }
    )

    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      import __img0 from '../foo.png'
      import __img1 from '../bar.jpeg'
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
              <_components.img placeholder="blur" src={__img0} />
            </_components.p>
            {'\\n'}
            <_components.p>
              <_components.img placeholder="blur" src={__img1} />
            </_components.p>
            {'\\n'}
            <_components.p>
              <_components.img placeholder="blur" src={__img0} />
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
![One][link-def]

![](../foo.png)

![](./bar.svg)

![Two][link-def]

![External][external-link-def]

[link-def]: ../foo.png
[external-link-def]: https://foo.png`,
      {
        mdxOptions: {
          jsx: true,
          outputFormat: 'program'
        },
        staticImage: true
      }
    )

    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      import __img0 from '../foo.png'
      import __img1 from './bar.svg'
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
              <_components.img alt="One" placeholder="blur" src={__img0} />
            </_components.p>
            {'\\n'}
            <_components.p>
              <_components.img placeholder="blur" src={__img0} />
            </_components.p>
            {'\\n'}
            <_components.p>
              <_components.img src={__img1} />
            </_components.p>
            {'\\n'}
            <_components.p>
              <_components.img alt="Two" placeholder="blur" src={__img0} />
            </_components.p>
            {'\\n'}
            <_components.p>
              <_components.img src="https://foo.png" alt="External" />
            </_components.p>
          </>
        )
      }
      "
    `)
  })
})
