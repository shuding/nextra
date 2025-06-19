import type { z } from 'zod'
import type { IsEqual } from '../../../nextra/src/server/__tests__/test-utils'
import type { LayoutPropsSchema } from '../schemas'
import type { LayoutProps } from '../types.generated'

describe('Assert types', () => {
  test('LayoutProps should be identical', () => {
    type Expected = z.input<typeof LayoutPropsSchema>
    type Actual = LayoutProps
    assertType<IsEqual<Expected, Actual>>(true)
    return expectTypeOf<Actual>().toEqualTypeOf<Expected>
  })
})
