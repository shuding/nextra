import { useMDXComponents } from '../mdx-components'

describe('useMDXComponents', () => {
  test('when `MDXComponent`s are provided', () => {
    const components = useMDXComponents({ figcaption: () => null })
    expectTypeOf(components['img']).toBeFunction()
    expectTypeOf(components['a']).toBeFunction()
    expectTypeOf(components['h1']).toBeFunction()
    expectTypeOf(components['figcaption']).toBeFunction()

    // @ts-expect-error -- assert does not exist on type
    expectTypeOf(components['figure']).not.toBeFunction()
  })
  test('when `MDXComponent`s are not provided', () => {
    const components = useMDXComponents()
    expectTypeOf(components['img']).toBeFunction()
    expectTypeOf(components['a']).toBeFunction()
    expectTypeOf(components['h1']).toBeFunction()

    // @ts-expect-error -- assert does not exist on type
    expectTypeOf(components['figure']).not.toBeFunction()
  })
})
