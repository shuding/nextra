/* eslint-disable react/jsx-curly-brace-presence, @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      p: 'p',
      ...props.components
    },
    { TypeTable } = _components
  if (!TypeTable) _missingMdxReference('TypeTable', true)
  return (
    <>
      <>
        <TypeTable
          type={{
            name: {
              type: 'string',
              default: 'Henry',
              description: (
                <>
                  <_components.p>{'The name of player'}</_components.p>
                </>
              )
            },
            age: {
              type: 'timestamp',
              default: undefined
            }
          }}
        />
      </>
    </>
  )
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {}
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  )
}
function _missingMdxReference(id, component) {
  throw new Error(
    'Expected ' +
      (component ? 'component' : 'object') +
      ' `' +
      id +
      '` to be defined: you likely forgot to import, pass, or provide it.'
  )
}