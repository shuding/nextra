import { useMDXComponents } from '../mdx-components.js'

describe('useMDXComponents', () => {
  test('when `MDXComponent`s are provided', () => {
    const components = useMDXComponents({ h2: () => null })
    expectTypeOf(components['img']).toBeFunction()
    expectTypeOf(components['a']).toBeFunction()
    expectTypeOf(components['h2']).toBeFunction()

    // @ts-expect-error -- assert does not exist on type
    expectTypeOf(components['h1']).not.toBeFunction()
  })
  test('when `MDXComponent`s are not provided', () => {
    const components = useMDXComponents()
    expectTypeOf(components['img']).toBeFunction()
    expectTypeOf(components['a']).toBeFunction()

    // @ts-expect-error -- assert does not exist on type
    expectTypeOf(components['h1']).not.toBeFunction()
  })
})
