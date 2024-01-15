import { compileMdx } from '../../compile.js'

describe('remarkStaticImages', () => {
  it('should work with link definitions', async () => {
    const { result } = await compileMdx(
      `
![][link-def]

![][link-def]

[link-def]: /favicon/android-chrome-512x512.png`, {
        mdxOptions: {
          jsx: true
        }
      }
    )

    expect(result).toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic @jsxImportSource react*/
      \\"use strict\\";
      const {useMDXComponents: _provideComponents} = arguments[0];
      const title = \\"\\";
      const frontMatter = {};
      function useTOC(props) {
        return [];
      }
      function _createMdxContent(props) {
        const _components = {
          img: \\"img\\",
          p: \\"p\\",
          ..._provideComponents(),
          ...props.components
        };
        return <><_components.p><_components.img src=\\"/favicon/android-chrome-512x512.png\\" alt=\\"\\" /></_components.p>{\\"\\\\n\\"}<_components.p><_components.img src=\\"/favicon/android-chrome-512x512.png\\" alt=\\"\\" /></_components.p></>;
      }
      return {
        title,
        frontMatter,
        useTOC,
        default: _createMdxContent
      };
      "
    `)
  })
})
