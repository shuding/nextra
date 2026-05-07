import { z } from 'zod'
import type { IsEqual } from '../../../nextra/src/server/__tests__/test-utils'
import { LayoutPropsSchema } from '../schemas'
import type { LayoutProps } from '../types.generated'

describe('Assert types', () => {
  test('LayoutProps should be identical', () => {
    const _WithoutLoose = z.strictObject({
      ...LayoutPropsSchema.shape,
      nextThemes: z
        .strictObject(LayoutPropsSchema.shape.nextThemes.unwrap().shape)
        .optional()
    })

    type Expected = z.input<typeof _WithoutLoose>
    type Actual = LayoutProps
    assertType<IsEqual<Expected, Actual>>(true)
    return expectTypeOf<Actual>().toEqualTypeOf<Expected>
  })
})
